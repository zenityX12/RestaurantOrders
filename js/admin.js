// js/admin.js

document.addEventListener('DOMContentLoaded', () => {
    const adminOrdersAccordion = document.getElementById('admin-orders-accordion');
    const adminLoadingPlaceholder = document.getElementById('admin-loading-placeholder');
    const refreshBtn = document.getElementById('refresh-admin-orders-btn');

    async function loadAdminOrders(isInitialLoad = true) {
        if(adminLoadingPlaceholder && isInitialLoad) adminLoadingPlaceholder.style.display = 'block';
        // ไม่ clear accordion ทันทีถ้าเป็น background เพื่อลดการกระพริบ
        // จะ clear เมื่อมีข้อมูลใหม่จริงๆ หรือเป็น initial load

        const tablesData = await fetchData('getAllActiveOrders', {}, 'GET', null, !isInitialLoad);
        if(adminLoadingPlaceholder && isInitialLoad) adminLoadingPlaceholder.style.display = 'none';

        if (!tablesData && !isInitialLoad) {
            console.warn("Background update for admin orders failed or returned no data.");
            return;
        }
        if (!tablesData && isInitialLoad) { // Error on initial load
            adminOrdersAccordion.innerHTML = '<p class="text-center text-danger mt-3">ไม่สามารถโหลดข้อมูลออเดอร์ได้</p>';
            return;
        }
        // Clear content only if we are about to render new data or it's an initial load
        if (isInitialLoad || (tablesData && Array.isArray(tablesData))) {
            adminOrdersAccordion.innerHTML = '';
        }


        if (tablesData && Array.isArray(tablesData) && tablesData.length > 0) {
            tablesData.sort((a, b) => parseInt(String(a.table).replace(/\D/g,'') || 0) - parseInt(String(b.table).replace(/\D/g,'') || 0));

            let newContent = '';
            tablesData.forEach((tableInfo, index) => {
                const tableNumber = tableInfo.table;
                const orders = tableInfo.orders;
                const totalAmount = tableInfo.totalAmount;
                const uniqueOrderIds = Array.from(new Set(orders.map(o => o.OrderID))).join(', ') || 'N/A';

                const accordionItemId = `table-collapse-${tableNumber.toString().replace(/[^a-zA-Z0-9]/g, '')}`;
                const accordionHeaderId = `table-header-${tableNumber.toString().replace(/[^a-zA-Z0-9]/g, '')}`;

                let itemsHtml = '<ul class="list-group list-group-flush">';
                if (orders && orders.length > 0) {
                    orders.forEach(item => {
                        itemsHtml += `
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    ${item.ItemName} x ${item.Quantity}
                                    <br><small class="text-muted">สถานะ: ${item.Status} (ID: ${item.OrderID})</small>
                                </div>
                                <span class="badge bg-light text-dark">${parseFloat(item.Subtotal || 0).toFixed(2)} บ.</span>
                            </li>`;
                    });
                } else {
                    itemsHtml += '<li class="list-group-item text-muted">ไม่มีรายการสั่งซื้อสำหรับโต๊ะนี้</li>';
                }
                itemsHtml += '</ul>';

                // Determine if this accordion item should be shown expanded
                // For initial load, first item is expanded. For background updates, try to preserve state (more complex)
                // Simple approach: only first item on initial load is expanded.
                const isExpanded = isInitialLoad && index === 0;
                const buttonCollapsedClass = isExpanded ? '' : 'collapsed';
                const divShowClass = isExpanded ? 'show' : '';


                newContent += `
                    <div class="accordion-item admin-table-card">
                        <h2 class="accordion-header" id="${accordionHeaderId}">
                            <button class="accordion-button ${buttonCollapsedClass}" type="button" data-bs-toggle="collapse" data-bs-target="#${accordionItemId}" aria-expanded="${isExpanded}" aria-controls="${accordionItemId}">
                                <strong>โต๊ะ ${tableNumber}</strong> &nbsp;-&nbsp;
                                <span class="badge bg-success me-2">ยอดรวม: ${totalAmount.toFixed(2)} บาท</span>
                                <small class="text-muted">(Order IDs: ${uniqueOrderIds})</small>
                            </button>
                        </h2>
                        <div id="${accordionItemId}" class="accordion-collapse collapse ${divShowClass}" aria-labelledby="${accordionHeaderId}" data-bs-parent="#admin-orders-accordion">
                            <div class="accordion-body">
                                ${itemsHtml}
                                <button class="btn btn-primary mt-3 w-100 check-bill-btn" data-table="${tableNumber}" data-amount="${totalAmount.toFixed(2)}">
                                    <i class="bi bi-cash-coin btn-icon"></i> เช็คบิลโต๊ะ ${tableNumber} (ยอด: ${totalAmount.toFixed(2)} บาท)
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
             // Only update DOM if new content is different to avoid unnecessary re-renders/flicker
            if (adminOrdersAccordion.innerHTML !== newContent) {
                adminOrdersAccordion.innerHTML = newContent;
            }


            document.querySelectorAll('.check-bill-btn').forEach(btn => {
                btn.addEventListener('click', handleCheckBill);
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

        if (!confirm(`คุณต้องการเช็คบิลโต๊ะ ${tableNum} ยอดรวม ${amount} บาท ใช่หรือไม่?`)) {
            return;
        }

        const originalButtonText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> กำลังเช็คบิล...`;

        // Check bill is a user action, show spinner
        const result = await fetchData('calculateBill', { table: tableNum }, 'GET', null, false);

        if (result && result.success) {
            showUserMessage(result.message || `เช็คบิลโต๊ะ ${tableNum} สำเร็จ!`, "success");
            loadAdminOrders(true); // Reload admin orders with spinner after successful billing
        } else {
            showUserMessage("เกิดข้อผิดพลาดในการเช็คบิล: " + (result ? result.message : "ไม่สามารถเชื่อมต่อได้"), "danger");
            button.disabled = false;
            button.innerHTML = originalButtonText;
        }
    }

    if(refreshBtn) refreshBtn.addEventListener('click', () => loadAdminOrders(true));

    loadAdminOrders(true);
    setInterval(() => {
        loadAdminOrders(false);
    }, 30000); // อัปเดตหน้าแอดมินทุก 30 วินาที
});
