// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    const tableNumber = getUrlParameter('table');

    // DOM Elements for Table Number
    const tableNumberTitleEl = document.getElementById('table-number-title-placeholder');
    const tableNumberNavEl = document.getElementById('table-number-nav');
    const currentOrderTableNumEl = document.getElementById('current-order-table-num');

    // DOM Elements for Menu & Cart
    const menuContainer = document.getElementById('menu-items-container');
    const menuLoadingPlaceholder = document.getElementById('menu-loading-placeholder');
    const categoryNavPillsContainer = document.getElementById('category-nav-pills');

    const cartItemsDisplay = document.getElementById('cart-items-display');
    const cartTotalSummaryEl = document.getElementById('cart-total-summary');
    const cartItemCountSummaryEl = document.getElementById('cart-item-count-summary');
    // const submitOrderBtn = document.getElementById('submit-order-btn'); // ปุ่มเดิม ถูกแทนที่ด้วยปุ่มเปิด Modal
    const openConfirmOrderModalBtn = document.getElementById('open-confirm-order-modal-btn'); // ปุ่มใหม่สำหรับเปิด Modal
    const clearCartBtn = document.getElementById('clear-cart-btn');


    // DOM Elements for Navbar Cart Info
    const navCartTotalEl = document.getElementById('nav-cart-total');
    const fabCartCountEl = document.getElementById('fab-cart-count');
    const fabCartButton = document.getElementById('scroll-to-cart-fab');
    const navbarCartIconContainer = document.getElementById('navbar-cart-icon-container');


    // DOM Elements for Current Order
    const currentOrderItemsDisplay = document.getElementById('current-order-items-display');
    const currentOrderTotalEl = document.getElementById('current-order-total');

    // DOM Elements for Scroll Button
    const scrollToCartFab = document.getElementById('scroll-to-cart-fab');
    const cartAndOrderSummarySection = document.getElementById('cart-and-order-summary-section');

    // DOM Elements for Item Note Modal
    const itemNoteModalEl = document.getElementById('item-note-modal');
    const itemNoteModalInstance = itemNoteModalEl ? new bootstrap.Modal(itemNoteModalEl) : null;
    const modalItemNameEl = document.getElementById('modal-item-name');
    const modalItemIdInputEl = document.getElementById('modal-item-id-input');
    const modalItemNoteTextareaEl = document.getElementById('modal-item-note-textarea');
    const saveItemNoteBtn = document.getElementById('save-item-note-btn');

    // DOM Elements for Confirm Order Modal
    const confirmOrderModalEl = document.getElementById('confirm-order-modal');
    const confirmOrderModalInstance = confirmOrderModalEl ? new bootstrap.Modal(confirmOrderModalEl) : null;
    const modalTableNumberEl = document.getElementById('modal-table-number');
    const modalOrderSummaryItemsEl = document.getElementById('modal-order-summary-items');
    const modalOrderTotalEl = document.getElementById('modal-order-total');
    const submitOrderFinalBtn = document.getElementById('submit-order-final-btn');


    let menuData = [];
    let cart = [];
    const CART_STORAGE_KEY_PREFIX = 'restaurant_cart_table_';
    let cartStorageKey = '';
    let categoriesInOrder = [];

    if (!tableNumber) {
        showUserMessage("ไม่พบหมายเลขโต๊ะ! กรุณาสแกน QR Code ที่โต๊ะของท่านอีกครั้ง", "danger");
        if(menuLoadingPlaceholder) menuLoadingPlaceholder.textContent = "ข้อผิดพลาด: ไม่พบหมายเลขโต๊ะ";
        if(openConfirmOrderModalBtn) openConfirmOrderModalBtn.disabled = true;
        if(clearCartBtn) clearCartBtn.disabled = true;
        return;
    }

    if(tableNumberTitleEl) tableNumberTitleEl.textContent = tableNumber;
    if(tableNumberNavEl) tableNumberNavEl.textContent = tableNumber;
    if(currentOrderTableNumEl) currentOrderTableNumEl.textContent = tableNumber;
    cartStorageKey = `${CART_STORAGE_KEY_PREFIX}${tableNumber}`;

    // --- Cart Animation ---
    function triggerCartShake() {
        if (fabCartButton) {
            fabCartButton.classList.add('cart-shake');
            setTimeout(() => {
                fabCartButton.classList.remove('cart-shake');
            }, 300);
        }
        if (navbarCartIconContainer) {
            navbarCartIconContainer.classList.add('cart-shake');
            setTimeout(() => {
                navbarCartIconContainer.classList.remove('cart-shake');
            }, 300);
        }
    }

    // --- Cart Logic ---
    function loadCartFromStorage() {
        const storedCart = localStorage.getItem(cartStorageKey);
        if (storedCart) {
            cart = JSON.parse(storedCart);
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
            cart.push({ itemId: menuItem.ItemID, name: menuItem.Name, price: parseFloat(menuItem.Price), quantity: 1, note: "" });
        }
        renderCart();
        saveCartToStorage();
        showUserMessage(`เพิ่ม '${menuItem.Name}' ลงในตะกร้าแล้ว`, "success");
        triggerCartShake(); // เรียก animation
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
            if(openConfirmOrderModalBtn) openConfirmOrderModalBtn.disabled = true;
            if(clearCartBtn) clearCartBtn.style.display = 'none';
        } else {
            const ul = document.createElement('ul');
            ul.className = 'list-group list-group-flush';
            cart.forEach(item => {
                const itemSubtotal = item.price * item.quantity;
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center py-2 px-0';
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
            if(openConfirmOrderModalBtn) openConfirmOrderModalBtn.disabled = false;
            if(clearCartBtn) clearCartBtn.style.display = 'inline-block';

            ul.querySelectorAll('.decrease-qty-btn').forEach(btn => btn.addEventListener('click', e => updateQuantity(e.currentTarget.dataset.itemid, -1)));
            ul.querySelectorAll('.increase-qty-btn').forEach(btn => btn.addEventListener('click', e => updateQuantity(e.currentTarget.dataset.itemid, 1)));
            ul.querySelectorAll('.remove-item-btn').forEach(btn => btn.addEventListener('click', e => removeFromCart(e.currentTarget.dataset.itemid)));
            ul.querySelectorAll('.open-note-modal-btn').forEach(btn => btn.addEventListener('click', e => handleOpenNoteModal(e.currentTarget.dataset.itemid)));
        }
        cartTotalSummaryEl.textContent = total.toFixed(2);
        cartItemCountSummaryEl.textContent = itemCount;

        if(navCartTotalEl) navCartTotalEl.textContent = total.toFixed(2);
        if(fabCartCountEl) {
            fabCartCountEl.textContent = itemCount;
            fabCartCountEl.style.display = itemCount > 0 ? 'flex' : 'none'; // ใช้ flex เพื่อจัด badge กึ่งกลาง
        }
    }

    // --- Clear Cart Logic ---
    function handleClearCart() {
        if (cart.length > 0 && confirm("คุณต้องการล้างสินค้าทั้งหมดในตะกร้าใช่หรือไม่?")) {
            cart = [];
            saveCartToStorage();
            renderCart();
            showUserMessage("ล้างตะกร้าสินค้าเรียบร้อยแล้ว", "info");
        }
    }
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', handleClearCart);
    }


    // --- Item Note Modal Logic ---
    function handleOpenNoteModal(itemId) {
        if (!itemNoteModalInstance) return;
        const cartItem = cart.find(item => item.itemId === itemId);
        if (cartItem) {
            if(modalItemNameEl) modalItemNameEl.textContent = cartItem.name;
            if(modalItemIdInputEl) modalItemIdInputEl.value = cartItem.itemId;
            if(modalItemNoteTextareaEl) modalItemNoteTextareaEl.value = cartItem.note || "";
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
                renderCart();
                if (itemNoteModalInstance) itemNoteModalInstance.hide();
                showUserMessage("บันทึกโน้ตเรียบร้อยแล้ว", "success");
            } else {
                showUserMessage("เกิดข้อผิดพลาดในการบันทึกโน้ต", "danger");
            }
        });
    }

    // --- Menu Logic ---
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
                        <div>
                            <div class="menu-item-top-row">
                                <h5 class="card-title mb-0">${item.Name}</h5>
                                <div class="price-button-group">
                                    <span class="card-text price">${parseFloat(item.Price).toFixed(2)} บ.</span>
                                    <button class="btn btn-sm btn-outline-secondary add-to-cart-btn ms-2">
                                        <i class="bi bi-plus-circle-fill"></i>
                                    </button>
                                </div>
                            </div>
                            ${item.Description ? `<p class="card-text small text-muted mt-1 mb-0">${item.Description}</p>` : ''}
                        </div>
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

    // --- Confirm Order Modal & Submission Logic ---
    function populateConfirmOrderModal() {
        if (!modalOrderSummaryItemsEl || !modalOrderTotalEl || !modalTableNumberEl) return;

        if(modalTableNumberEl) modalTableNumberEl.textContent = tableNumber;
        modalOrderSummaryItemsEl.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            modalOrderSummaryItemsEl.innerHTML = '<p class="text-muted">ไม่มีรายการในตะกร้า</p>';
        } else {
            const ul = document.createElement('ul');
            ul.className = 'list-group list-group-flush';
            cart.forEach(item => {
                const itemSubtotal = item.price * item.quantity;
                const li = document.createElement('li');
                li.className = 'list-group-item px-0';
                li.innerHTML = `
                    <div>
                        <strong>${item.name}</strong> x ${item.quantity}
                        <span class="float-end">${itemSubtotal.toFixed(2)} บ.</span>
                    </div>
                    ${item.note ? `<small class="text-muted d-block fst-italic" style="margin-left: 10px;">- ${item.note}</small>` : ''}
                `;
                ul.appendChild(li);
                total += itemSubtotal;
            });
            modalOrderSummaryItemsEl.appendChild(ul);
        }
        modalOrderTotalEl.textContent = total.toFixed(2);
    }

    if (openConfirmOrderModalBtn && confirmOrderModalInstance) {
        openConfirmOrderModalBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                populateConfirmOrderModal();
                confirmOrderModalInstance.show();
            } else {
                showUserMessage("ตะกร้าสินค้าว่างเปล่า กรุณาเลือกรายการอาหารก่อน", "warning");
            }
        });
    }

    async function handleSubmitOrderFinal() {
        if (cart.length === 0) {
            showUserMessage("ตะกร้าสินค้าว่างเปล่า", "warning");
            if (confirmOrderModalInstance) confirmOrderModalInstance.hide();
            return;
        }

        submitOrderFinalBtn.disabled = true;
        const originalButtonText = submitOrderFinalBtn.innerHTML;
        submitOrderFinalBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> กำลังส่ง...`;

        const payload = {
            tableNumber: tableNumber,
            items: cart.map(item => ({
                itemId: item.itemId,
                quantity: item.quantity,
                note: item.note || ""
            }))
        };

        const result = await fetchData("submitOrder", {}, 'POST', payload, false);

        submitOrderFinalBtn.disabled = false;
        submitOrderFinalBtn.innerHTML = originalButtonText;
        if (confirmOrderModalInstance) confirmOrderModalInstance.hide();

        if (result && result.success) {
            showUserMessage(`สั่งอาหารสำเร็จ! ${result.message || ''}`, "success");
            cart = [];
            saveCartToStorage();
            renderCart();
            loadCurrentTableOrders(true);
        } else {
            showUserMessage("เกิดข้อผิดพลาดในการสั่งอาหาร: " + (result ? (result.message || result.error) : "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้"), "danger");
        }
    }

    if (submitOrderFinalBtn) {
        submitOrderFinalBtn.addEventListener('click', handleSubmitOrderFinal);
    }

    // --- Current Order Display Logic ---
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
            orders.forEach(item => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-start px-0 py-2';
                let itemInfoHtml = `<div class="me-auto">
                                        <span class="fw-bold">${item.ItemName} x ${item.Quantity}</span>`;
                if (item.ItemNote) {
                    itemInfoHtml += `<small class="cart-item-note d-block"><strong>โน้ต:</strong> ${item.ItemNote}</small>`;
                }
                itemInfoHtml += `<small class="text-muted d-block">(สถานะ: ${item.Status})</small></div>`;
                let priceHtml = `<span class="badge bg-light text-dark p-2">${parseFloat(item.Subtotal).toFixed(2)} บ.</span>`;
                li.innerHTML = itemInfoHtml + priceHtml;
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

    // --- Scroll to Cart Button Logic ---
    if (scrollToCartFab && cartAndOrderSummarySection) {
        scrollToCartFab.addEventListener('click', () => {
            cartAndOrderSummarySection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- Initial Load and Polling ---
    loadMenu();
    loadCartFromStorage();
    loadCurrentTableOrders(true);

    if (window.loadCurrentTableOrdersIntervalId) {
        clearInterval(window.loadCurrentTableOrdersIntervalId);
    }
    window.loadCurrentTableOrdersIntervalId = setInterval(() => {
        loadCurrentTableOrders(false);
    }, 60000);
});
