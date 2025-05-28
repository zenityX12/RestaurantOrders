// js/admin.js

document.addEventListener('DOMContentLoaded', () => {
    const adminOrdersAccordion = document.getElementById('admin-orders-accordion');
    const adminLoadingPlaceholder = document.getElementById('admin-loading-placeholder');
    const refreshBtn = document.getElementById('refresh-admin-orders-btn');

    async function loadAdminOrders(isInitialLoad = true) {
        if(adminLoadingPlaceholder && isInitialLoad) adminLoadingPlaceholder.style.display = 'block';

        const tablesData = await fetchData('getAllActiveOrders', {}, 'GET', null, !isInitialLoad);
        if(adminLoadingPlaceholder && isInitialLoad) adminLoadingPlaceholder.style.display = 'none';

        if (!tablesData && !isInitialLoad) {
            console.warn("Background update for admin orders failed or returned no data.");
            return;
        }
        if (!tablesData && isInitialLoad) {
            adminOrdersAccordion.innerHTML = '<p class="text-center text-danger mt-3">ไม่สามารถโหลดข้อมูลออเดอร์ได้</p>';
            return;
        }

        if (isInitialLoad || (tablesData && Array.isArray(tablesData))) {
            adminOrdersAccordion.innerHTML = '';
        }

        if (tablesData && Array.isArray(tablesData) && tablesData.length > 0) {
            tablesData.sort((a, b) => parseInt(String(a.table).replace(/\D/g,'') || 0) - parseInt(String(b.table).replace(/\D/g,'') || 0));

            let newContent = '';
            tablesData.forEach((tableInfo, index) => {
                const tableNumber = tableInfo.table;
                const orders = tableInfo.orders;
                let currentTableTotalAmount = 0;
                orders.forEach(item => {
                    if (item.Status !== "Cancelled") {
                        currentTableTotalAmount += parseFloat(item.Subtotal || 0);
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
                        const itemTimestampForAttr = (item.Timestamp instanceof Date) ? item.Timestamp.toISOString() : item.Timestamp;

                        let noteHtml = '';
                        if (item.ItemNote) {
                            noteHtml = `<small class="d-block fst-italic text-danger admin-item-note"><strong>โน้ต:</strong> ${item.ItemNote}</small>`;
                        }

                        let statusAndTimestampHtml = `<small class="d-block text-muted admin-item-status-time">สถานะ: ${itemStatusDisplay} (ID: ...${item.OrderID.slice(-3)})`;
                        if (item.Status !== "Cancelled" && item.Timestamp) { // ตรวจสอบว่า item.Timestamp มีค่า
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
                                <span class="badge bg-success me-auto">ยอดรวม: ${currentTableTotalAmount.toFixed(2)} บาท</span>
                                <small class="text-muted order-ids-display">(IDs: ${uniqueOrderIds})</small>
                            </button>
                        </h2>
                        <div id="${accordionItemId}" class="accordion-collapse collapse ${divShowClass}" aria-labelledby="${accordionHeaderId}" data-bs-parent="#admin-orders-accordion">
                            <div class="accordion-body">
                                ${itemsHtml}
                                <div class="mt-3 d-flex flex-wrap justify-content-between gap-2">
                                    <button class="btn btn-primary check-bill-btn flex-grow-1" data-table="${tableNumber}" data-amount="${currentTableTotalAmount.toFixed(2)}">
                                        <i class="bi bi-cash-coin btn-icon"></i> เช็คบิลโต๊ะ ${tableNumber}
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
            } else if (newContent === '' && tablesData && tablesData.length === 0) {
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
        const amount = button.dataset.amount;

        if (!confirm(`คุณต้องการเช็คบิลโต๊ะ ${tableNum} ยอดรวม ${amount} บาท ใช่หรือไม่? \n(รายการที่ถูก "Cancelled" จะไม่ถูกรวมในยอดนี้)`)) {
            return;
        }
        const originalButtonText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> กำลังเช็คบิล...`;
        const result = await fetchData('calculateBill', { table: tableNum }, 'GET', null, false);
        if (result && result.success) {
            showUserMessage(result.message || `เช็คบิลโต๊ะ ${tableNum} สำเร็จ! ยอดที่เรียกเก็บ ${result.totalAmount.toFixed(2)} บาท`, "success");
            loadAdminOrders(true);
        } else {
            showUserMessage("เกิดข้อผิดพลาดในการเช็คบิล: " + (result ? result.message : "ไม่สามารถเชื่อมต่อได้"), "danger");
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
             console.error("Missing or invalid timestamp for item:", item);
             return;
        }


        if (!confirm(`คุณต้องการยกเลิกรายการ "${itemName}" (เวลาสั่ง: ${new Date(itemTimestamp).toLocaleTimeString('th-TH')}) ในออเดอร์ ${orderId} ใช่หรือไม่?`)) {
            return;
        }

        const originalButtonContent = button.innerHTML;
        button.disabled = true;
        button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

        const result = await fetchData('cancelOrderItem', {
            orderId: orderId,
            itemId: itemId,
            itemTimestamp: itemTimestamp
        }, 'GET', null, false);

        if (result && result.success) {
            showUserMessage(result.message || `ยกเลิกรายการ ${itemName} สำเร็จ`, "success");
            loadAdminOrders(false);
        } else {
            showUserMessage(`เกิดข้อผิดพลาดในการยกเลิกรายการ: ${result ? result.message : "ไม่สามารถเชื่อมต่อได้"}`, "danger");
            button.disabled = false;
            button.innerHTML = originalButtonContent;
        }
    }

    if(refreshBtn) refreshBtn.addEventListener('click', () => loadAdminOrders(true));

    loadAdminOrders(true);
    setInterval(() => {
        loadAdminOrders(false);
    }, 30000);
});
