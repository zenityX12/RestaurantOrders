// js/kitchen.js

document.addEventListener('DOMContentLoaded', () => {
    const kitchenOrdersContainer = document.getElementById('kitchen-orders-container');
    const kitchenLoadingPlaceholder = document.getElementById('kitchen-loading-placeholder');
    const refreshBtn = document.getElementById('refresh-kitchen-orders-btn');

    async function loadKitchenOrders() {
        if(kitchenLoadingPlaceholder) kitchenLoadingPlaceholder.style.display = 'block';
        kitchenOrdersContainer.innerHTML = ''; // Clear previous orders

        // Fetches individual order items with relevant statuses (Pending, Confirmed, Preparing)
        // Sorted by timestamp by GAS
        const orders = await fetchData('getKitchenOrders');
        if(kitchenLoadingPlaceholder) kitchenLoadingPlaceholder.style.display = 'none';

        if (orders && Array.isArray(orders) && orders.length > 0) {
            // Group items by OrderID for better display
            const groupedByOrderId = orders.reduce((acc, item) => {
                if (!acc[item.OrderID]) {
                    acc[item.OrderID] = {
                        orderId: item.OrderID,
                        tableNumber: item.TableNumber,
                        timestamp: item.Timestamp, // Use timestamp of the first item in group
                        items: []
                    };
                }
                acc[item.OrderID].items.push(item);
                return acc;
            }, {});

            // Convert grouped object back to array and sort by timestamp (oldest order first)
            const sortedGroupedOrders = Object.values(groupedByOrderId).sort((a, b) => {
                return new Date(a.timestamp) - new Date(b.timestamp);
            });

            sortedGroupedOrders.forEach(orderGroup => {
                const card = document.createElement('div');
                card.className = 'col';

                let itemsHtml = '<ul class="list-group list-group-flush">';
                // Determine overall card status for border styling (e.g., if any item is 'Preparing', card is 'Preparing')
                let overallCardStatus = "pending"; // default
                if (orderGroup.items.some(i => i.Status === "Preparing")) overallCardStatus = "preparing";
                else if (orderGroup.items.some(i => i.Status === "Confirmed")) overallCardStatus = "confirmed";


                orderGroup.items.forEach(item => {
                    itemsHtml += `
                        <li class="list-group-item">
                            <div class="d-flex w-100 justify-content-between">
                                <h6 class="mb-1">${item.ItemName} <span class="badge bg-secondary">x ${item.Quantity}</span></h6>
                                <small class="text-muted">สถานะ: ${item.Status}</small>
                            </div>
                            <div class="mt-2 text-end">`;

                    if (item.Status === "Pending") {
                        itemsHtml += `<button class="btn btn-sm btn-outline-primary me-1 kitchen-action-btn" data-orderid="${item.OrderID}" data-itemid="${item.ItemID}" data-newstatus="Confirmed"><i class="bi bi-check-circle"></i> ยืนยัน</button>`;
                        itemsHtml += `<button class="btn btn-sm btn-warning kitchen-action-btn" data-orderid="${item.OrderID}" data-itemid="${item.ItemID}" data-newstatus="Preparing"><i class="bi bi-play-circle"></i> เริ่มทำ</button>`;
                    } else if (item.Status === "Confirmed") {
                        itemsHtml += `<button class="btn btn-sm btn-warning kitchen-action-btn" data-orderid="${item.OrderID}" data-itemid="${item.ItemID}" data-newstatus="Preparing"><i class="bi bi-play-circle"></i> เริ่มทำ</button>`;
                    } else if (item.Status === "Preparing") {
                        itemsHtml += `<button class="btn btn-sm btn-success kitchen-action-btn" data-orderid="${item.OrderID}" data-itemid="${item.ItemID}" data-newstatus="Served"><i class="bi bi-check-lg"></i> เสิร์ฟแล้ว</button>`;
                    }
                    itemsHtml += `</div></li>`;
                });
                itemsHtml += '</ul>';

                card.innerHTML = `
                    <div class="card h-100 shadow-sm kitchen-order-card status-${overallCardStatus}">
                        <div class="card-header">
                            <div class="d-flex w-100 justify-content-between">
                                <strong class="fs-5">โต๊ะ ${orderGroup.tableNumber}</strong>
                                <small class="text-muted">ID: ${orderGroup.orderId}</small>
                            </div>
                            <small class="text-muted">เวลาสั่ง: ${new Date(orderGroup.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</small>
                        </div>
                        <div class="card-body p-0">
                            ${itemsHtml}
                        </div>
                        ${ orderGroup.items.every(i => i.Status === "Pending") ?
                           `<div class="card-footer bg-transparent text-center">
                                <button class="btn btn-sm btn-primary w-100 confirm-all-items-btn" data-orderid="${orderGroup.orderId}"><i class="bi bi-check2-all"></i> ยืนยันทุกรายการในออเดอร์นี้</button>
                            </div>` : ''
                        }
                         ${ orderGroup.items.every(i => i.Status === "Confirmed") && orderGroup.items.some(i => i.Status !== "Preparing") ?
                           `<div class="card-footer bg-transparent text-center">
                                <button class="btn btn-sm btn-warning w-100 prepare-all-confirmed-items-btn" data-orderid="${orderGroup.orderId}"><i class="bi bi-play-fill"></i> เริ่มทำทุกรายการที่ยืนยันแล้ว</button>
                            </div>` : ''
                        }
                    </div>
                `;
                kitchenOrdersContainer.appendChild(card);
            });

            // Add event listeners for status update buttons
            document.querySelectorAll('.kitchen-action-btn').forEach(btn => {
                btn.addEventListener('click', e => {
                    const button = e.currentTarget;
                    updateKitchenItemStatus(button.dataset.orderid, button.dataset.itemid, button.dataset.newstatus, button);
                });
            });

            // Event listener for "Confirm All" button
            document.querySelectorAll('.confirm-all-items-btn').forEach(btn => {
                btn.addEventListener('click', async e => {
                    const button = e.currentTarget;
                    const orderIdToConfirm = button.dataset.orderid;
                    const orderGroup = sortedGroupedOrders.find(og => og.orderId === orderIdToConfirm);

                    if (orderGroup && confirm(`ยืนยันทุกรายการ "Pending" ในออเดอร์ ${orderIdToConfirm} หรือไม่?`)){
                        button.disabled = true;
                        button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> กำลังยืนยัน...`;
                        let allSucceeded = true;
                        for(const item of orderGroup.items){
                            if(item.Status === "Pending"){
                                const result = await updateKitchenItemStatus(orderIdToConfirm, item.ItemID, "Confirmed", null, true); // true to suppress individual reload
                                if(!result || !result.success) allSucceeded = false;
                            }
                        }
                        if(allSucceeded) showUserMessage(`ทุกรายการ Pending ในออเดอร์ ${orderIdToConfirm} ถูกยืนยันแล้ว`, "success");
                        else showUserMessage(`เกิดข้อผิดพลาดในการยืนยันบางรายการในออเดอร์ ${orderIdToConfirm}`, "warning");
                        loadKitchenOrders(); // Reload all after batch update
                    }
                });
            });
             // Event listener for "Prepare All Confirmed" button
            document.querySelectorAll('.prepare-all-confirmed-items-btn').forEach(btn => {
                btn.addEventListener('click', async e => {
                    const button = e.currentTarget;
                    const orderIdToPrepare = button.dataset.orderid;
                    const orderGroup = sortedGroupedOrders.find(og => og.orderId === orderIdToPrepare);

                    if (orderGroup && confirm(`เริ่มทำทุกรายการ "Confirmed" ในออเดอร์ ${orderIdToPrepare} หรือไม่?`)){
                        button.disabled = true;
                        button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> กำลังเริ่มทำ...`;
                        let allSucceeded = true;
                        for(const item of orderGroup.items){
                            if(item.Status === "Confirmed"){
                                const result = await updateKitchenItemStatus(orderIdToPrepare, item.ItemID, "Preparing", null, true); // true to suppress individual reload
                                if(!result || !result.success) allSucceeded = false;
                            }
                        }
                        if(allSucceeded) showUserMessage(`ทุกรายการ Confirmed ในออเดอร์ ${orderIdToPrepare} เริ่มทำแล้ว`, "success");
                        else showUserMessage(`เกิดข้อผิดพลาดในการเริ่มทำบางรายการในออเดอร์ ${orderIdToPrepare}`, "warning");
                        loadKitchenOrders(); // Reload all after batch update
                    }
                });
            });


        } else if (orders && orders.error) {
            kitchenOrdersContainer.innerHTML = `<p class="text-danger text-center col-12">เกิดข้อผิดพลาด: ${orders.error}</p>`;
        }
        else {
            kitchenOrdersContainer.innerHTML = '<p class="text-center text-muted mt-3 col-12">ยังไม่มีรายการสั่งอาหารใหม่ในขณะนี้</p>';
        }
    }

    async function updateKitchenItemStatus(orderId, itemId, newStatus, buttonElement, suppressReload = false) {
        let originalButtonText = '';
        if(buttonElement) {
            originalButtonText = buttonElement.innerHTML;
            buttonElement.disabled = true;
            buttonElement.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
        }

        const result = await fetchData('updateOrderStatus', { orderId: orderId, itemId: itemId, newStatus: newStatus });

        if (result && result.success) {
            if (!suppressReload) {
                 showUserMessage(result.message || `อัปเดตสถานะสำเร็จ`, "success");
                 loadKitchenOrders(); // Refresh the view
            }
            return result; // Return result for batch operations
        } else {
            showUserMessage("เกิดข้อผิดพลาดในการอัปเดตสถานะ: " + (result ? result.message : "ไม่สามารถเชื่อมต่อได้"), "danger");
            if(buttonElement) {
                buttonElement.disabled = false;
                buttonElement.innerHTML = originalButtonText;
            }
            return result; // Return result for batch operations
        }
    }

    if(refreshBtn) refreshBtn.addEventListener('click', loadKitchenOrders);

    loadKitchenOrders(); // Initial load
    setInterval(loadKitchenOrders, 15000); // Auto-refresh every 15 seconds
});
