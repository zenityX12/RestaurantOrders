// js/kitchen.js

document.addEventListener('DOMContentLoaded', () => {
    const kitchenOrdersContainer = document.getElementById('kitchen-orders-container');
    const kitchenLoadingPlaceholder = document.getElementById('kitchen-loading-placeholder');
    const refreshBtn = document.getElementById('refresh-kitchen-orders-btn');

    async function loadKitchenOrders(isInitialLoad = true) {
        if(kitchenLoadingPlaceholder && isInitialLoad) kitchenLoadingPlaceholder.style.display = 'block';

        // fetchData จะเรียก getKitchenOrders ซึ่ง GAS จะกรองเฉพาะสถานะ "Preparing" มาให้
        const orders = await fetchData('getKitchenOrders', {}, 'GET', null, !isInitialLoad);
        if(kitchenLoadingPlaceholder && isInitialLoad) kitchenLoadingPlaceholder.style.display = 'none';

        if (!orders && !isInitialLoad) {
            console.warn("Background update for kitchen orders failed or returned no data.");
            return;
        }
        if (!orders && isInitialLoad) {
            kitchenOrdersContainer.innerHTML = '<p class="text-center text-danger mt-3 col-12">ไม่สามารถโหลดรายการอาหารได้</p>';
            return;
        }

        if (isInitialLoad || (orders && Array.isArray(orders))) {
            kitchenOrdersContainer.innerHTML = '';
        }

        if (orders && Array.isArray(orders) && orders.length > 0) {
            // จัดกลุ่มรายการตาม OrderID เพื่อแสดงผลเป็น "ใบสั่งอาหาร" (Ticket)
            const groupedByOrderId = orders.reduce((acc, item) => {
                if (!acc[item.OrderID]) {
                    acc[item.OrderID] = {
                        orderId: item.OrderID,
                        tableNumber: item.TableNumber,
                        timestamp: item.Timestamp, // ใช้ timestamp ของรายการแรกในกลุ่ม
                        items: []
                    };
                }
                acc[item.OrderID].items.push(item);
                return acc;
            }, {});

            // เรียงใบสั่งอาหารตามเวลา (ใบเก่าขึ้นก่อน)
            const sortedOrderTickets = Object.values(groupedByOrderId).sort((a, b) => {
                return new Date(a.timestamp) - new Date(b.timestamp);
            });

            let newContent = '';
            sortedOrderTickets.forEach(ticket => {
                let itemsHtml = '<ul class="list-group list-group-flush">';
                ticket.items.forEach(item => { // item ทั้งหมดใน ticket นี้จะมีสถานะเป็น "Preparing"
                    itemsHtml += `
                        <li class="list-group-item">
                            <div class="d-flex w-100 justify-content-between">
                                <div>
                                    <h6 class="mb-1">${item.ItemName} <span class="badge bg-secondary">x ${item.Quantity}</span></h6>
                                    ${item.ItemNote ? `<small class="text-danger fst-italic d-block"><strong>โน้ต:</strong> ${item.ItemNote}</small>` : ''}
                                    </div>
                                <button class="btn btn-sm btn-success kitchen-action-btn mark-served-btn"
                                        data-orderid="${item.OrderID}"
                                        data-itemid="${item.ItemID}"
                                        data-timestamp="${item.Timestamp}"
                                        title="ทำเสร็จแล้ว และนำไปเสิร์ฟแล้ว">
                                    <i class="bi bi-check-circle-fill"></i> เสิร์ฟแล้ว
                                </button>
                            </div>
                        </li>`;
                });
                itemsHtml += '</ul>';

                newContent += `
                    <div class="col">
                        <div class="card h-100 shadow-sm kitchen-order-card status-preparing"> {/* ใช้ status-preparing สำหรับ card ทั้งใบ */}
                            <div class="card-header">
                                <div class="d-flex w-100 justify-content-between">
                                    <strong class="fs-5">โต๊ะ ${ticket.tableNumber}</strong>
                                    <small class="text-muted">ID ออเดอร์: ${ticket.orderId.slice(-5)}</small> {/* แสดง ID ย่อ */}
                                </div>
                                <small class="text-muted">เวลาสั่ง: ${new Date(ticket.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</small>
                            </div>
                            <div class="card-body p-0">
                                ${itemsHtml}
                            </div>
                        </div>
                    </div>
                `;
            });

            if (kitchenOrdersContainer.innerHTML !== newContent && newContent !== '') {
                kitchenOrdersContainer.innerHTML = newContent;
            } else if (newContent === '' && orders && orders.length === 0) {
                kitchenOrdersContainer.innerHTML = '<p class="text-center text-muted mt-3 col-12">ไม่มีรายการอาหารที่ต้องเตรียมในขณะนี้</p>';
            }

            // ผูก Event Listeners กับปุ่ม "เสิร์ฟแล้ว" ที่สร้างขึ้นใหม่
            document.querySelectorAll('.mark-served-btn').forEach(btn => {
                btn.addEventListener('click', e => {
                    const button = e.currentTarget;
                    // ส่ง Timestamp ของรายการไปด้วย เพื่อให้ GAS สามารถระบุรายการได้แม่นยำ (ถ้าจำเป็น)
                    // แต่ใน updateItemStatusInSheet ปัจจุบันใช้แค่ OrderID กับ ItemID
                    // ถ้า ItemID ใน OrderID เดียวกันไม่ซ้ำ ก็ไม่จำเป็นต้องใช้ Timestamp ในการ update
                    // แต่การส่งไปเผื่อก็ไม่เสียหาย (GAS function updateItemStatusInSheet ไม่ได้ใช้ itemTimestamp param)
                    updateKitchenItemStatus(button.dataset.orderid, button.dataset.itemid, "Served", button);
                });
            });

        } else if (orders && orders.error && isInitialLoad) {
            kitchenOrdersContainer.innerHTML = `<p class="text-danger text-center col-12">เกิดข้อผิดพลาด: ${orders.error}</p>`;
        } else if (isInitialLoad || (orders && orders.length === 0)) {
            kitchenOrdersContainer.innerHTML = '<p class="text-center text-muted mt-3 col-12">ไม่มีรายการอาหารที่ต้องเตรียมในขณะนี้</p>';
        }
    }

    async function updateKitchenItemStatus(orderId, itemId, newStatus, buttonElement, suppressReload = false) {
        let originalButtonText = '';
        if(buttonElement) {
            originalButtonText = buttonElement.innerHTML;
            buttonElement.disabled = true;
            buttonElement.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> กำลังบันทึก...`;
        }

        // User-initiated action, show spinner (fetchData's isBackgroundFetch = false by default)
        const result = await fetchData('updateOrderStatus', { orderId: orderId, itemId: itemId, newStatus: newStatus });

        if (result && result.success) {
            if (!suppressReload) {
                 showUserMessage(result.message || `อัปเดตสถานะสำเร็จ`, "success");
                 loadKitchenOrders(false); // โหลดรายการในครัวใหม่แบบ background หลังจาก action
            }
            // ไม่ต้อง re-enable button เพราะรายการที่สำเร็จควรจะหายไปจากการโหลดใหม่
            return result;
        } else {
            showUserMessage("เกิดข้อผิดพลาดในการอัปเดตสถานะ: " + (result ? result.message : "ไม่สามารถเชื่อมต่อได้"), "danger");
            if(buttonElement) {
                buttonElement.disabled = false;
                buttonElement.innerHTML = originalButtonText;
            }
            return result;
        }
    }

    if(refreshBtn) refreshBtn.addEventListener('click', () => loadKitchenOrders(true));

    loadKitchenOrders(true); // Initial load with spinner
    setInterval(() => {
        loadKitchenOrders(false); // Background polling
    }, 15000); // อัปเดตหน้าห้องครัวทุก 15 วินาที (หรือตามความเหมาะสม)
});
