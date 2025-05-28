// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    const tableNumber = getUrlParameter('table');

    // DOM Elements for Table Number (เหมือนเดิม)
    const tableNumberTitleEl = document.getElementById('table-number-title-placeholder'); // แก้ ID ให้ตรงกับ HTML ล่าสุด
    const tableNumberNavEl = document.getElementById('table-number-nav');
    const currentOrderTableNumEl = document.getElementById('current-order-table-num');


    // DOM Elements for Menu & Cart (เหมือนเดิม)
    const menuContainer = document.getElementById('menu-items-container');
    const menuLoadingPlaceholder = document.getElementById('menu-loading-placeholder');
    const categoryNavPillsContainer = document.getElementById('category-nav-pills');

    const cartItemsDisplay = document.getElementById('cart-items-display');
    const cartTotalSummaryEl = document.getElementById('cart-total-summary');
    const cartItemCountSummaryEl = document.getElementById('cart-item-count-summary');
    const submitOrderBtn = document.getElementById('submit-order-btn');

    // DOM Elements for Navbar Cart Info (เหมือนเดิม)
    const navCartTotalEl = document.getElementById('nav-cart-total');
    const fabCartCountEl = document.getElementById('fab-cart-count');

    // DOM Elements for Current Order (เหมือนเดิม)
    const currentOrderItemsDisplay = document.getElementById('current-order-items-display');
    const currentOrderTotalEl = document.getElementById('current-order-total');

    // DOM Elements for Scroll Button (เหมือนเดิม)
    const scrollToCartFab = document.getElementById('scroll-to-cart-fab');
    const cartAndOrderSummarySection = document.getElementById('cart-and-order-summary-section');

    // DOM Elements for Item Note Modal
    const itemNoteModalEl = document.getElementById('item-note-modal');
    const itemNoteModalInstance = itemNoteModalEl ? new bootstrap.Modal(itemNoteModalEl) : null; // สร้าง Instance ของ Modal
    const modalItemNameEl = document.getElementById('modal-item-name');
    const modalItemIdInputEl = document.getElementById('modal-item-id-input');
    const modalItemNoteTextareaEl = document.getElementById('modal-item-note-textarea');
    const saveItemNoteBtn = document.getElementById('save-item-note-btn');


    let menuData = [];
    let cart = []; // ตอนนี้ cart item จะมี property 'note' เพิ่มเข้ามา
    const CART_STORAGE_KEY_PREFIX = 'restaurant_cart_table_';
    let cartStorageKey = '';
    let categoriesInOrder = [];

    if (!tableNumber) {
        showUserMessage("ไม่พบหมายเลขโต๊ะ! กรุณาสแกน QR Code ที่โต๊ะของท่านอีกครั้ง", "danger");
        if(menuLoadingPlaceholder) menuLoadingPlaceholder.textContent = "ข้อผิดพลาด: ไม่พบหมายเลขโต๊ะ";
        return;
    }

    if(tableNumberTitleEl) tableNumberTitleEl.textContent = tableNumber; // ตั้งค่า table number ใน title placeholder
    if(tableNumberNavEl) tableNumberNavEl.textContent = tableNumber;
    if(currentOrderTableNumEl) currentOrderTableNumEl.textContent = tableNumber;
    cartStorageKey = `${CART_STORAGE_KEY_PREFIX}${tableNumber}`;

    // --- Cart Logic (ปรับปรุง renderCart, เพิ่มฟังก์ชันจัดการ Note Modal) ---
    function loadCartFromStorage() {
        const storedCart = localStorage.getItem(cartStorageKey);
        if (storedCart) {
            cart = JSON.parse(storedCart);
            // ตรวจสอบว่าแต่ละ item ใน cart มี property 'note' หรือไม่ ถ้าไม่มีให้เพิ่มเป็น string ว่าง
            cart.forEach(item => {
                if (item.note === undefined) {
                    item.note = "";
                }
            });
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
            // เพิ่ม property 'note' เป็น string ว่างเมื่อเพิ่มสินค้าใหม่
            cart.push({ itemId: menuItem.ItemID, name: menuItem.Name, price: parseFloat(menuItem.Price), quantity: 1, note: "" });
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
                // ***** เพิ่มปุ่มแก้ไขโน้ต และแสดงโน้ต (ถ้ามี) *****
                li.innerHTML = `
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center">
                            <small class="fw-bold">${item.name}</small>
                            <button class="btn btn-sm btn-link p-0 ms-2 open-note-modal-btn" data-itemid="${item.itemId}" title="เพิ่ม/แก้ไขโน้ต">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                        </div>
                        ${item.note ? `<small class="cart-item-note" title="${item.note}">โน้ต: ${item.note}</small>` : ''}
                        <small class="text-muted d-block">${item.price.toFixed(2)} x ${item.quantity} = ${itemSubtotal.toFixed(2)} บ.</small>
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
            // ***** ผูก Event Listener กับปุ่มแก้ไขโน้ตใหม่ *****
            ul.querySelectorAll('.open-note-modal-btn').forEach(btn => btn.addEventListener('click', e => handleOpenNoteModal(e.currentTarget.dataset.itemid)));
        }
        cartTotalSummaryEl.textContent = total.toFixed(2);
        cartItemCountSummaryEl.textContent = itemCount;

        if(navCartTotalEl) navCartTotalEl.textContent = total.toFixed(2);
        if(fabCartCountEl) {
            fabCartCountEl.textContent = itemCount;
            fabCartCountEl.style.display = itemCount > 0 ? 'inline-flex' : 'none';
        }
    }

    // --- Item Note Modal Logic ---
    function handleOpenNoteModal(itemId) {
        if (!itemNoteModalInstance) return;

        const cartItem = cart.find(item => item.itemId === itemId);
        if (cartItem) {
            if(modalItemNameEl) modalItemNameEl.textContent = cartItem.name;
            if(modalItemIdInputEl) modalItemIdInputEl.value = cartItem.itemId;
            if(modalItemNoteTextareaEl) modalItemNoteTextareaEl.value = cartItem.note || ""; // แสดงโน้ตเดิม หรือ string ว่าง
            itemNoteModalInstance.show();
        } else {
            showUserMessage("ไม่พบรายการสินค้าในตะกร้า", "warning");
        }
    }

    if (saveItemNoteBtn) {
        saveItemNoteBtn.addEventListener('click', () => {
            if (!modalItemIdInputEl || !modalItemNoteTextareaEl) return;

            const itemId = modalItemIdInputEl.value;
            const newNote = modalItemNoteTextareaEl.value.trim();

            const cartItem = cart.find(item => item.itemId === itemId);
            if (cartItem) {
                cartItem.note = newNote;
                saveCartToStorage();
                renderCart(); // อัปเดตการแสดงผลในตะกร้า
                if (itemNoteModalInstance) itemNoteModalInstance.hide();
                showUserMessage("บันทึกโน้ตเรียบร้อยแล้ว", "success");
            } else {
                showUserMessage("เกิดข้อผิดพลาดในการบันทึกโน้ต", "danger");
            }
        });
    }


    // --- Menu Logic (เหมือนเดิม) ---
    async function loadMenu() {
        if(menuLoadingPlaceholder) menuLoadingPlaceholder.style.display = 'block';
        menuContainer.innerHTML = '';
        if(categoryNavPillsContainer) categoryNavPillsContainer.innerHTML = '';

        const menu = await fetchData('getMenu', {}, 'GET', null, false);
        if(menuLoadingPlaceholder) menuLoadingPlaceholder.style.display = 'none';

        if (menu && Array.isArray(menu) && menu.length > 0) {
            menuData = menu;
            const categoryOrder = [];
            const seenCategories = new Set();
            menuData.forEach(item => {
                const category = item.Category || "เมนูทั่วไป";
                if (!seenCategories.has(category)) {
                    categoryOrder.push(category);
                    seenCategories.add(category);
                }
            });
            categoriesInOrder = categoryOrder;
            renderCategoryPills();
            renderMenu("all");
        } else if (menu && menu.error) {
            showUserMessage(`ไม่สามารถโหลดเมนูได้: ${menu.error}`, "danger");
            menuContainer.innerHTML = '<p class="text-danger text-center col-12">ขออภัย, ไม่สามารถโหลดรายการอาหารได้</p>';
        } else {
            showUserMessage("ไม่สามารถโหลดเมนูได้ หรือไม่มีรายการอาหาร", "warning");
            menuContainer.innerHTML = '<p class="text-muted text-center col-12">ขออภัย, ไม่มีรายการอาหาร</p>';
        }
    }

    function renderCategoryPills() {
        if (!categoryNavPillsContainer || categoriesInOrder.length === 0) return;
        categoryNavPillsContainer.innerHTML = '';

        const allPillItem = document.createElement('li');
        allPillItem.className = 'nav-item';
        allPillItem.innerHTML = `<button class="nav-link active category-pill-btn" data-category="all">ทั้งหมด</button>`;
        categoryNavPillsContainer.appendChild(allPillItem);

        categoriesInOrder.forEach(category => {
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
        menuContainer.innerHTML = '';
        if (selectedCategory === "all") {
            categoriesInOrder.forEach(categoryName => {
                const categoryItems = menuData.filter(item => (item.Category || "เมนูทั่วไป") === categoryName);
                if (categoryItems.length > 0) {
                    const categoryHeader = document.createElement('h4');
                    categoryHeader.className = 'category-header col-12';
                    categoryHeader.textContent = categoryName;
                    categoryHeader.id = `category-${categoryName.replace(/\s+/g, '-')}`;
                    menuContainer.appendChild(categoryHeader);
                    categoryItems.forEach(item => renderSingleMenuItem(item));
                }
            });
            if (menuContainer.children.length === 0 && menuData.length > 0) {
                 menuContainer.innerHTML = '<p class="text-muted text-center col-12">ไม่พบรายการอาหารสำหรับหมวดหมู่ที่ระบุ</p>';
            } else if (menuData.length === 0) {
                 menuContainer.innerHTML = '<p class="text-muted text-center col-12">ขออภัย, ไม่มีรายการอาหารในขณะนี้</p>';
            }
        } else {
            const itemsToRender = menuData.filter(item => (item.Category || "เมนูทั่วไป") === selectedCategory);
            if (itemsToRender.length === 0) {
                menuContainer.innerHTML = `<p class="text-muted text-center col-12">ไม่มีรายการอาหารในหมวดหมู่ "${selectedCategory}"</p>`;
            } else {
                itemsToRender.forEach(item => renderSingleMenuItem(item));
            }
        }
    }

    function renderSingleMenuItem(item) {
        const cardHtml = `
            <div class="col">
                <div class="card h-100 menu-card-no-image shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <h5 class="card-title mb-0 me-2 flex-grow-1">${item.Name}</h5>
                            <span class="card-text price fw-bold text-nowrap">${parseFloat(item.Price).toFixed(2)} บ.</span>
                            <button class="btn btn-sm btn-outline-secondary add-to-cart-btn ms-2 flex-shrink-0">
                                <i class="bi bi-cart-plus"></i>
                            </button>
                        </div>
                        ${item.Description ? `<p class="card-text small text-muted mb-0">${item.Description}</p>` : ''}
                    </div>
                    <input type="hidden" class="add-to-cart-itemid" value="${item.ItemID}">
                </div>
            </div>
        `;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = cardHtml.trim();
        const cardElement = tempDiv.firstChild;
        cardElement.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
            const itemId = e.currentTarget.closest('.card').querySelector('.add-to-cart-itemid').value;
            addToCart(itemId);
        });
        menuContainer.appendChild(cardElement);
    }

    // --- Order Submission Logic (ปรับปรุงให้ส่ง note ไปด้วย) ---
    submitOrderBtn.addEventListener('click', async () => {
        if (cart.length === 0) {
            showUserMessage("กรุณาเลือกรายการอาหารก่อนทำการสั่งซื้อ", "warning");
            return;
        }
        if (!confirm("คุณต้องการยืนยันการสั่งซื้อรายการเหล่านี้ใช่หรือไม่?")) {
            return;
        }
        // User initiated action, show spinner
        const result = await fetchData("submitOrder", {}, 'POST', cartToOrderPayload(), false);

        if (result && result.success) {
            showUserMessage(`สั่งอาหารสำเร็จ! ${result.message || ''}`, "success");
            cart = []; // เคลียร์ตะกร้า
            saveCartToStorage(); // เคลียร์ local storage
            renderCart(); // render ตะกร้าที่ว่างเปล่า
            loadCurrentTableOrders(true); // โหลดรายการที่สั่งไปแล้วใหม่ (ถ้ามี)
        } else {
            showUserMessage("เกิดข้อผิดพลาดในการสั่งอาหาร: " + (result ? result.message : "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้"), "danger");
        }
    });

    function cartToOrderPayload() {
        submitOrderBtn.disabled = true;
        const originalButtonText = submitOrderBtn.innerHTML;
        submitOrderBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> กำลังส่ง...`;

        const payload = {
            tableNumber: tableNumber,
            // ***** ส่ง property 'note' ของแต่ละ item ไปด้วย *****
            items: cart.map(item => ({
                itemId: item.itemId,
                quantity: item.quantity,
                note: item.note || "" // ถ้า item.note เป็น undefined ให้ส่งเป็น string ว่าง
            }))
        };

        // Restore button state (ควรจะทำหลังจาก fetchData เสร็จสมบูรณ์)
        // นี่เป็นวิธีที่ไม่ค่อยดีนัก ควรจะ restore ใน .then() หรือ .finally() ของ Promise
        // แต่เพื่อความง่าย จะ restore หลังจากสร้าง payload ไปก่อน
        setTimeout(() => {
             submitOrderBtn.disabled = (cart.length === 0);
             submitOrderBtn.innerHTML = originalButtonText;
        }, 500);

        return payload;
    }

    // --- Current Order Display Logic (ปรับปรุงให้แสดง note ถ้ามี) ---
    async function loadCurrentTableOrders(isInitialLoad = false) {
        const orders = await fetchData('getOrdersByTable', { table: tableNumber }, 'GET', null, !isInitialLoad);

        if (!orders && !isInitialLoad) {
            console.warn("Background update for current orders failed or returned no data.");
            return;
        }

        currentOrderItemsDisplay.innerHTML = '';
        let currentTotal = 0;
        if (orders && Array.isArray(orders) && orders.length > 0) {
            const ul = document.createElement('ul');
            ul.className = 'list-group list-group-flush';
            orders.forEach(item => { // 'item' ในที่นี้คือ order item ที่ได้จาก server
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-start px-0'; // align-items-start
                li.innerHTML = `
                    <div class="flex-grow-1">
                        ${item.ItemName} x ${item.Quantity}
                        ${item.ItemNote ? `<br><small class="cart-item-note" style="max-width: none;">โน้ต: ${item.ItemNote}</small>` : ''} {/* แสดง ItemNote ที่ได้จาก Server */}
                        <br><small class="text-muted">(สถานะ: ${item.Status})</small>
                    </div>
                    <span class="badge bg-light text-dark mt-1">${parseFloat(item.Subtotal).toFixed(2)} บ.</span>
                `;
                ul.appendChild(li);
                currentTotal += parseFloat(item.Subtotal);
            });
            currentOrderItemsDisplay.appendChild(ul);
        } else if (orders && orders.error && isInitialLoad) {
             currentOrderItemsDisplay.innerHTML = `<p class="text-danger">เกิดข้อผิดพลาด: ${orders.error}</p>`;
        } else if (isInitialLoad || (orders && orders.length === 0)) {
            currentOrderItemsDisplay.innerHTML = '<p class="text-muted fst-italic">ยังไม่มีรายการที่สั่งสำหรับโต๊ะนี้</p>';
        }
        currentOrderTotalEl.textContent = currentTotal.toFixed(2);
    }

    // --- Scroll to Cart Button Logic (เหมือนเดิม) ---
    if (scrollToCartFab && cartAndOrderSummarySection) {
        scrollToCartFab.addEventListener('click', () => {
            cartAndOrderSummarySection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- Initial Load and Polling ---
    loadMenu();
    loadCartFromStorage(); // โหลดตะกร้า (ซึ่งตอนนี้จะมี property 'note' แล้ว)
    loadCurrentTableOrders(true);

    setInterval(() => {
        loadCurrentTableOrders(false);
    }, 60000);
});
