// js/kitchen.js

document.addEventListener('DOMContentLoaded', () => {
    const kitchenOrdersContainer = document.getElementById('kitchen-orders-container');
    const kitchenLoadingPlaceholder = document.getElementById('kitchen-loading-placeholder');
    const refreshBtn = document.getElementById('refresh-kitchen-orders-btn');

    function updateElapsedTimes() {
        document.querySelectorAll('.order-item-elapsed-time').forEach(el => {
            const orderTimestampStr = el.dataset.timestamp;
            const associatedButton = el.closest('li').querySelector('.kitchen-action-btn');
            if (orderTimestampStr && associatedButton && !associatedButton.classList.contains('btn-success')) {
                const startTime = new Date(orderTimestampStr).getTime();
                const now = new Date().getTime();
                const diffMs = now - startTime;
                const minutes = Math.floor(diffMs / 60000);

                if (minutes < 1) {
                    el.textContent = "เมื่อสักครู่";
                } else {
                    el.textContent = `${minutes} นาทีที่แล้ว`;
                }
                 el.classList.remove('text-success', 'fst-italic');
            } else if (associatedButton && associatedButton.classList.contains('btn-success')) {
                el.textContent = "(เสิร์ฟแล้ว)";
                el.classList.add('text-success', 'fst-italic');
            }
        });
    }
    const elapsedTimeInterval = setInterval(updateElapsedTimes, 60000);


    async function loadKitchenOrders(isInitialLoad = true) {
        if(kitchenLoadingPlaceholder && isInitialLoad) kitchenLoadingPlaceholder.style.display = 'block';

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
                    itemsHtml += `
                        <li class="list-group-item py-2">
                            <div class="d-flex w-100 justify-content-between align-items-center">
                                <div class="me-2">
                                    <h6 class="mb-1">${item.ItemName} <span class="badge bg-secondary">x ${item.Quantity}</span></h6>
                                    ${item.ItemNote ? `<small class="text-danger fst-italic d-block admin-item-note"><strong>โน้ต:</strong> ${item.ItemNote}</small>` : ''}
                                    <small class="order-item-elapsed-time text-muted d-block" data-timestamp="${item.Timestamp}">กำลังคำนวณ...</small>
                                </div>
                                <button class="btn btn-sm btn-warning kitchen-action-btn mark-served-btn"
                                        data-orderid="${item.OrderID}"
                                        data-itemid="${item.ItemID}"
                                        title="คลิกเมื่อเสิร์ฟรายการนี้แล้ว">
                                    รอ
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
                                    <strong class="fs-5">โต๊ะ ${ticket.tableNumber}</strong>
                                    <small class="text-muted">ID ออเดอร์: ...${ticket.orderId.slice(-5)}</small>
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

            if (newContent !== '') {
                kitchenOrdersContainer.innerHTML = newContent;
            } else if (orders && orders.length === 0) {
                 kitchenOrdersContainer.innerHTML = '<p class="text-center text-muted mt-3 col-12">ไม่มีรายการอาหารที่ต้องเตรียมในขณะนี้</p>';
            }

            document.querySelectorAll('.mark-served-btn').forEach(btn => {
                btn.addEventListener('click', handleMarkAsServed);
            });
            updateElapsedTimes();

        } else if (orders && orders.error && isInitialLoad) {
            kitchenOrdersContainer.innerHTML = `<p class="text-danger text-center col-12">เกิดข้อผิดพลาด: ${orders.error}</p>`;
        } else if (isInitialLoad || (orders && orders.length === 0)) {
            kitchenOrdersContainer.innerHTML = '<p class="text-center text-muted mt-3 col-12">ไม่มีรายการอาหารที่ต้องเตรียมในขณะนี้</p>';
        }
    }

    async function handleMarkAsServed(event) {
        const button = event.currentTarget;
        const orderId = button.dataset.orderid;
        const itemId = button.dataset.itemid;

        const originalButtonText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

        const result = await fetchData('updateOrderStatus', {
            orderId: orderId,
            itemId: itemId,
            newStatus: "Served"
        }, 'GET', null, false);

        if (result && result.success) {
            showUserMessage(result.message || `รายการ ${itemId} ถูกทำเครื่องหมายว่า "เสิร์ฟแล้ว"`, "success");
            button.classList.remove('btn-warning');
            button.classList.add('btn-success');
            button.innerHTML = '<i class="bi bi-check-circle-fill"></i> เสิร์ฟแล้ว';
            // ไม่ต้อง disable อีก เพราะทำไปแล้ว และจะถูกควบคุมโดย class 'disabled' หรือการไม่ผูก event ใหม่

            const elapsedTimeEl = button.closest('li').querySelector('.order-item-elapsed-time');
            if (elapsedTimeEl) {
                elapsedTimeEl.textContent = "(เสิร์ฟแล้ว)";
                elapsedTimeEl.classList.add('text-success', 'fst-italic');
            }
            // หน่วงเวลาเล็กน้อยก่อนโหลดข้อมูลใหม่ เพื่อให้ User เห็นผลการกดปุ่ม
            // และเพื่อให้แน่ใจว่า Server update เสร็จแล้วก่อนดึงข้อมูล
            setTimeout(() => {
                loadKitchenOrders(false);
            }, 700);


        } else {
            showUserMessage(`เกิดข้อผิดพลาดในการอัปเดตสถานะ: ${result ? result.message : "ไม่สามารถเชื่อมต่อได้"}`, "danger");
            button.disabled = false;
            button.innerHTML = originalButtonText;
        }
    }

    if(refreshBtn) refreshBtn.addEventListener('click', () => loadKitchenOrders(true));

    loadKitchenOrders(true);
    setInterval(() => {
        loadKitchenOrders(false);
    }, 20000);
});
