// js/admin.js

document.addEventListener('DOMContentLoaded', () => {
    const adminOrdersAccordion = document.getElementById('admin-orders-accordion');
    const adminLoadingPlaceholder = document.getElementById('admin-loading-placeholder');
    const refreshBtn = document.getElementById('refresh-admin-orders-btn');

    async function loadAdminOrders(isInitialLoad = true) {
        if(adminLoadingPlaceholder && isInitialLoad) adminLoadingPlaceholder.style.display = 'block';

        // isBackgroundFetch จะเป็น true เมื่อ isInitialLoad เป็น false
        const tablesData = await fetchData('getAllActiveOrders', {}, 'GET', null, !isInitialLoad);
        if(adminLoadingPlaceholder && isInitialLoad) adminLoadingPlaceholder.style.display = 'none';

        if (!tablesData && !isInitialLoad) {
            console.warn("Background update for admin orders failed or returned no data.");
            // ไม่จำเป็นต้องเคลียร์หน้าจอถ้าเป็น background update ที่ล้มเหลว อาจจะปล่อยให้ข้อมูลเก่าแสดงต่อไป
            return;
        }
        if (!tablesData && isInitialLoad) { // Error on initial load
            adminOrdersAccordion.innerHTML = '<p class="text-center text-danger mt-3">ไม่สามารถโหลดข้อมูลออเดอร์ได้</p>';
            return;
        }

        // เคลียร์ accordion ก่อน render ใหม่ เฉพาะเมื่อเป็น initial load หรือเมื่อมีข้อมูลใหม่จริงๆ
        // เพื่อลดการกระพริบถ้าข้อมูลไม่เปลี่ยนแปลง
        if (isInitialLoad || (tablesData && Array.isArray(tablesData))) {
            adminOrdersAccordion.innerHTML = '';
        }


        if (tablesData && Array.isArray(tablesData) && tablesData.length > 0) {
            tablesData.sort((a, b) => parseInt(String(a.table).replace(/\D/g,'') || 0) - parseInt(String(b.table).replace(/\D/g,'') || 0));

            let newContent = '';
            tablesData.forEach((tableInfo, index) => {
                const tableNumber = tableInfo.table;
                const orders = tableInfo.orders; // orders คือ array ของ item object จาก getAllActiveOrders
                let currentTableTotalAmountForBilling = 0; // ยอดรวมสำหรับปุ่มเช็คบิล (ไม่รวม Cancelled)

                // orders ที่มาจาก getAllActiveOrders จะรวมรายการ Cancelled มาด้วย
                // แต่ totalAmount ที่ส่งมาจาก GAS (tableInfo.totalAmount) จะไม่รวมยอด Cancelled
                // เราจะใช้ tableInfo.totalAmount สำหรับแสดงผลยอดรวมที่หัว Accordion
                // และคำนวณ currentTableTotalAmountForBilling ใหม่เพื่อความแน่ใจสำหรับปุ่มเช็คบิล
                orders.forEach(item => {
                    if (item.Status !== "Cancelled") { // ยอดที่ใช้สำหรับปุ่มเช็คบิล
                        currentTableTotalAmountForBilling += parseFloat(item.Subtotal || 0);
                    }
                });


                const uniqueOrderIds = Array.from(new Set(orders.map(o => o.OrderID))).map(id => `...${id.slice(-3)}`).join(', ') || 'N/A';
                const accordionItemId = `table-collapse-${tableNumber.toString().replace(/[^a-zA-Z0-9]/g, '')}`;
                const accordionHeaderId = `table-header-${tableNumber.toString().replace(/[^a-zA-Z0-9]/g, '')}`;

                let itemsHtml = '<ul class="list-group list-group-flush">';
                if (orders && orders.length > 0) {
                    orders.forEach(item => {
                        const canCancel = item.Status !== "Cancelled" && item.Status !== "Billed" && item.Status !== "Paid";
                        const itemStatusDisplay = item.Status === "Cancelled" ? `<span class="text-danger fw-bold">${item.Status}</span>` : item.Status;
                        const itemTimestampForAttr = (item.Timestamp instanceof Date) ? item.Timestamp.toISOString() : (item.Timestamp || new Date().toISOString());


                        let noteHtml = '';
                        if (item.ItemNote) {
                            noteHtml = `<small class="d-block fst-italic text-danger admin-item-note"><strong>โน้ต:</strong> ${item.ItemNote}</small>`;
                        }

                        let statusAndTimestampHtml = `<small class="d-block text-muted admin-item-status-time">สถานะ: ${itemStatusDisplay} (ID: ...${item.OrderID.slice(-3)})`;
                        if (item.Status !== "Cancelled" && item.Timestamp) {
                            statusAndTimestampHtml += `<br><span class="fst-italic">สั่งเมื่อ: ${new Date(item.Timestamp).toLocaleTimeString('th-TH')}</span>`;
                        }
                        statusAndTimestampHtml += `</small>`;

                        itemsHtml += `
                            <li class="list-group-item d-flex justify-content-between align-items-center py-2 ${item.Status === "Cancelled" ? 'list-group-item-light text-muted-cancelled' : ''}">
                                <div class="me-2">
                                    <span class="fw-bold">${item.ItemName} x ${item.Quantity}</span>
                                    ${noteHtml}
                                    ${statusAndTimestampHtml}
                                </div>
                                <div class="d-flex align-items-center flex-shrink-0">
                                    <span class="badge ${item.Status === "Cancelled" ? 'bg-secondary' : 'bg-light text-dark'} me-2">${parseFloat(item.Subtotal || 0).toFixed(2)} บ.</span>
                                    ${canCancel ?
                                        `<button class="btn btn-sm btn-outline-danger cancel-order-item-btn"
                                                 title="ยกเลิกรายการนี้"
                                                 data-orderid="${item.OrderID}"
                                                 data-itemid="${item.ItemID}"
                                                 data-timestamp="${itemTimestampForAttr}"
                                                 data-itemname="${item.ItemName}">
                                            <i class="bi bi-x-circle-fill"></i>
                                        </button>` : ''
                                    }
                                </div>
                            </li>`;
                    });
                } else {
                    itemsHtml += '<li class="list-group-item text-muted">ไม่มีรายการสั่งซื้อสำหรับโต๊ะนี้</li>';
                }
                itemsHtml += '</ul>';

                const isExpanded = isInitialLoad && index === 0;
                const buttonCollapsedClass = isExpanded ? '' : 'collapsed';
                const divShowClass = isExpanded ? 'show' : '';

                newContent += `
                    <div class="accordion-item admin-table-card">
                        <h2 class="accordion-header" id="${accordionHeaderId}">
                            <button class="accordion-button ${buttonCollapsedClass}" type="button" data-bs-toggle="collapse" data-bs-target="#${accordionItemId}" aria-expanded="${isExpanded}" aria-controls="${accordionItemId}">
                                <span class="me-2"><strong>โต๊ะ ${tableNumber}</strong></span>
                                <span class="badge bg-success me-auto">ยอดรวม: ${tableInfo.totalAmount.toFixed(2)} บาท</span> {/* ใช้ totalAmount จาก tableInfo ที่ GAS คำนวณมา */}
                                <small class="text-muted order-ids-display">(IDs: ${uniqueOrderIds})</small>
                            </button>
                        </h2>
                        <div id="${accordionItemId}" class="accordion-collapse collapse ${divShowClass}" aria-labelledby="${accordionHeaderId}" data-bs-parent="#admin-orders-accordion">
                            <div class="accordion-body">
                                ${itemsHtml}
                                <div class="mt-3 d-flex flex-wrap justify-content-between gap-2">
                                    <button class="btn btn-primary check-bill-btn flex-grow-1" data-table="${tableNumber}" data-amount="${currentTableTotalAmountForBilling.toFixed(2)}"> {/* ยอดสำหรับปุ่มเช็คบิล */}
                                        <i class="bi bi-cash-coin btn-icon"></i> ชำระเงิน/เคลียร์โต๊ะ ${tableNumber}
                                    </button>
                                    <a href="index.html?table=${tableNumber}" target="_blank" class="btn btn-outline-info open-customer-view-btn flex-grow-1" title="เปิดหน้าสั่งอาหารสำหรับโต๊ะ ${tableNumber}">
                                        <i class="bi bi-display"></i> ดู/สั่งเพิ่ม
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });

            if (adminOrdersAccordion.innerHTML !== newContent && newContent !== '') {
                adminOrdersAccordion.innerHTML = newContent;
            } else if (newContent === '' && tablesData && tablesData.length === 0) { // Handle case where all tables are cleared
                adminOrdersAccordion.innerHTML = '<p class="text-center text-muted mt-3">ยังไม่มีออเดอร์ที่ยังไม่ได้เช็คบิล</p>';
            }


            document.querySelectorAll('.check-bill-btn').forEach(btn => {
                btn.addEventListener('click', handleCheckBill);
            });
            document.querySelectorAll('.cancel-order-item-btn').forEach(btn => {
                btn.addEventListener('click', handleCancelOrderItem);
            });

        } else if (tablesData && tablesData.error && isInitialLoad) {
            adminOrdersAccordion.innerHTML = `<p class="text-danger text-center">เกิดข้อผิดพลาด: ${tablesData.error}</p>`;
        } else if (isInitialLoad || (tablesData && tablesData.length === 0) ) {
             adminOrdersAccordion.innerHTML = '<p class="text-center text-muted mt-3">ยังไม่มีออเดอร์ที่ยังไม่ได้เช็คบิล</p>';
        }
    }

    async function handleCheckBill(event) {
        const button = event.currentTarget;
        const tableNum = button.dataset.table;
        const amount = button.dataset.amount; // ยอดนี้คือยอดที่คำนวณจากรายการที่ยังไม่ Cancelled

        if (!confirm(`คุณต้องการยืนยันการชำระเงินและเคลียร์โต๊ะ ${tableNum} ยอดรวม ${amount} บาท ใช่หรือไม่? \n(ทุกรายการที่ยังไม่ยกเลิกจะถูกเปลี่ยนสถานะเป็น "Paid")`)) {
            return;
        }
        const originalButtonText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> กำลังดำเนินการ...`;

        // Action ที่เรียกยังคงเป็น 'calculateBill' ซึ่งใน GAS จะไปเรียก markOrdersAsPaid
        const result = await fetchData('calculateBill', { table: tableNum }, 'GET', null, false);

        if (result && result.success) {
            showUserMessage(result.message || `โต๊ะ ${tableNum} ชำระเงินและเคลียร์เรียบร้อย! ยอดรวม ${result.totalAmount.toFixed(2)} บาท`, "success");
            loadAdminOrders(true); // โหลดข้อมูลใหม่ โต๊ะที่เคลียร์แล้วควรจะหายไป
        } else {
            showUserMessage("เกิดข้อผิดพลาดในการดำเนินการ: " + (result ? result.message : "ไม่สามารถเชื่อมต่อได้"), "danger");
            button.disabled = false;
            button.innerHTML = originalButtonText;
        }
    }

    async function handleCancelOrderItem(event) {
        const button = event.currentTarget;
        const orderId = button.dataset.orderid;
        const itemId = button.dataset.itemid;
        const itemTimestamp = button.dataset.timestamp;
        const itemName = button.dataset.itemname;

        if (!itemTimestamp || itemTimestamp === "undefined" || itemTimestamp === "null") {
             showUserMessage(`เกิดข้อผิดพลาด: ไม่พบเวลาสั่งซื้อสำหรับรายการ "${itemName}"`, "danger");
             console.error("Missing or invalid timestamp for item:", itemName, itemTimestamp);
             return;
        }

        if (!confirm(`คุณต้องการยกเลิกรายการ "${itemName}" (สั่งเมื่อ: ${new Date(itemTimestamp).toLocaleTimeString('th-TH')}) ในออเดอร์ ${orderId} ใช่หรือไม่?`)) {
            return;
        }

        const originalButtonContent = button.innerHTML;
        button.disabled = true;
        button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

        const result = await fetchData('cancelOrderItem', {
            orderId: orderId,
            itemId: itemId,
            itemTimestamp: itemTimestamp
        }, 'GET', null, false); // User action, show spinner

        if (result && result.success) {
            showUserMessage(result.message || `ยกเลิกรายการ ${itemName} สำเร็จ`, "success");
            loadAdminOrders(false); // Reload silently to update UI
        } else {
            showUserMessage(`เกิดข้อผิดพลาดในการยกเลิกรายการ: ${result ? result.message : "ไม่สามารถเชื่อมต่อได้"}`, "danger");
            button.disabled = false;
            button.innerHTML = originalButtonContent;
        }
    }

    if(refreshBtn) refreshBtn.addEventListener('click', () => loadAdminOrders(true));

    loadAdminOrders(true); // Initial load with spinner
    setInterval(() => {
        loadAdminOrders(false); // Background polling
    }, 30000); // อัปเดตหน้าแอดมินทุก 30 วินาที
});
