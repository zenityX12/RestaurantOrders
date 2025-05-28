// js/kitchen-my.js

document.addEventListener('DOMContentLoaded', () => {
    const kitchenOrdersContainer = document.getElementById('kitchen-orders-container');
    const kitchenLoadingPlaceholder = document.getElementById('kitchen-loading-placeholder');
    const refreshBtn = document.getElementById('refresh-kitchen-orders-btn');

    // --- Language and Translation Setup ---
    // KITCHEN_LANG_MY ควรจะถูกโหลดมาจากไฟล์ js/lang/my.js แล้ว
    const LANG_DATA = window.KITCHEN_LANG_MY || {}; // ใช้ Object ว่างถ้าไฟล์ my.js โหลดไม่สำเร็จ

    // ฟังก์ชันสำหรับดึงคำแปล
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

    // --- Update Static UI Text based on Language ---
    document.title = _t('pageTitle', 'မီးဖိုချောင် - အော်ဒါစာရင်း');
    const kitchenNavTitleEl = document.getElementById('config-restaurant-name-nav-kitchen');
    if (kitchenNavTitleEl) kitchenNavTitleEl.textContent = _t('navTitle', 'စားသောက်ဆိုင် စီမံခန့်ခွဲမှု (မီးဖိုချောင်)');

    const kitchenOrdersHeaderEl = document.getElementById('kitchen-orders-header');
    if (kitchenOrdersHeaderEl) kitchenOrdersHeaderEl.textContent = _t('ordersToPrepareHeader', 'ပြင်ဆင်ရန် အစားအစာများ');

    const kitchenRefreshBtnTextEl = document.getElementById('kitchen-refresh-button-text');
    if (kitchenRefreshBtnTextEl) { // ตรวจสอบว่า element นี้มีอยู่จริง
        const parentButton = kitchenRefreshBtnTextEl.parentElement; // คือตัวปุ่ม <button>
        parentButton.childNodes.forEach(node => { // ลบ text node เก่าๆ ออกก่อน (เช่น "รีเฟรชรายการ")
            if (node.nodeType === Node.TEXT_NODE) {
                node.remove();
            }
        });
        parentButton.insertAdjacentHTML('beforeend', _t('refreshButton', 'စာရင်းပြန်စစ်မည်')); // เพิ่ม text ใหม่หลัง icon
    } else if (refreshBtn) { // ถ้าไม่มี span แยก ก็ใส่ในปุ่มโดยตรง (อาจจะต้องปรับ HTML)
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

                button.innerHTML = `${_t('statusWaitingText', 'စောင့်ပါ')} ${diffSeconds} ${_t('elapsedTimeSecondsAgo', 'စက္ကန့် ကုန်ခဲ့သည်')} <i class="bi bi-hourglass-split"></i>`;

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
                                    {/* เวลาจะถูกอัปเดตโดย updateElapsedTimesAndButtonColors บนปุ่ม */}
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
                                <small class="text-muted">${_t('orderedAtLabel', 'မှာယူသည့်အချိန်')}: ${new Date(ticket.timestamp).toLocaleTimeString('my-MM', { hour: '2-digit', minute: '2-digit' })}</small> {/* ใช้ my-MM สำหรับพม่า */}
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
        button.style.backgroundColor = '';
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
            button.classList.remove('btn-warning');
            button.classList.add('btn-success');
            button.innerHTML = `<i class="bi bi-check-circle-fill"></i> ${_t('statusServedText', 'ပို့ပြီးပြီ')}`;

            setTimeout(() => {
                loadKitchenOrders(false);
            }, 700);

        } else {
            showUserMessage(`${_t('errorUpdateStatus', 'เกิดข้อผิดพลาดในการอัปเดตสถานะ')}: ${result ? result.message : _t('errorConnection', 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้')}`, "danger");
            button.disabled = false;
            button.innerHTML = originalButtonText;
            button.classList.remove('item-served-button');
            updateElapsedTimesAndButtonColors();
        }
    }

    if(refreshBtn) {
        refreshBtn.addEventListener('click', () => loadKitchenOrders(true));
    }

    if (elapsedTimeIntervalId) clearInterval(elapsedTimeIntervalId);
    elapsedTimeIntervalId = setInterval(updateElapsedTimesAndButtonColors, 1000);

    // --- Initialize Page ---
    // โหลดไฟล์ภาษาพม่าโดยตรงสำหรับหน้านี้
    const langScript = document.createElement('script');
    langScript.id = 'dynamic-lang-script';
    langScript.src = `js/lang/my.js`; // โหลดภาษาพม่าเสมอสำหรับ kitchen-my.js
    langScript.onload = function() {
        console.log(`Burmese language file (my.js) loaded.`);
        initializeKitchenPageContent(); // เรียกฟังก์ชันเริ่มต้นหลังจากภาษาโหลด
    };
    langScript.onerror = function() {
        console.error(`Failed to load my.js.`);
        // อาจจะแสดงข้อความว่าโหลดภาษาพม่าไม่สำเร็จ
        if (kitchenLoadingPlaceholder) kitchenLoadingPlaceholder.textContent = "Error loading language file.";
    };
    document.head.appendChild(langScript);

    function initializeKitchenPageContent() {
        // อัปเดต UI Text ที่ต้องทำหลังจาก LANG_DATA พร้อมใช้งาน
        document.title = _t('pageTitle', 'မီးဖိုချောင် - အော်ဒါစာရင်း');
        const kitchenNavTitleEl = document.getElementById('config-restaurant-name-nav-kitchen');
        if (kitchenNavTitleEl) kitchenNavTitleEl.textContent = _t('navTitle', 'စားသောက်ဆိုင် စီမံခန့်ခွဲမှု (မီးဖိုချောင်)');

        const kitchenOrdersHeaderEl = document.getElementById('kitchen-orders-header');
        if (kitchenOrdersHeaderEl) kitchenOrdersHeaderEl.textContent = _t('ordersToPrepareHeader', 'ပြင်ဆင်ရန် အစားအစာများ');

        const kitchenRefreshBtnTextEl = document.getElementById('kitchen-refresh-button-text');
         if (kitchenRefreshBtnTextEl) {
            const parentButton = kitchenRefreshBtnTextEl.parentElement;
            parentButton.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
                    node.remove();
                }
            });
            // ตรวจสอบให้แน่ใจว่าใส่ text node กลับเข้าไป ไม่ใช่ innerHTML ที่จะลบ icon
            const textNode = document.createTextNode(_t('refreshButton', 'စာရင်းပြန်စစ်မည်'));
            if(parentButton.querySelector('.btn-icon')){
                 parentButton.appendChild(textNode);
            } else { // ถ้าไม่มี icon ก็ใส่ text ตรงๆ
                 parentButton.innerHTML = `<i class="bi bi-arrow-clockwise btn-icon"></i>` + _t('refreshButton', 'စာရင်းပြန်စစ်မည်');
            }

        } else if (refreshBtn) {
             refreshBtn.innerHTML = `<i class="bi bi-arrow-clockwise btn-icon"></i>${_t('refreshButton', 'စာရင်းပြန်စစ်မည်')}`;
        }


        if (kitchenLoadingPlaceholder) kitchenLoadingPlaceholder.textContent = _t('actionSpinnerLoading', 'ဖွင့်နေသည်...');

        // โหลดข้อมูลออเดอร์
        loadKitchenOrders(true);

        // ตั้งค่า polling สำหรับออเดอร์
        if (window.kitchenOrderPollingIntervalId) {
            clearInterval(window.kitchenOrderPollingIntervalId);
        }
        window.kitchenOrderPollingIntervalId = setInterval(() => {
            loadKitchenOrders(false);
        }, 20000);

        // ตั้งค่า polling สำหรับเวลา (อาจจะไม่ต้องทำใหม่ถ้า interval ยังอยู่)
        if (elapsedTimeIntervalId) clearInterval(elapsedTimeIntervalId);
        elapsedTimeIntervalId = setInterval(updateElapsedTimesAndButtonColors, 1000);
    }
});
