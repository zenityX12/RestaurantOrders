// js/kitchen.js

document.addEventListener('DOMContentLoaded', () => {
    const kitchenOrdersContainer = document.getElementById('kitchen-orders-container');
    const kitchenLoadingPlaceholder = document.getElementById('kitchen-loading-placeholder');
    const refreshBtn = document.getElementById('refresh-kitchen-orders-btn');

    // ฟังก์ชันอัปเดตและคำนวณเวลาที่ผ่านไป
    function updateElapsedTimes() {
        document.querySelectorAll('.order-item-elapsed-time').forEach(el => {
            const orderTimestampStr = el.dataset.timestamp;
            // ตรวจสอบว่าปุ่มยังไม่ได้ถูก disable (คือยังไม่ได้กด "เสิร์ฟแล้ว")
            // หรือถ้าปุ่ม disable ไปแล้ว แต่ยังต้องการแสดงเวลาที่ใช้ไป ก็ปรับ logic ตรงนี้
            const associatedButton = el.closest('li').querySelector('.kitchen-action-btn');
            if (orderTimestampStr && associatedButton && !associatedButton.classList.contains('btn-success')) { // เช็คจาก class สีเขียว (btn-success)
                const startTime = new Date(orderTimestampStr).getTime();
                const now = new Date().getTime();
                const diffMs = now - startTime;
                const minutes = Math.floor(diffMs / 60000);

                if (minutes < 1) {
                    el.textContent = "เมื่อสักครู่";
                } else {
                    el.textContent = `${minutes} นาทีที่แล้ว`;
                }
                 el.classList.remove('text-success', 'fst-italic'); // ลบสไตล์ "เสิร์ฟแล้ว" ออก
            } else if (associatedButton && associatedButton.classList.contains('btn-success')) {
                // ถ้าปุ่มเป็นสีเขียว (เสิร์ฟแล้ว) ให้แสดงข้อความอื่น หรือล้างข้อความเวลา
                el.textContent = "(เสิร์ฟแล้ว)";
                el.classList.add('text-success', 'fst-italic');
            }
        });
    }
    const elapsedTimeInterval = setInterval(updateElapsedTimes, 60000); // อัปเดตทุก 1 นาที


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

        // เก็บ OrderID ของ Ticket ที่มีอยู่บนหน้าจอก่อนเคลียร์ (สำหรับ Background Update)
        const existingTicketOrderIds = !isInitialLoad ? Array.from(kitchenOrdersContainer.querySelectorAll('.kitchen-ticket-card')).map(card => card.dataset.orderid) : [];


        if (isInitialLoad || (orders && Array.isArray(orders))) {
             // ถ้าเป็น background update และไม่มี order ใหม่เลย ก็อาจจะไม่ต้อง clear ทั้งหมด
             // แต่เพื่อความง่าย และให้ UI สอดคล้องกับข้อมูลจาก server เสมอ การ clear แล้ว render ใหม่จะปลอดภัยกว่า
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
                // item ที่ได้จาก getKitchenQueueOrders จะมีสถานะเป็น "Preparing" เท่านั้น
                acc[item.OrderID].items.push(item);
                return acc;
            }, {});

            const sortedOrderTickets = Object.values(groupedByOrderId).sort((a, b) => {
                return new Date(a.timestamp) - new Date(b.timestamp);
            });

            let newContent = '';
            sortedOrderTickets.forEach(ticket => {
                // เนื่องจาก getKitchenQueueOrders ดึงมาเฉพาะ "Preparing"
                // ถ้า ticket.items ว่างเปล่า แสดงว่า OrderID นี้ไม่มีรายการ Preparing เหลือแล้ว (ควรจะถูกกรองจาก GAS ไปแล้ว)
                // แต่ถ้ายังหลุดมา ก็ไม่ต้อง render
                if (ticket.items.length === 0) return;

                let itemsHtml = '<ul class="list-group list-group-flush">';
                ticket.items.forEach(item => {
                    // ปุ่มจะเริ่มต้นเป็น "รอ" เสมอ เพราะรายการที่ดึงมาคือ "Preparing"
                    itemsHtml += `
                        <li class="list-group-item py-2">
                            <div class="d-flex w-100 justify-content-between align-items-center">
                                <div class="me-2">
                                    <h6 class="mb-1">${item.ItemName} <span class="badge bg-secondary">x ${item.Quantity}</span></h6>
                                    ${item.ItemNote ? `<small class="text-danger fst-italic d-block admin-item-note"><strong>โน้ト:</strong> ${item.ItemNote}</small>` : ''}
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
        button.disabled = true; // Disable ทันทีที่กด
        button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

        const result = await fetchData('updateOrderStatus', {
            orderId: orderId,
            itemId: itemId,
            newStatus: "Served"
        }, 'GET', null, false); // User action, show full spinner via fetchData

        if (result && result.success) {
            showUserMessage(result.message || `รายการ ${itemId} ถูกทำเครื่องหมายว่า "เสิร์ฟแล้ว"`, "success");

            // เปลี่ยนปุ่มเป็น "เสิร์ฟแล้ว" (สีเขียว) และยังคง disable
            button.classList.remove('btn-warning');
            button.classList.add('btn-success'); // ไม่ต้อง add 'disabled' เพราะ disabled ไปแล้ว
            button.innerHTML = '<i class="bi bi-check-circle-fill"></i> เสิร์ฟแล้ว';

            const elapsedTimeEl = button.closest('li').querySelector('.order-item-elapsed-time');
            if (elapsedTimeEl) {
                elapsedTimeEl.textContent = "(เสิร์ฟแล้ว)";
                elapsedTimeEl.classList.add('text-success', 'fst-italic');
            }

            // ตรวจสอบว่าทุกรายการใน Ticket นี้ถูกกด "เสิร์ฟแล้ว" (คือเป็นปุ่มสีเขียว) หรือไม่
            // ถ้าใช่ทั้งหมด Ticket นี้จะหายไปในรอบการ refresh ครั้งถัดไป เพราะ getKitchenQueueOrders จะไม่ดึงมาแล้ว
            // หรือถ้าอยากให้หายไปทันที อาจจะต้องมี logic ซ่อน DOM element ของ ticket นั้นๆ
            // แต่เพื่อให้ง่ายและข้อมูลตรงกับ server เสมอ การรอ refresh รอบถัดไป (ซึ่งจะค่อนข้างเร็ว) ก็เป็นวิธีที่ดี

            // เพื่อให้ UI ตอบสนองเร็วขึ้น อาจจะโหลดข้อมูลใหม่ทันทีแบบ background
            // แต่การทำแบบนี้อาจจะทำให้เกิดการเรียก API ซ้อนกันถ้าผู้ใช้กดยิกๆ
            // การปล่อยให้ interval ทำงาน หรือการกดปุ่ม refresh โดยรวม อาจจะดีกว่า
            // หรือถ้าจะให้ดีคือ หลังจากกดปุ่มสำเร็จ ให้รอสักพักเล็กน้อยแล้วค่อยโหลดใหม่
            setTimeout(() => {
                loadKitchenOrders(false); // โหลดข้อมูลครัวใหม่แบบ background เพื่ออัปเดตทันที
            }, 500); // หน่วงเวลาเล็กน้อย

        } else {
            showUserMessage(`เกิดข้อผิดพลาดในการอัปเดตสถานะ: ${result ? result.message : "ไม่สามารถเชื่อมต่อได้"}`, "danger");
            button.disabled = false; // คืนค่าปุ่มถ้า error
            button.innerHTML = originalButtonText;
        }
    }

    if(refreshBtn) refreshBtn.addEventListener('click', () => loadKitchenOrders(true));

    loadKitchenOrders(true);
    setInterval(() => {
        loadKitchenOrders(false);
    }, 20000); // อัปเดตหน้าห้องครัวทุก 20 วินาที (หรือตามความเหมาะสม)
});
