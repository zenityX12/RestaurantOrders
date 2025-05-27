// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    const tableNumber = getUrlParameter('table'); // ดึงหมายเลขโต๊ะจาก URL

    // DOM Elements
    const tableNumberTitleEl = document.getElementById('table-number-title');
    const tableNumberNavEl = document.getElementById('table-number-nav');
    const currentOrderTableNumEl = document.getElementById('current-order-table-num');

    const menuContainer = document.getElementById('menu-items-container');
    const menuLoadingPlaceholder = document.getElementById('menu-loading-placeholder');
    const cartItemsDisplay = document.getElementById('cart-items-display');
    const cartTotalEl = document.getElementById('cart-total');
    const cartItemCountEl = document.getElementById('cart-item-count');
    const submitOrderBtn = document.getElementById('submit-order-btn');
    const currentOrderItemsDisplay = document.getElementById('current-order-items-display');
    const currentOrderTotalEl = document.getElementById('current-order-total');

    let menuData = []; // เก็บข้อมูลเมนูทั้งหมด
    let cart = [];     // เก็บรายการสินค้าในตะกร้า { itemId, name, price, quantity }
    const CART_STORAGE_KEY_PREFIX = 'restaurant_cart_table_';
    let cartStorageKey = '';

    if (!tableNumber) {
        showUserMessage("ไม่พบหมายเลขโต๊ะ! กรุณาสแกน QR Code ที่โต๊ะของท่านอีกครั้ง", "danger");
        if(menuLoadingPlaceholder) menuLoadingPlaceholder.textContent = "ข้อผิดพลาด: ไม่พบหมายเลขโต๊ะ";
        // อาจจะ redirect หรือแสดง UI ที่เหมาะสมกว่านี้
        return;
    }

    // ตั้งค่าหมายเลขโต๊ะใน UI
    if(tableNumberTitleEl) tableNumberTitleEl.textContent = tableNumber;
    if(tableNumberNavEl) tableNumberNavEl.textContent = tableNumber;
    if(currentOrderTableNumEl) currentOrderTableNumEl.textContent = tableNumber;
    cartStorageKey = `${CART_STORAGE_KEY_PREFIX}${tableNumber}`;


    // --- Cart Logic ---
    function loadCartFromStorage() {
        const storedCart = localStorage.getItem(cartStorageKey);
        if (storedCart) {
            cart = JSON.parse(storedCart);
        }
        renderCart();
    }

    function saveCartToStorage() {
        localStorage.setItem(cartStorageKey, JSON.stringify(cart));
    }

    function addToCart(itemId) {
        const menuItem = menuData.find(m => m.ItemID === itemId);
        if (!menuItem) {
            showUserMessage("ไม่พบรายการอาหารนี้", "warning");
            return;
        }

        const cartItem = cart.find(item => item.itemId === itemId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ itemId: menuItem.ItemID, name: menuItem.Name, price: parseFloat(menuItem.Price), quantity: 1 });
        }
        renderCart();
        saveCartToStorage();
        showUserMessage(`เพิ่ม '${menuItem.Name}' ลงในตะกร้าแล้ว`, "success");
    }

    function updateQuantity(itemId, change) {
        const cartItem = cart.find(item => item.itemId === itemId);
        if (cartItem) {
            cartItem.quantity += change;
            if (cartItem.quantity <= 0) {
                // ถ้าจำนวนเป็น 0 หรือน้อยกว่า ให้ลบออกจากตะกร้า
                cart = cart.filter(item => item.itemId !== itemId);
            }
            renderCart();
            saveCartToStorage();
        }
    }

    function removeFromCart(itemId) {
        const itemIndex = cart.findIndex(item => item.itemId === itemId);
        if (itemIndex > -1) {
            const itemName = cart[itemIndex].name;
            cart.splice(itemIndex, 1);
            renderCart();
            saveCartToStorage();
            showUserMessage(`ลบ '${itemName}' ออกจากตะกร้าแล้ว`, "info");
        }
    }

    function renderCart() {
        cartItemsDisplay.innerHTML = ''; // เคลียร์รายการเดิม
        let total = 0;
        let itemCount = 0;

        if (cart.length === 0) {
            cartItemsDisplay.innerHTML = '<p class="text-muted fst-italic">ตะกร้ายังว่างอยู่ ลองเลือกเมนูอร่อยๆสิ!</p>';
            submitOrderBtn.disabled = true;
        } else {
            const ul = document.createElement('ul');
            ul.className = 'list-group list-group-flush';
            cart.forEach(item => {
                const itemSubtotal = item.price * item.quantity;
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center py-2 px-0';
                li.innerHTML = `
                    <div class="flex-grow-1">
                        <small class="fw-bold">${item.name}</small>
                        <br>
                        <small class="text-muted">${item.price.toFixed(2)} x ${item.quantity} = ${itemSubtotal.toFixed(2)} บ.</small>
                    </div>
                    <div class="btn-group btn-group-sm" role="group">
                        <button class="btn btn-outline-secondary decrease-qty-btn" data-itemid="${item.itemId}"><i class="bi bi-dash-lg"></i></button>
                        <button class="btn btn-outline-secondary increase-qty-btn" data-itemid="${item.itemId}"><i class="bi bi-plus-lg"></i></button>
                        <button class="btn btn-outline-danger remove-item-btn ms-1" data-itemid="${item.itemId}"><i class="bi bi-trash3"></i></button>
                    </div>
                `;
                ul.appendChild(li);
                total += itemSubtotal;
                itemCount += item.quantity;
            });
            cartItemsDisplay.appendChild(ul);
            submitOrderBtn.disabled = false;

            // Add event listeners to new buttons
            ul.querySelectorAll('.decrease-qty-btn').forEach(btn => btn.addEventListener('click', e => updateQuantity(e.currentTarget.dataset.itemid, -1)));
            ul.querySelectorAll('.increase-qty-btn').forEach(btn => btn.addEventListener('click', e => updateQuantity(e.currentTarget.dataset.itemid, 1)));
            ul.querySelectorAll('.remove-item-btn').forEach(btn => btn.addEventListener('click', e => removeFromCart(e.currentTarget.dataset.itemid)));
        }
        cartTotalEl.textContent = total.toFixed(2);
        cartItemCountEl.textContent = itemCount;
    }

    // --- Menu Logic ---
    async function loadMenu() {
        if(menuLoadingPlaceholder) menuLoadingPlaceholder.style.display = 'block';
        menuContainer.innerHTML = ''; // Clear previous items if any

        const menu = await fetchData('getMenu');
        if(menuLoadingPlaceholder) menuLoadingPlaceholder.style.display = 'none';

        if (menu && Array.isArray(menu) && menu.length > 0) {
            menuData = menu;
            renderMenu();
        } else if (menu && menu.error) {
            showUserMessage(`ไม่สามารถโหลดเมนูได้: ${menu.error}`, "danger");
            menuContainer.innerHTML = '<p class="text-danger text-center">ขออภัย, ไม่สามารถโหลดรายการอาหารได้ในขณะนี้</p>';
        } else {
            showUserMessage("ไม่สามารถโหลดเมนูได้ หรือไม่มีรายการอาหาร", "warning");
            menuContainer.innerHTML = '<p class="text-muted text-center">ขออภัย, ไม่มีรายการอาหารในขณะนี้</p>';
        }
    }

    function renderMenu() {
        menuContainer.innerHTML = ''; // Clear placeholder or old items
        if (menuData.length === 0) {
             menuContainer.innerHTML = '<p class="text-muted text-center">ขออภัย, ไม่มีรายการอาหารในขณะนี้</p>';
            return;
        }
        menuData.forEach(item => {
            const cardHtml = `
                <div class="col">
                    <div class="card h-100 menu-card shadow-sm">
                        <img src="${item.ImageURL || 'assets/images/food_placeholder.png'}" class="card-img-top" alt="${item.Name}" onerror="this.onerror=null;this.src='assets/images/food_placeholder.png';">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${item.Name}</h5>
                            <p class="card-text small text-muted flex-grow-1">${item.Description || ''}</p>
                            <p class="card-text price mb-0">${parseFloat(item.Price).toFixed(2)} บาท</p>
                        </div>
                        <div class="card-footer bg-transparent border-top-0 pb-3 pt-0">
                             <button class="btn btn-secondary w-100 add-to-cart-btn" data-itemid="${item.ItemID}">
                                <i class="bi bi-cart-plus-fill btn-icon"></i>เพิ่มลงตะกร้า
                             </button>
                        </div>
                    </div>
                </div>
            `;
            menuContainer.insertAdjacentHTML('beforeend', cardHtml);
        });
        // Add event listeners to "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => addToCart(e.currentTarget.dataset.itemid));
        });
    }

    // --- Order Submission Logic ---
    submitOrderBtn.addEventListener('click', async () => {
        if (cart.length === 0) {
            showUserMessage("กรุณาเลือกรายการอาหารก่อนทำการสั่งซื้อ", "warning");
            return;
        }

        // เพิ่มการยืนยันก่อนส่ง
        if (!confirm("คุณต้องการยืนยันการสั่งซื้อรายการเหล่านี้ใช่หรือไม่?")) {
            return;
        }

        submitOrderBtn.disabled = true;
        const originalButtonText = submitOrderBtn.innerHTML;
        submitOrderBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> กำลังส่ง...`;

        const orderPayload = {
            // action: "submitOrder", // action จะถูกเพิ่มใน fetchData สำหรับ POST
            tableNumber: tableNumber,
            items: cart.map(item => ({ itemId: item.itemId, quantity: item.quantity }))
            // orderId สามารถสร้างจากฝั่ง server (GAS) หรือ client ก็ได้
            // ถ้าสร้างจาก client: orderId: `T${tableNumber}-${new Date().getTime()}`
        };

        const result = await fetchData("submitOrder", {}, 'POST', orderPayload);

        submitOrderBtn.disabled = false;
        submitOrderBtn.innerHTML = originalButtonText;

        if (result && result.success) {
            showUserMessage(`สั่งอาหารสำเร็จ! ${result.message || ''}`, "success");
            cart = []; // เคลียร์ตะกร้า
            saveCartToStorage();
            renderCart();
            loadCurrentTableOrders(); // โหลดรายการที่สั่งไปแล้วใหม่
        } else {
            showUserMessage("เกิดข้อผิดพลาดในการสั่งอาหาร: " + (result ? result.message : "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้"), "danger");
        }
    });

    // --- Current Order Display Logic ---
    async function loadCurrentTableOrders() {
        const orders = await fetchData('getOrdersByTable', { table: tableNumber });
        currentOrderItemsDisplay.innerHTML = ''; // เคลียร์รายการเดิม
        let currentTotal = 0;

        if (orders && Array.isArray(orders) && orders.length > 0) {
            const ul = document.createElement('ul');
            ul.className = 'list-group list-group-flush';
            orders.forEach(item => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center px-0';
                li.innerHTML = `
                    <span>${item.ItemName} x ${item.Quantity}
                        <br><small class="text-muted">(สถานะ: ${item.Status})</small>
                    </span>
                    <span class="badge bg-light text-dark">${parseFloat(item.Subtotal).toFixed(2)} บ.</span>
                `;
                ul.appendChild(li);
                // คำนวณยอดรวมเฉพาะรายการที่ยังไม่ถูก "Served" หรือตาม logic ที่ต้องการ
                // ในที่นี้รวมทุกรายการที่ดึงมาได้ (ยังไม่ Billed/Paid)
                currentTotal += parseFloat(item.Subtotal);
            });
            currentOrderItemsDisplay.appendChild(ul);
        } else if (orders && orders.error) {
             currentOrderItemsDisplay.innerHTML = `<p class="text-danger">เกิดข้อผิดพลาด: ${orders.error}</p>`;
        }
        else {
            currentOrderItemsDisplay.innerHTML = '<p class="text-muted fst-italic">ยังไม่มีรายการที่สั่งสำหรับโต๊ะนี้ หรือรายการทั้งหมดถูกเช็คบิล/เสิร์ฟแล้ว</p>';
        }
        currentOrderTotalEl.textContent = currentTotal.toFixed(2);
    }

    // --- Initial Load and Polling ---
    loadMenu();
    loadCartFromStorage();
    loadCurrentTableOrders();

    // ตั้งค่าการโหลดข้อมูลรายการที่สั่งไปแล้วใหม่ทุกๆ 30 วินาที
    setInterval(loadCurrentTableOrders, 30000); // 30 seconds
});
