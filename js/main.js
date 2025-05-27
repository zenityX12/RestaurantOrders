// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    const tableNumber = getUrlParameter('table');

    // DOM Elements for Table Number
    const tableNumberTitleEl = document.getElementById('table-number-title');
    const tableNumberNavEl = document.getElementById('table-number-nav');
    const currentOrderTableNumEl = document.getElementById('current-order-table-num');

    // DOM Elements for Menu & Cart
    const menuContainer = document.getElementById('menu-items-container');
    const menuLoadingPlaceholder = document.getElementById('menu-loading-placeholder');
    const categoryNavPillsContainer = document.getElementById('category-nav-pills');

    const cartItemsDisplay = document.getElementById('cart-items-display');
    const cartTotalSummaryEl = document.getElementById('cart-total-summary');
    const cartItemCountSummaryEl = document.getElementById('cart-item-count-summary');
    const submitOrderBtn = document.getElementById('submit-order-btn');

    // DOM Elements for Navbar Cart Info
    const navCartCountEl = document.getElementById('nav-cart-count');
    const navCartTotalEl = document.getElementById('nav-cart-total');
    const fabCartCountEl = document.getElementById('fab-cart-count'); // FAB cart count

    // DOM Elements for Current Order
    const currentOrderItemsDisplay = document.getElementById('current-order-items-display');
    const currentOrderTotalEl = document.getElementById('current-order-total');

    // DOM Elements for Scroll Button
    const scrollToCartFab = document.getElementById('scroll-to-cart-fab');
    const cartAndOrderSummarySection = document.getElementById('cart-and-order-summary-section');


    let menuData = [];
    let cart = [];
    const CART_STORAGE_KEY_PREFIX = 'restaurant_cart_table_';
    let cartStorageKey = '';
    let categories = []; // To store unique categories

    if (!tableNumber) {
        showUserMessage("ไม่พบหมายเลขโต๊ะ! กรุณาสแกน QR Code ที่โต๊ะของท่านอีกครั้ง", "danger");
        if(menuLoadingPlaceholder) menuLoadingPlaceholder.textContent = "ข้อผิดพลาด: ไม่พบหมายเลขโต๊ะ";
        return;
    }

    if(tableNumberTitleEl) tableNumberTitleEl.textContent = tableNumber;
    if(tableNumberNavEl) tableNumberNavEl.textContent = tableNumber;
    if(currentOrderTableNumEl) currentOrderTableNumEl.textContent = tableNumber;
    cartStorageKey = `${CART_STORAGE_KEY_PREFIX}${tableNumber}`;

    // --- Cart Logic (เหมือนเดิม เพิ่มเติมคืออัปเดต Navbar และ FAB) ---
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
        cartItemsDisplay.innerHTML = '';
        let total = 0;
        let itemCount = 0;

        if (cart.length === 0) {
            cartItemsDisplay.innerHTML = '<p class="text-muted fst-italic">ตะกร้ายังว่างอยู่</p>';
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

            ul.querySelectorAll('.decrease-qty-btn').forEach(btn => btn.addEventListener('click', e => updateQuantity(e.currentTarget.dataset.itemid, -1)));
            ul.querySelectorAll('.increase-qty-btn').forEach(btn => btn.addEventListener('click', e => updateQuantity(e.currentTarget.dataset.itemid, 1)));
            ul.querySelectorAll('.remove-item-btn').forEach(btn => btn.addEventListener('click', e => removeFromCart(e.currentTarget.dataset.itemid)));
        }
        cartTotalSummaryEl.textContent = total.toFixed(2);
        cartItemCountSummaryEl.textContent = itemCount;

        // Update Navbar cart info & FAB
        if(navCartCountEl) navCartCountEl.textContent = itemCount;
        if(navCartTotalEl) navCartTotalEl.textContent = total.toFixed(2);
        if(fabCartCountEl) {
            fabCartCountEl.textContent = itemCount;
            fabCartCountEl.style.display = itemCount > 0 ? 'inline-block' : 'none';
        }

    }

    // --- Menu Logic (ปรับปรุงให้แสดงตามหมวดหมู่ และไม่มีรูปภาพ) ---
    async function loadMenu() {
        if(menuLoadingPlaceholder) menuLoadingPlaceholder.style.display = 'block';
        menuContainer.innerHTML = '';
        if(categoryNavPillsContainer) categoryNavPillsContainer.innerHTML = '';


        const menu = await fetchData('getMenu');
        if(menuLoadingPlaceholder) menuLoadingPlaceholder.style.display = 'none';

        if (menu && Array.isArray(menu) && menu.length > 0) {
            menuData = menu;
            // ดึงหมวดหมู่ที่ไม่ซ้ำกัน
            const uniqueCategories = [...new Set(menuData.map(item => item.Category || "เมนูทั่วไป"))];
            categories = uniqueCategories.sort(); // เรียงตามตัวอักษร
            renderCategoryPills();
            renderMenu(); // Render all initially or first category
        } else if (menu && menu.error) {
            showUserMessage(`ไม่สามารถโหลดเมนูได้: ${menu.error}`, "danger");
            menuContainer.innerHTML = '<p class="text-danger text-center col-12">ขออภัย, ไม่สามารถโหลดรายการอาหารได้</p>';
        } else {
            showUserMessage("ไม่สามารถโหลดเมนูได้ หรือไม่มีรายการอาหาร", "warning");
            menuContainer.innerHTML = '<p class="text-muted text-center col-12">ขออภัย, ไม่มีรายการอาหาร</p>';
        }
    }

    function renderCategoryPills() {
        if (!categoryNavPillsContainer || categories.length === 0) return;

        // Add "All" pill
        const allPillItem = document.createElement('li');
        allPillItem.className = 'nav-item';
        allPillItem.innerHTML = `<button class="nav-link active category-pill-btn" data-category="all">ทั้งหมด</button>`;
        categoryNavPillsContainer.appendChild(allPillItem);


        categories.forEach(category => {
            const pillItem = document.createElement('li');
            pillItem.className = 'nav-item';
            pillItem.innerHTML = `<button class="nav-link category-pill-btn" data-category="${category}">${category}</button>`;
            categoryNavPillsContainer.appendChild(pillItem);
        });

        categoryNavPillsContainer.querySelectorAll('.category-pill-btn').forEach(pill => {
            pill.addEventListener('click', (e) => {
                categoryNavPillsContainer.querySelectorAll('.category-pill-btn').forEach(p => p.classList.remove('active'));
                e.currentTarget.classList.add('active');
                renderMenu(e.currentTarget.dataset.category);
            });
        });
    }


    function renderMenu(selectedCategory = "all") {
        menuContainer.innerHTML = ''; // Clear placeholder or old items

        const itemsToRender = selectedCategory === "all"
            ? menuData
            : menuData.filter(item => (item.Category || "เมนูทั่วไป") === selectedCategory);

        if (itemsToRender.length === 0 && selectedCategory !== "all") {
             menuContainer.innerHTML = `<p class="text-muted text-center col-12">ไม่มีรายการอาหารในหมวดหมู่ "${selectedCategory}"</p>`;
            return;
        }
         if (itemsToRender.length === 0 && selectedCategory === "all") {
             menuContainer.innerHTML = `<p class="text-muted text-center col-12">ขออภัย, ไม่มีรายการอาหารในขณะนี้</p>`;
            return;
        }


        let currentCategory = "";
        itemsToRender.sort((a, b) => { // Sort by category first, then by name
            if ((a.Category || "เมนูทั่วไป") < (b.Category || "เมนูทั่วไป")) return -1;
            if ((a.Category || "เมนูทั่วไป") > (b.Category || "เมนูทั่วไป")) return 1;
            if (a.Name < b.Name) return -1;
            if (a.Name > b.Name) return 1;
            return 0;
        }).forEach(item => {
            const itemCategory = item.Category || "เมนูทั่วไป";

            // แสดง Header ของหมวดหมู่เมื่อมีการเปลี่ยนหมวดหมู่ (ถ้าไม่ได้ใช้ Pills filter หรือใช้ร่วมกัน)
            if (selectedCategory === "all" && itemCategory !== currentCategory) {
                currentCategory = itemCategory;
                const categoryHeader = document.createElement('h4');
                categoryHeader.className = 'category-header col-12'; // ใช้ class style ที่เพิ่มใน HTML
                categoryHeader.textContent = currentCategory;
                categoryHeader.id = `category-${currentCategory.replace(/\s+/g, '-')}`; // ID สำหรับการนำทาง
                menuContainer.appendChild(categoryHeader);
            }

            const cardHtml = `
                <div class="col">
                    <div class="card h-100 menu-card-no-image shadow-sm">
                        <div class="card-body d-flex flex-column">
                            <div class="d-flex justify-content-between align-items-start">
                                <h5 class="card-title mb-1">${item.Name}</h5>
                                <p class="card-text price ms-2 mb-1">${parseFloat(item.Price).toFixed(2)} บ.</p>
                            </div>
                            ${item.Description ? `<p class="card-text small text-muted flex-grow-1 mb-2">${item.Description}</p>` : '<div class="flex-grow-1"></div>'}
                            <button class="btn btn-secondary w-100 add-to-cart-btn mt-auto">
                                <i class="bi bi-cart-plus-fill btn-icon"></i>เพิ่มลงตะกร้า
                            </button>
                        </div>
                        <input type="hidden" class="add-to-cart-itemid" value="${item.ItemID}">
                    </div>
                </div>
            `;
            // menuContainer.insertAdjacentHTML('beforeend', cardHtml); // ใช้แบบนี้ก็ได้
            const tempDiv = document.createElement('div'); // สร้าง element ชั่วคราว
            tempDiv.innerHTML = cardHtml.trim(); // .trim() เพื่อลบ whitespace
            const cardElement = tempDiv.firstChild;
            // ผูก event listener กับปุ่มใน card ที่เพิ่งสร้าง
            cardElement.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
                const itemId = e.currentTarget.closest('.card').querySelector('.add-to-cart-itemid').value;
                addToCart(itemId);
            });
            menuContainer.appendChild(cardElement);
        });
    }


    // --- Order Submission Logic (เหมือนเดิม) ---
    submitOrderBtn.addEventListener('click', async () => {
        if (cart.length === 0) {
            showUserMessage("กรุณาเลือกรายการอาหารก่อนทำการสั่งซื้อ", "warning");
            return;
        }
        if (!confirm("คุณต้องการยืนยันการสั่งซื้อรายการเหล่านี้ใช่หรือไม่?")) {
            return;
        }
        submitOrderBtn.disabled = true;
        const originalButtonText = submitOrderBtn.innerHTML;
        submitOrderBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> กำลังส่ง...`;
        const orderPayload = {
            tableNumber: tableNumber,
            items: cart.map(item => ({ itemId: item.itemId, quantity: item.quantity }))
        };
        const result = await fetchData("submitOrder", {}, 'POST', orderPayload);
        submitOrderBtn.disabled = false;
        submitOrderBtn.innerHTML = originalButtonText;
        if (result && result.success) {
            showUserMessage(`สั่งอาหารสำเร็จ! ${result.message || ''}`, "success");
            cart = [];
            saveCartToStorage();
            renderCart();
            loadCurrentTableOrders();
        } else {
            showUserMessage("เกิดข้อผิดพลาดในการสั่งอาหาร: " + (result ? result.message : "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้"), "danger");
        }
    });

    // --- Current Order Display Logic (เหมือนเดิม) ---
    async function loadCurrentTableOrders() {
        const orders = await fetchData('getOrdersByTable', { table: tableNumber });
        currentOrderItemsDisplay.innerHTML = '';
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
                currentTotal += parseFloat(item.Subtotal);
            });
            currentOrderItemsDisplay.appendChild(ul);
        } else if (orders && orders.error) {
             currentOrderItemsDisplay.innerHTML = `<p class="text-danger">เกิดข้อผิดพลาด: ${orders.error}</p>`;
        } else {
            currentOrderItemsDisplay.innerHTML = '<p class="text-muted fst-italic">ยังไม่มีรายการที่สั่งสำหรับโต๊ะนี้</p>';
        }
        currentOrderTotalEl.textContent = currentTotal.toFixed(2);
    }

    // --- Scroll to Cart Button Logic ---
    if (scrollToCartFab && cartAndOrderSummarySection) {
        scrollToCartFab.addEventListener('click', () => {
            cartAndOrderSummarySection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- Initial Load and Polling ---
    loadMenu();
    loadCartFromStorage(); // ต้องเรียกหลังจาก menuData โหลดเสร็จถ้า cart item name/price มาจาก menuData
                          // หรือ เก็บ name/price ใน cart object ตอน addToCart เลย (ซึ่งทำอยู่แล้ว)
    loadCurrentTableOrders();
    setInterval(loadCurrentTableOrders, 30000); // 30 seconds
});
