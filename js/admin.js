// js/admin.js

document.addEventListener('DOMContentLoaded', () => {
    const adminOrdersAccordion = document.getElementById('admin-orders-accordion');
    const adminLoadingPlaceholder = document.getElementById('admin-loading-placeholder');
    const refreshBtn = document.getElementById('refresh-admin-orders-btn');

    async function loadAdminOrders() {
        if(adminLoadingPlaceholder) adminLoadingPlaceholder.style.display = 'block';
        adminOrdersAccordion.innerHTML = ''; // Clear existing content before loading

        // fetchData should handle the action 'getAllActiveOrders'
        const tablesData = await fetchData('getAllActiveOrders');
        if(adminLoadingPlaceholder) adminLoadingPlaceholder.style.display = 'none';


        if (tablesData && Array.isArray(tablesData) && tablesData.length > 0) {
            // Sort tables by table number (ensure numeric comparison if table numbers are strings)
            tablesData.sort((a, b) => parseInt(String(a.table).replace(/\D/g,'') || 0) - parseInt(String(b.table).replace(/\D/g,'') || 0));


            tablesData.forEach((tableInfo, index) => {
                const tableNumber = tableInfo.table;
                const orders = tableInfo.orders; // This is an array of individual items for this table
                const totalAmount = tableInfo.totalAmount;
                const uniqueOrderIds = Array.from(new Set(orders.map(o => o.OrderID))).join(', ');


                const accordionItemId = `table-collapse-${tableNumber.toString().replace(/[^a-zA-Z0-9]/g, '')}`; // Sanitize ID
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
                                <span class="badge bg-light text-dark">${parseFloat(item.Subtotal).toFixed(2)} บ.</span>
                            </li>`;
                    });
                } else {
                    itemsHtml += '<li class="list-group-item text-muted">ไม่มีรายการสั่งซื้อสำหรับโต๊ะนี้</li>';
                }
                itemsHtml += '</ul>';

                const tableAccordionHtml = `
                    <div class="accordion-item admin-table-card">
                        <h2 class="accordion-header" id="${accordionHeaderId}">
                            <button class="accordion-button ${index === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#${accordionItemId}" aria-expanded="${index === 0}" aria-controls="${accordionItemId}">
                                <strong>โต๊ะ ${tableNumber}</strong> &nbsp;-&nbsp;
                                <span class="badge bg-success me-2">ยอดรวม: ${totalAmount.toFixed(2)} บาท</span>
                                <small class="text-muted">(Order IDs: ${uniqueOrderIds})</small>
                            </button>
                        </h2>
                        <div id="${accordionItemId}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" aria-labelledby="${accordionHeaderId}" data-bs-parent="#admin-orders-accordion">
                            <div class="accordion-body">
                                ${itemsHtml}
                                <button class="btn btn-primary mt-3 w-100 check-bill-btn" data-table="${tableNumber}" data-amount="${totalAmount.toFixed(2)}">
                                    <i class="bi bi-cash-coin btn-icon"></i> เช็คบิลโต๊ะ ${tableNumber} (ยอด: ${totalAmount.toFixed(2)} บาท)
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                adminOrdersAccordion.insertAdjacentHTML('beforeend', tableAccordionHtml);
            });

            // Add event listeners to new "Check Bill" buttons
            document.querySelectorAll('.check-bill-btn').forEach(btn => {
                btn.addEventListener('click', handleCheckBill);
            });

        } else if (tablesData && tablesData.error) {
            adminOrdersAccordion.innerHTML = `<p class="text-danger text-center">เกิดข้อผิดพลาด: ${tablesData.error}</p>`;
        }
        else {
            adminOrdersAccordion.innerHTML = '<p class="text-center text-muted mt-3">ยังไม่มีออเดอร์ที่ยังไม่ได้เช็คบิล</p>';
        }
    }

    async function handleCheckBill(event) {
        const button = event.currentTarget;
        const tableNum = button.dataset.table;
        const amount = button.dataset.amount;

        if (!confirm(`คุณต้องการเช็คบิลโต๊ะ ${tableNum} ยอดรวม ${amount} บาท ใช่หรือไม่? \n(การดำเนินการนี้จะเปลี่ยนสถานะออเดอร์เป็น "Billed")`)) {
            return;
        }

        button.disabled = true;
        const originalButtonText = button.innerHTML;
        button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> กำลังเช็คบิล...`;

        const result = await fetchData('calculateBill', { table: tableNum });

        if (result && result.success) {
            showUserMessage(result.message || `เช็คบิลโต๊ะ ${tableNum} สำเร็จ!`, "success");
            loadAdminOrders(); // Refresh view to reflect changes
        } else {
            showUserMessage("เกิดข้อผิดพลาดในการเช็คบิล: " + (result ? result.message : "ไม่สามารถเชื่อมต่อได้"), "danger");
            button.disabled = false;
            button.innerHTML = originalButtonText;
        }
    }

    if(refreshBtn) refreshBtn.addEventListener('click', loadAdminOrders);

    loadAdminOrders(); // Initial load
    setInterval(loadAdminOrders, 30000); // Auto-refresh every 30 seconds
});
