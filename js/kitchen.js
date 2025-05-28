// js/kitchen.js

document.addEventListener('DOMContentLoaded', () => {
    const kitchenOrdersContainer = document.getElementById('kitchen-orders-container');
    const kitchenLoadingPlaceholder = document.getElementById('kitchen-loading-placeholder');
    const refreshBtn = document.getElementById('refresh-kitchen-orders-btn');

    let elapsedTimeIntervalId = null;

    function updateElapsedTimesAndButtonColors() {
        document.querySelectorAll('.kitchen-action-btn:not(.item-served-button)').forEach(button => {
            const orderTimestampStr = button.dataset.timestampForItem;
            if (orderTimestampStr) {
                const startTime = new Date(orderTimestampStr).getTime();
                const now = new Date().getTime();
                const diffSeconds = Math.max(0, Math.floor((now - startTime) / 1000));

                button.innerHTML = `รอ ${diffSeconds} วิ <i class="bi bi-hourglass-split"></i>`;

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

    async function loadKitchenOrders(isInitialLoad = true) {
        if(kitchenLoadingPlaceholder && isInitialLoad) {
            kitchenLoadingPlaceholder.textContent = "กำลังโหลดรายการอาหาร...";
            kitchenLoadingPlaceholder.style.display = 'block';
        }


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
                        timestamp: item.Timestamp, // Timestamp ของรายการแรกในกลุ่ม (GAS ควรเรียงมาแล้ว)
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
                                    ${item.ItemNote ? `<small class="text-danger fst-italic d-block admin-item-note"><strong>โน้ต:</strong> ${item.ItemNote}</small>` : ''}
                                    </div>
                                <button class="btn btn-sm kitchen-action-btn"
                                        data-orderid="<span class="math-inline">\{item\.OrderID\}"
data\-itemid\="</span>{item.ItemID}"
                                        data-itemname="<span class="math-inline">\{item\.ItemName\}"
data\-timestamp\-for\-item\="</span>{itemTimestampForAttr}"
                                        title="คลิกเมื่อเสิร์ฟรายการนี้แล้ว">
                                    รอ... <i class="bi bi-hourglass-split"></i>
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
                                    <strong class="fs-5">โต๊ะ <span class="math-inline">\{ticket\.tableNumber\}</strong\>
<small class\="text\-muted"\>ID ออเดอร์\: \.\.\.</span>{ticket.orderId.slice(-5)}</small>
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

            document.querySelectorAll('.kitchen-action-btn:not(.item-served-button)').forEach(btn => {
                btn.addEventListener('click', handleMarkAsServed);
            });
            updateElapsedTimesAndButtonColors();

        } else if (orders && orders.error && isInitialLoad) {
            kitchenOrdersContainer.innerHTML = `<p class="text-danger text-center col-12">เกิดข้อผิดพลาดในการโหลดรายการ</p>`;
        } else if (isInitialLoad || (orders && orders.length === 0)) {
            kitchenOrdersContainer.innerHTML = '<p class="text-center text-muted mt-3 col-12">ไม่มีรายการอาหารที่ต้องเตรียมในขณะนี้</p>';
        }
    }

    async function handleMarkAsServed(event) {
        const button = event.currentTarget;
        const orderId = button.dataset.orderid;
        const itemId = button.dataset.itemid;
        const itemName = button.dataset.itemname || itemId;

        button.classList.add('item-served-button');
        button.style.backgroundColor = ''; // Clear inline style
        button.style.color = '';
        button.style.borderColor = '';

        const originalButtonText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> กำลังบันทึก...`;

        const result = await fetchData('updateOrderStatus', {
            orderId: orderId,
            itemId: itemId,
            newStatus: "Served"
        }, 'GET', null, false);

        if (result && result.success) {
            showUserMessage(`รายการ ${itemName} ถูกทำเครื่องหมายว่า "เสิร์ฟแล้ว"`, "success");
            button.classList.remove('btn-warning'); // Ensure warning class is removed
            button.classList.add('btn-success');
            button.innerHTML = '<i class="bi bi-check-circle-fill"></i> เสิร์ฟแล้ว';
            // Button remains disabled

            const elapsedTimeEl = button.closest('li').querySelector('.order-item-elapsed-time');
            if (elapsedTimeEl) { // Not all buttons might have this if structure changes
                 // This element is not present in the current kitchen.js HTML structure for item list
                 // The time was displayed on the button itself.
                 // If we want to show status next to item name after button press:
                 // const itemInfoDiv = button.closest('li').querySelector('div:first-child');
                 // if(itemInfoDiv) {
                 //    let statusTextEl = itemInfoDiv.querySelector('.item-served-status-text');
                 //    if(!statusTextEl) {
                 //        statusTextEl = document.createElement('small');
                 //        statusTextEl.className = 'd-block text-success fst-italic item-served-status-text';
                 //        itemInfoDiv.appendChild(statusTextEl);
                 //    }
                 //    statusTextEl.textContent = "(เสิร์ฟแล้ว)";
                 // }
            }
            setTimeout(() => {
                loadKitchenOrders(false); // Reload kitchen orders silently to remove served items/tickets
            }, 700);

        } else {
            showUserMessage(`เกิดข้อผิดพลาดในการอัปเดตสถานะ: ${result ? result.message : "ไม่สามารถเชื่อมต่อได้"}`, "danger");
            button.disabled = false;
            button.innerHTML = originalButtonText;
            button.classList.remove('item-served-button');
            updateElapsedTimesAndButtonColors(); // Restore color if error
        }
    }

    if(refreshBtn) {
        refreshBtn.addEventListener('click', () => loadKitchenOrders(true));
    }

    if (elapsedTimeIntervalId) clearInterval(elapsedTimeIntervalId);
    elapsedTimeIntervalId = setInterval(updateElapsedTimesAndButtonColors, 1000);

    loadKitchenOrders(true);
    if (window.kitchenOrderPollingIntervalId) {
        clearInterval(window.kitchenOrderPollingIntervalId);
    }
    window.kitchenOrderPollingIntervalId = setInterval(() => {
        loadKitchenOrders(false);
    }, 20000);
});
