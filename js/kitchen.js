// js/kitchen.js

// ฟังก์ชัน initializeKitchenPage จะถูกเรียกหลังจากไฟล์ภาษาโหลดเสร็จ (จาก kitchen.html)
function initializeKitchenPage() {
    const kitchenOrdersContainer = document.getElementById('kitchen-orders-container');
    const kitchenLoadingPlaceholder = document.getElementById('kitchen-loading-placeholder');
    const refreshBtn = document.getElementById('refresh-kitchen-orders-btn');

    // --- Language and Translation Setup ---
    let displayLang = localStorage.getItem('kitchenDisplayLang') || 'th';
    if (displayLang !== 'th' && displayLang !== 'my') {
        displayLang = 'th'; // Default to Thai if invalid lang in storage
    }

    // KITCHEN_LANG_XX (เช่น KITCHEN_LANG_TH) ควรจะถูกโหลดมาจากไฟล์ lang/xx.js
    // และผูกกับ window object แล้ว
    const LANG_DATA = displayLang === 'my'
        ? (window.KITCHEN_LANG_MY || window.KITCHEN_LANG_TH || {}) // Fallback to Thai if Burmese not loaded
        : (window.KITCHEN_LANG_TH || {}); // Default to empty if Thai not loaded (should not happen)

    // ฟังก์ชันสำหรับดึงคำแปล
    function _t(key, fallbackText = "") {
        // จัดการกรณีข้อความที่มี placeholder เช่น "รายการ {0} ถูกทำเครื่องหมาย..."
        if (typeof LANG_DATA[key] === 'string' && arguments.length > 1) {
            let translatedText = LANG_DATA[key];
            for (let i = 1; i < arguments.length; i++) {
                translatedText = translatedText.replace(`{${i-1}}`, arguments[i]);
            }
            return translatedText;
        }
        return LANG_DATA[key] || fallbackText || key;
    }

    // --- Update Static UI Text based on Language ---
    document.title = _t('pageTitle', 'ห้องครัว - รายการสั่งอาหาร');
    const kitchenNavTitleEl = document.getElementById('kitchen-nav-title');
    if (kitchenNavTitleEl) kitchenNavTitleEl.textContent = _t('pageTitle', 'ระบบจัดการร้านอาหาร (ห้องครัว)');

    const kitchenOrdersHeaderEl = document.getElementById('kitchen-orders-header');
    if (kitchenOrdersHeaderEl) kitchenOrdersHeaderEl.textContent = _t('ordersToPrepareHeader', 'รายการอาหารที่ต้องเตรียม');

    const kitchenRefreshBtnTextEl = document.getElementById('kitchen-refresh-button-text');
    if (kitchenRefreshBtnTextEl) kitchenRefreshBtnTextEl.textContent = _t('refreshButton', 'รีเฟรชรายการ');

    if (kitchenLoadingPlaceholder) kitchenLoadingPlaceholder.textContent = _t('actionSpinnerLoading', 'กำลังโหลดรายการอาหาร...');


    // --- Timer and Color Logic ---
    let elapsedTimeIntervalId = null;

    function updateElapsedTimesAndButtonColors() {
        document.querySelectorAll('.kitchen-action-btn:not(.item-served-button)').forEach(button => {
            const orderTimestampStr = button.dataset.timestampForItem;
            if (orderTimestampStr) {
                const startTime = new Date(orderTimestampStr).getTime();
                const now = new Date().getTime();
                const diffSeconds = Math.max(0, Math.floor((now - startTime) / 1000));

                button.innerHTML = `${_t('statusWaitingText', 'รอ')} ${diffSeconds} ${_t('secondsUnit', 'วิ')} <i class="bi bi-hourglass-split"></i>`;

                const maxWaitSeconds = 900; // 15 นาที
                const progress = Math.min(diffSeconds / maxWaitSeconds, 1);
                const hue = 60 - (60 * progress);
                const lightness = 85 - (30 * progress);
                const saturation = 100;

                button.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                button.style.borderColor = `hsl(${hue}, ${saturation}%, ${Math.max(40, lightness - 10)}%)`;
                button.style.color = lightness > 65 ? '#333' : '#fff';
            }
        });
    }

    // --- Core Order Loading and Rendering Logic ---
    async function loadKitchenOrders(isInitialLoad = true) {
        if(kitchenLoadingPlaceholder && isInitialLoad) {
            kitchenLoadingPlaceholder.textContent = _t('actionSpinnerLoading', 'กำลังโหลดรายการอาหาร...');
            kitchenLoadingPlaceholder.style.display = 'block';
        }

        const orders = await fetchData('getKitchenOrders', {}, 'GET', null, !isInitialLoad);
        if(kitchenLoadingPlaceholder && isInitialLoad) kitchenLoadingPlaceholder.style.display = 'none';

        if (!orders && !isInitialLoad) {
            console.warn("Background update for kitchen orders failed or returned no data.");
            return;
        }
        if (!orders && isInitialLoad) {
            kitchenOrdersContainer.innerHTML = `<p class="text-center text-danger mt-3 col-12">${_t('errorLoadOrders', 'ไม่สามารถโหลดรายการอาหารได้')}</p>`;
            return;
        }

        if (isInitialLoad || (orders && Array.isArray(orders))) {
            kitchenOrdersContainer.innerHTML = '';
        }

        if (orders && Array.isArray(orders) && orders.length > 0) {
            const groupedByOrderId = orders.reduce((acc, item) => {
                if (!acc[item.OrderID]) {
                    acc[item.OrderID] = {
                        orderId: item.OrderID,
                        tableNumber: item.TableNumber,
                        timestamp: item.Timestamp,
                        items: []
                    };
                }
                acc[item.OrderID].items.push(item);
                return acc;
            }, {});

            const sortedOrderTickets = Object.values(groupedByOrderId).sort((a, b) => {
                return new Date(a.timestamp) - new Date(b.timestamp);
            });

            let newContent = '';
            sortedOrderTickets.forEach(ticket => {
                if (ticket.items.length === 0) return;

                let itemsHtml = '<ul class="list-group list-group-flush">';
                ticket.items.forEach(item => {
                    const itemTimestampForAttr = item.Timestamp || new Date().toISOString();
                    itemsHtml += `
                        <li class="list-group-item py-2">
                            <div class="d-flex w-100 justify-content-between align-items-center">
                                <div class="me-2">
                                    <h6 class="mb-1">${item.ItemName} <span class="badge bg-secondary">x ${item.Quantity}</span></h6>
                                    ${item.ItemNote ? `<small class="text-danger fst-italic d-block admin-item-note"><strong>${_t('noteLabel', 'โน้ต')}:</strong> ${item.ItemNote}</small>` : ''}
                                    </div>
                                <button class="btn btn-sm kitchen-action-btn"
                                        data-orderid="${item.OrderID}"
                                        data-itemid="${item.ItemID}"
                                        data-itemname="${item.ItemName}" data-timestamp-for-item="${itemTimestampForAttr}"
                                        title="${_t('buttonTitleMarkServed', 'คลิกเมื่อเสิร์ฟรายการนี้แล้ว')}">
                                    ${_t('statusWaitingText', 'รอ')}... <i class="bi bi-hourglass-split"></i>
                                </button>
                            </div>
                        </li>`;
                });
                itemsHtml += '</ul>';

                newContent += `
                    <div class="col kitchen-ticket-card" data-orderid="${ticket.orderId}">
                        <div class="card h-100 shadow-sm kitchen-order-card status-preparing">
                            <div class="card-header">
                                <div class="d-flex w-100 justify-content-between">
                                    <strong class="fs-5">${_t('tableLabel', 'โต๊ะ')} ${ticket.tableNumber}</strong>
                                    <small class="text-muted">${_t('orderIdLabel', 'ID ออเดอร์')}: ...${ticket.orderId.slice(-5)}</small>
                                </div>
                                <small class="text-muted">${_t('orderedAtLabel', 'เวลาสั่ง')}: ${new Date(ticket.timestamp).toLocaleTimeString(displayLang === 'my' ? 'my-MM' : 'th-TH', { hour: '2-digit', minute: '2-digit' })}</small>
                            </div>
                            <div class="card-body p-0">
                                ${itemsHtml}
                            </div>
                        </div>
                    </div>
                `;
            });

            if (newContent !== '') {
                kitchenOrdersContainer.innerHTML = newContent;
            } else if (orders && orders.length === 0) {
                 kitchenOrdersContainer.innerHTML = `<p class="text-center text-muted mt-3 col-12">${_t('noOrdersMessage', 'ไม่มีรายการอาหารที่ต้องเตรียมในขณะนี้')}</p>`;
            }

            document.querySelectorAll('.kitchen-action-btn:not(.item-served-button)').forEach(btn => {
                btn.addEventListener('click', handleMarkAsServed);
            });
            updateElapsedTimesAndButtonColors();

        } else if (orders && orders.error && isInitialLoad) {
            kitchenOrdersContainer.innerHTML = `<p class="text-danger text-center col-12">${_t('errorLoadOrders', 'เกิดข้อผิดพลาดในการโหลดรายการ')}</p>`;
        } else if (isInitialLoad || (orders && orders.length === 0)) {
            kitchenOrdersContainer.innerHTML = `<p class="text-center text-muted mt-3 col-12">${_t('noOrdersMessage', 'ไม่มีรายการอาหารที่ต้องเตรียมในขณะนี้')}</p>';
        }
    }

    async function handleMarkAsServed(event) {
        const button = event.currentTarget;
        const orderId = button.dataset.orderid;
        const itemId = button.dataset.itemid;
        const itemName = button.dataset.itemname || itemId; // Fallback to itemId if itemname not set

        button.classList.add('item-served-button');
        button.style.backgroundColor = '';
        button.style.color = '';
        button.style.borderColor = '';

        const originalButtonText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ${_t('actionSpinnerSaving', 'กำลังบันทึก...')}`;

        const result = await fetchData('updateOrderStatus', {
            orderId: orderId,
            itemId: itemId,
            newStatus: "Served"
        }, 'GET', null, false);

        if (result && result.success) {
            showUserMessage(_t('confirmServedMessage', `รายการ ${itemName} ถูกทำเครื่องหมายว่า "เสิร์ฟแล้ว"` , itemName), "success");
            button.classList.remove('btn-warning');
            button.classList.add('btn-success');
            button.innerHTML = `<i class="bi bi-check-circle-fill"></i> ${_t('statusServedText', 'เสิร์ฟแล้ว')}`;
            // ปุ่มยังคง disable อยู่

            const elapsedTimeEl = button.closest('li').querySelector('.order-item-elapsed-time');
            if (elapsedTimeEl) {
                elapsedTimeEl.textContent = `(${_t('statusServedText', 'เสิร์ฟแล้ว')})`;
                elapsedTimeEl.classList.add('text-success', 'fst-italic');
            }
            setTimeout(() => {
                loadKitchenOrders(false);
            }, 700);

        } else {
            showUserMessage(`${_t('errorUpdateStatus', 'เกิดข้อผิดพลาดในการอัปเดตสถานะ')}: ${result ? result.message : _t('errorConnection', 'ไม่สามารถเชื่อมต่อได้')}`, "danger");
            button.disabled = false;
            button.innerHTML = originalButtonText;
            button.classList.remove('item-served-button');
            updateElapsedTimesAndButtonColors(); // เรียกเพื่อให้สีกลับมาถูกต้องตามเวลา
        }
    }

    if(refreshBtn) {
        refreshBtn.addEventListener('click', () => loadKitchenOrders(true));
    }

    // --- Initialize Page ---
    // เคลียร์ interval เก่า ถ้ามีการเรียก initializeKitchenPage ซ้ำ (เช่นกรณีสลับภาษาแบบไม่ reload)
    if (elapsedTimeIntervalId) clearInterval(elapsedTimeIntervalId);
    elapsedTimeIntervalId = setInterval(updateElapsedTimesAndButtonColors, 1000);

    loadKitchenOrders(true);
    // การ Polling ข้อมูลออเดอร์ใหม่จาก Server
    // Clear interval เก่าก่อน ถ้ามี
    if (window.kitchenOrderPollingIntervalId) {
        clearInterval(window.kitchenOrderPollingIntervalId);
    }
    window.kitchenOrderPollingIntervalId = setInterval(() => {
        loadKitchenOrders(false);
    }, 20000); // อัปเดตหน้าห้องครัวทุก 20 วินาที
}

// เรียก initializeKitchenPage() หลังจากไฟล์ภาษาถูกโหลด (จาก kitchen.html)
// ถ้า kitchen.html ไม่ได้เรียกฟังก์ชันนี้โดยตรงหลังจากโหลดไฟล์ภาษา, ให้ uncomment บรรทัดล่าง
// หรือตรวจสอบว่า script loader ใน kitchen.html เรียกใช้ initializeKitchenPage() ถูกต้อง
// initializeKitchenPage();
