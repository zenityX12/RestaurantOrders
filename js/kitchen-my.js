// js/kitchen-my.js

// ทำให้ฟังก์ชันนี้เป็น Global เพื่อให้ HTML เรียกได้
function initializeKitchenPage() {
    const kitchenOrdersContainer = document.getElementById('kitchen-orders-container');
    const kitchenLoadingPlaceholder = document.getElementById('kitchen-loading-placeholder');
    const refreshBtn = document.getElementById('refresh-kitchen-orders-btn');

    console.log("Attempting to initialize Burmese Kitchen Page...");

    // --- Language and Translation Setup ---
    const LANG_DATA = window.KITCHEN_LANG_MY || {};
    if (Object.keys(LANG_DATA).length === 0) {
        console.error("KITCHEN_LANG_MY is not loaded or is empty. Burmese translations will not be available.");
        // อาจจะแสดงข้อความ Alert ภาษาอังกฤษหรือไทยที่นี่ ถ้าภาษาพม่าโหลดไม่ได้เลย
        if (typeof showUserMessage === "function") { // ตรวจสอบว่า showUserMessage พร้อมใช้งาน
             showUserMessage("Error: Language file for Burmese could not be loaded. Some text may not be translated.", "danger");
        }
    } else {
        console.log("KITCHEN_LANG_MY loaded successfully.");
    }

    function _t(key, fallbackText = "") {
        if (typeof LANG_DATA[key] === 'string' && arguments.length > 1) {
            let translatedText = LANG_DATA[key];
            for (let i = 1; i < arguments.length; i++) {
                translatedText = translatedText.replace(`{${i-1}}`, arguments[i]);
            }
            return translatedText;
        }
        return LANG_DATA[key] || fallbackText || key;
    }

    // --- Update Static UI Text on initialization ---
    // (ส่วนนี้จะถูกเรียกจาก kitchen-my.html แล้ว หลังจากที่ KITCHEN_LANG_MY ควรจะพร้อม)
    document.title = _t('pageTitle', 'မီးဖိုချောင် - အော်ဒါစာရင်း');
    const kitchenNavTitleEl = document.getElementById('kitchen-nav-title');
    if (kitchenNavTitleEl) kitchenNavTitleEl.textContent = _t('navTitle', 'စားသောက်ဆိုင် စီမံခန့်ခွဲမှု (မီးဖိုချောင်)');

    const kitchenOrdersHeaderEl = document.getElementById('kitchen-orders-header');
    if (kitchenOrdersHeaderEl) kitchenOrdersHeaderEl.textContent = _t('ordersToPrepareHeader', 'ပြင်ဆင်ရန် အစားအစာများ');

    const kitchenRefreshBtnTextEl = document.getElementById('kitchen-refresh-button-text');
     if (kitchenRefreshBtnTextEl) {
        // Clear existing text node before adding new one
        const parentButton = kitchenRefreshBtnTextEl.parentElement;
        Array.from(parentButton.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
                node.remove();
            }
        });
        const textNode = document.createTextNode(" " + _t('refreshButton', 'စာရင်းပြန်စစ်မည်'));
        parentButton.appendChild(textNode);
    } else if (refreshBtn) {
        refreshBtn.innerHTML = `<i class="bi bi-arrow-clockwise btn-icon"></i>${_t('refreshButton', 'စာရင်းပြန်စစ်မည်')}`;
    }

    if (kitchenLoadingPlaceholder) kitchenLoadingPlaceholder.textContent = _t('actionSpinnerLoading', 'ဖွင့်နေသည်...');


    // --- Timer and Color Logic ---
    let elapsedTimeIntervalId = null;

    function updateElapsedTimesAndButtonColors() {
        document.querySelectorAll('.kitchen-action-btn:not(.item-served-button)').forEach(button => {
            const orderTimestampStr = button.dataset.timestampForItem;
            if (orderTimestampStr) {
                const startTime = new Date(orderTimestampStr).getTime();
                const now = new Date().getTime();
                const diffSeconds = Math.max(0, Math.floor((now - startTime) / 1000));
                button.innerHTML = `${_t('statusWaitingText', 'စောင့်ပါ')} ${diffSeconds} ${_t('elapsedTimeSecondsUnit', 'စက္ကန့်')} <i class="bi bi-hourglass-split"></i>`; // เพิ่ม key elapsedTimeSecondsUnit
                const maxWaitSeconds = 900;
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
            kitchenLoadingPlaceholder.textContent = _t('actionSpinnerLoading', 'ဖွင့်နေသည်...');
            kitchenLoadingPlaceholder.style.display = 'block';
        }

        const orders = await fetchData('getKitchenOrders', {}, 'GET', null, !isInitialLoad);
        if(kitchenLoadingPlaceholder && isInitialLoad) kitchenLoadingPlaceholder.style.display = 'none';

        if (!orders && !isInitialLoad) {
            console.warn("Background update for kitchen orders failed or returned no data.");
            return;
        }
        if (!orders && isInitialLoad) {
            kitchenOrdersContainer.innerHTML = `<p class="text-center text-danger mt-3 col-12">${_t('errorLoadOrders', 'အော်ဒါစာရင်းကို ဖွင့်၍မရပါ')}</p>`;
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
                                    ${item.ItemNote ? `<small class="text-danger fst-italic d-block admin-item-note"><strong>${_t('noteLabel', 'မှတ်ချက်')}:</strong> ${item.ItemNote}</small>` : ''}
                                </div>
                                <button class="btn btn-sm kitchen-action-btn"
                                        data-orderid="${item.OrderID}"
                                        data-itemid="${item.ItemID}"
                                        data-itemname="${item.ItemName}"
                                        data-timestamp-for-item="${itemTimestampForAttr}"
                                        title="${_t('buttonTitleMarkServed', 'ဤပစ္စည်းကို ကျွေးပြီးပါက နှိပ်ပါ')}">
                                    ${_t('statusWaitingText', 'စောင့်ပါ')}... <i class="bi bi-hourglass-split"></i>
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
                                    <strong class="fs-5">${_t('tableLabel', 'စားပွဲ')} ${ticket.tableNumber}</strong>
                                    <small class="text-muted">${_t('orderIdLabel', 'အော်ဒါ ID')}: ...${ticket.orderId.slice(-5)}</small>
                                </div>
                                <small class="text-muted">${_t('orderedAtLabel', 'မှာယူသည့်အချိန်')}: ${new Date(ticket.timestamp).toLocaleTimeString('my-MM', { hour: '2-digit', minute: '2-digit' })}</small>
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
                 kitchenOrdersContainer.innerHTML = `<p class="text-center text-muted mt-3 col-12">${_t('noOrdersMessage', 'လောလောဆယ် ပြင်ဆင်ရန် အစားအစာ မရှိပါ')}</p>`;
            }

            document.querySelectorAll('.kitchen-action-btn:not(.item-served-button)').forEach(btn => {
                btn.addEventListener('click', handleMarkAsServed);
            });
            updateElapsedTimesAndButtonColors();

        } else if (orders && orders.error && isInitialLoad) {
            kitchenOrdersContainer.innerHTML = `<p class="text-danger text-center col-12">${_t('errorLoadOrders', 'အော်ဒါစာရင်းကို ဖွင့်၍မရပါ')}</p>`;
        } else if (isInitialLoad || (orders && orders.length === 0)) {
            kitchenOrdersContainer.innerHTML = `<p class="text-center text-muted mt-3 col-12">${_t('noOrdersMessage', 'လောလောဆယ် ပြင်ဆင်ရန် အစားအစာ မရှိပါ')}</p>`;
        }
    }

    async function handleMarkAsServed(event) {
        const button = event.currentTarget;
        const orderId = button.dataset.orderid;
        const itemId = button.dataset.itemid;
        const itemName = button.dataset.itemname || itemId;

        button.classList.add('item-served-button');
        button.style.backgroundColor = ''; // Clear inline style to let CSS class take over
        button.style.color = '';
        button.style.borderColor = '';

        const originalButtonText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ${_t('actionSpinnerSaving', 'သိမ်းနေသည်...')}`;

        const result = await fetchData('updateOrderStatus', {
            orderId: orderId,
            itemId: itemId,
            newStatus: "Served"
        }, 'GET', null, false);

        if (result && result.success) {
            showUserMessage(_t('confirmServedMessage', `รายการ ${itemName} ถูกทำเครื่องหมายว่า "เสิร์ฟแล้ว"`, itemName), "success");
            button.classList.remove('btn-warning'); // Ensure this is removed if it was a class
            button.classList.add('btn-success');
            button.innerHTML = `<i class="bi bi-check-circle-fill"></i> ${_t('statusServedText', 'ပို့ပြီးပြီ')}`;
            // Button remains disabled

            // No need to update elapsed time text here as the button is now "Served"
            // The updateElapsedTimesAndButtonColors function will skip it.

            setTimeout(() => {
                loadKitchenOrders(false);
            }, 700);

        } else {
            showUserMessage(`${_t('errorUpdateStatus', 'เกิดข้อผิดพลาดในการอัปเดตสถานะ')}: ${result ? (result.message || result.error || '') : _t('errorConnection', 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้')}`, "danger");
            button.disabled = false;
            button.innerHTML = originalButtonText;
            button.classList.remove('item-served-button'); // Allow timer to restart if error
            updateElapsedTimesAndButtonColors();
        }
    }

    if(refreshBtn) {
        refreshBtn.addEventListener('click', () => loadKitchenOrders(true));
    }

    // --- Start Page Execution ---
    if (elapsedTimeIntervalId) clearInterval(elapsedTimeIntervalId);
    elapsedTimeIntervalId = setInterval(updateElapsedTimesAndButtonColors, 1000);

    loadKitchenOrders(true);

    if (window.kitchenOrderPollingIntervalId) {
        clearInterval(window.kitchenOrderPollingIntervalId);
    }
    window.kitchenOrderPollingIntervalId = setInterval(() => {
        loadKitchenOrders(false);
    }, 20000);
}

// This global function will be called by the script in kitchen-my.html
// after js/lang/my.js is loaded.
// We don't need DOMContentLoaded here because kitchen-my.html's script will call this.
