// js/kitchen.js

document.addEventListener('DOMContentLoaded', () => {
    const kitchenOrdersContainer = document.getElementById('kitchen-orders-container');
    const kitchenLoadingPlaceholder = document.getElementById('kitchen-loading-placeholder');
    const refreshBtn = document.getElementById('refresh-kitchen-orders-btn');

    // Interval ID สำหรับการอัปเดตเวลาและสี
    let elapsedTimeIntervalId = null;

    // ฟังก์ชันคำนวณและอัปเดตเวลา + สีของปุ่ม
    function updateElapsedTimesAndButtonColors() {
        document.querySelectorAll('.kitchen-action-btn:not(.item-served-button)').forEach(button => {
            const orderTimestampStr = button.dataset.timestampForItem; // ใช้ data attribute ใหม่
            if (orderTimestampStr) {
                const startTime = new Date(orderTimestampStr).getTime();
                const now = new Date().getTime();
                const diffSeconds = Math.max(0, Math.floor((now - startTime) / 1000)); // ไม่ให้ติดลบ

                button.innerHTML = `รอ ${diffSeconds} วิ <i class="bi bi-hourglass-split"></i>`;

                // การเปลี่ยนสีแบบ HSL (Hue, Saturation, Lightness)
                // Hue: 60 (เหลือง) -> 0 (แดง)
                // Lightness: 90% (สว่างมาก) -> 50% (เข้มปกติ)
                // Saturation: 100% (สีสด)

                const maxWaitSeconds = 900; // 15 นาที
                const progress = Math.min(diffSeconds / maxWaitSeconds, 1); // 0.0 ถึง 1.0

                // Hue: จาก 60 (เหลือง) ลดลงไปหา 0 (แดง)
                const hue = 60 - (60 * progress);
                // Lightness: จาก 85% (สว่าง) ลดลงไปหา 55% (เข้มขึ้น)
                const lightness = 85 - (30 * progress);
                // Saturation คงที่ที่ 100%
                const saturation = 100;

                button.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                button.style.borderColor = `hsl(${hue}, ${saturation}%, ${Math.max(40, lightness - 10)}%)`; // ขอบเข้มกว่าเล็กน้อย
                // เปลี่ยนสีข้อความตามความสว่างของพื้นหลังเพื่อให้อ่านง่าย
                button.style.color = lightness > 65 ? '#333' : '#fff';
            }
        });
    }

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
                    // item.Timestamp ควรจะเป็น ISO string จาก GAS
                    const itemTimestampForAttr = item.Timestamp || new Date().toISOString();

                    itemsHtml += `
                        <li class="list-group-item py-2">
                            <div class="d-flex w-100 justify-content-between align-items-center">
                                <div class="me-2">
                                    <h6 class="mb-1">${item.ItemName} <span class="badge bg-secondary">x ${item.Quantity}</span></h6>
                                    ${item.ItemNote ? `<small class="text-danger fst-italic d-block admin-item-note"><strong>โน้ต:</strong> ${item.ItemNote}</small>` : ''}
                                    </div>
                                <button class="btn btn-sm kitchen-action-btn"
                                        data-orderid="${item.OrderID}"
                                        data-itemid="${item.ItemID}"
                                        data-timestamp-for-item="${itemTimestampForAttr}"
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

            document.querySelectorAll('.kitchen-action-btn').forEach(btn => {
                btn.addEventListener('click', handleMarkAsServed);
            });
            updateElapsedTimesAndButtonColors(); // เรียกครั้งแรกเพื่อให้แสดงเวลาและสีทันที

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

        // หยุดการอัปเดตสีและเวลาสำหรับปุ่มนี้ทันที
        button.classList.add('item-served-button'); // เพิ่ม class เพื่อให้ updateElapsedTimesAndButtonColors ข้ามไป
        button.style.backgroundColor = ''; // ล้าง inline style หรือตั้งเป็นสีเขียวโดยตรง
        button.style.color = '';
        button.style.borderColor = '';


        const originalButtonText = button.innerHTML; // เก็บไว้เผื่อ error
        button.disabled = true;
        button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

        const result = await fetchData('updateOrderStatus', {
            orderId: orderId,
            itemId: itemId,
            newStatus: "Served"
        }, 'GET', null, false);

        if (result && result.success) {
            showUserMessage(result.message || `รายการ ${itemId} ถูกทำเครื่องหมายว่า "เสิร์ฟแล้ว"`, "success");
            button.classList.remove('btn-warning'); // ถ้าเคยมีสี warning
            button.classList.add('btn-success');    // เพิ่ม class สีเขียว
            button.innerHTML = '<i class="bi bi-check-circle-fill"></i> เสิร์ฟแล้ว';
            // ปุ่มยังคง disable อยู่

            // หลังจากอัปเดตสถานะสำเร็จ ให้โหลดข้อมูลครัวใหม่แบบ background
            // เพื่อให้รายการ/Ticket ที่เสร็จสมบูรณ์แล้วหายไปจากคิว
            setTimeout(() => {
                loadKitchenOrders(false);
            }, 700);

        } else {
            showUserMessage(`เกิดข้อผิดพลาดในการอัปเดตสถานะ: ${result ? result.message : "ไม่สามารถเชื่อมต่อได้"}`, "danger");
            button.disabled = false; // คืนค่าปุ่มถ้า error
            button.innerHTML = originalButtonText;
            button.classList.remove('item-served-button'); // เอา class ออกเพื่อให้ timer ทำงานต่อถ้า error
             // เรียก update อีกครั้งเพื่อให้สีกลับมาถูกต้องตามเวลา (ถ้า error)
            updateElapsedTimesAndButtonColors();
        }
    }

    if(refreshBtn) refreshBtn.addEventListener('click', () => loadKitchenOrders(true));

    // เริ่มการอัปเดตเวลาและสีทุกๆ วินาที
    if (elapsedTimeIntervalId) clearInterval(elapsedTimeIntervalId); // เคลียร์ interval เก่า (ถ้ามี)
    elapsedTimeIntervalId = setInterval(updateElapsedTimesAndButtonColors, 1000); // อัปเดตทุกวินาที

    loadKitchenOrders(true); // โหลดข้อมูลครัวครั้งแรก
    setInterval(() => { // Polling ข้อมูลออเดอร์ใหม่จาก Server
        loadKitchenOrders(false);
    }, 20000);
});
