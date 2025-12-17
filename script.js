// ========================================
// EASY PRODUCT EDITING SECTION
// ========================================
// To add or edit products, simply modify the array below.
// Each product needs: id, name, category, price, priceValue, description, and image.
// Save your product photos into the `images` folder with the file names used below.

const products = [
  {
    id: "black-magic",
    name: "Black Magic",
    category: "bio",
    price: "₹800",
    priceValue: 800,
    description: "High-quality plant growth stimulant from Unimax Agro Chemicals.",
    image: "images/black-magic.jpg"
  },
  {
    id: "promax",
    name: "Promax (Emamectin Benzoate 5% SG)",
    category: "pesticide",
    price: "₹950",
    priceValue: 950,
    description: "Insecticide / acaricide for effective control of caterpillars and sucking pests.",
    image: "images/promax.jpg"
  },
  {
    id: "thiomax",
    name: "ThiomaX (Thiophanate Methyl 70% WP)",
    category: "fungicide",
    price: "₹1,100",
    priceValue: 1100,
    description: "Systemic fungicide for control of a wide range of fungal diseases.",
    image: "images/thiomax.jpg"
  },
  {
    id: "nutrimax",
    name: "Nutri Max",
    category: "fertilizer",
    price: "₹650",
    priceValue: 650,
    description: "Plant nutrient and yield booster for healthier and stronger crops.",
    image: "images/nutrimax.jpg"
  },
  {
    id: "mtop",
    name: "M-TOP (Azoxystrobin 18.2% + Difenoconazole 11.4% SC)",
    category: "fungicide",
    price: "₹1,250",
    priceValue: 1250,
    description: "Systemic fungicide combination for broad-spectrum disease management.",
    image: "images/mtop.jpg"
  },
  {
    id: "maxido",
    name: "Maxido",
    category: "fungicide",
    price: "₹1,050",
    priceValue: 1050,
    description: "Fungicide formulation for effective protection against major crop diseases.",
    image: "images/maxido.jpg"
  },
  {
    id: "maxtara",
    name: "MaxTara",
    category: "pesticide",
    price: "₹900",
    priceValue: 900,
    description: "Insecticide formulation for protection of cotton and other crops.",
    image: "images/maxtara.jpg"
  },
  {
    id: "super-potash",
    name: "Super Potash (Natural Liquid Bio Fertilizer)",
    category: "fertilizer",
    price: "₹700",
    priceValue: 700,
    description: "Natural liquid bio fertilizer rich in potash for improving crop quality and yield.",
    image: "images/super-potash.jpg"
  }
  // To change prices, edit `price` (text shown) and `priceValue` (number used for totals).
];

// ========================================
// CONTACT EMAIL CONFIGURATION
// ========================================
// Change this to your actual email address
const CONTACT_EMAIL = "info@unimaxagro.com";

// ========================================
// UTILITIES & STORAGE HELPERS
// ========================================

function getCurrentPage() {
    const body = document.body;
    return body.dataset.page || "home";
}

function formatCurrency(value) {
    return "₹" + Number(value).toLocaleString("en-IN");
}

const CART_KEY = "unimax_cart";
const ADDRESSES_KEY = "unimax_addresses";
const SELECTED_ADDRESS_KEY = "unimax_selected_address";
const ORDER_KEY = "unimax_last_order";

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
}

function addToCart(productId, qty = 1) {
    const cart = getCart();
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += qty;
    } else {
        cart.push({ id: productId, quantity: qty });
    }
    saveCart(cart);
    alert("Added to cart");
}

function updateCartItemQuantity(productId, quantity) {
    let cart = getCart();
    cart = cart.map(item => {
        if (item.id === productId) {
            return { ...item, quantity: Math.max(1, quantity) };
        }
        return item;
    });
    saveCart(cart);
}

function removeCartItem(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
}

function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartBadge();
}

function updateCartBadge() {
    const badge = document.getElementById("cartCountBadge");
    if (!badge) return;
    const cart = getCart();
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalQty.toString();
}

function getAddresses() {
    try {
        return JSON.parse(localStorage.getItem(ADDRESSES_KEY)) || [];
    } catch {
        return [];
    }
}

function saveAddresses(addresses) {
    localStorage.setItem(ADDRESSES_KEY, JSON.stringify(addresses));
}

function getSelectedAddressId() {
    return localStorage.getItem(SELECTED_ADDRESS_KEY);
}

function setSelectedAddressId(id) {
    localStorage.setItem(SELECTED_ADDRESS_KEY, id);
}

function saveOrder(order) {
    localStorage.setItem(ORDER_KEY, JSON.stringify(order));
}

function getLastOrder() {
    try {
        return JSON.parse(localStorage.getItem(ORDER_KEY));
    } catch {
        return null;
    }
}

// ========================================
// NAV & GLOBAL UI
// ========================================

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
    });

    document.querySelectorAll(".nav-mobile .nav-link").forEach(link => {
        link.addEventListener("click", () => {
            mobileMenu.classList.remove("active");
        });
    });
}

// Smooth Scrolling only for same-page # links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (!href || href === "#") return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

// ========================================
// PRODUCTS RENDERING
// ========================================

function renderProductsGrid({ containerId, limit = null, filterCategory = "all" } = {}) {
    const productsGrid = document.getElementById(containerId);
    if (!productsGrid) return;

    productsGrid.innerHTML = "";

    let list = products;
    if (filterCategory !== "all") {
        list = products.filter(p => p.category === filterCategory);
    }

    if (limit != null) {
        list = list.slice(0, limit);
    }

    list.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-content">
                <div class="product-icon">
                    ${product.icon}
                </div>
                <div class="product-header">
                    <h3>${product.name}</h3>
                    <span class="product-price">${product.price}</span>
                </div>
                <p>${product.description}</p>
                <button class="btn btn-primary btn-full add-to-cart-btn" data-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        `;

        productsGrid.appendChild(productCard);
    });

    productsGrid.querySelectorAll(".add-to-cart-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            addToCart(id, 1);
        });
    });
}

// ========================================
// CONTACT FORM (HOME PAGE)
// ========================================

const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", e => {
        e.preventDefault();

        const formData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            subject: document.getElementById("subject").value,
            message: document.getElementById("message").value
        };

        const subject = encodeURIComponent(`Inquiry: ${formData.subject}`);
        const body = encodeURIComponent(
            `Name: ${formData.name}\n` +
            `Email: ${formData.email}\n` +
            `Phone: ${formData.phone}\n\n` +
            `Message:\n${formData.message}`
        );

        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
        contactForm.reset();
    });
}

// Footer year
const yearSpan = document.getElementById("year");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// ========================================
// PAGE INITIALIZERS
// ========================================

function initHomePage() {
    renderProductsGrid({ containerId: "productsGrid", limit: 3 });
}

function initProductsPage() {
    const filterSelect = document.getElementById("categoryFilter");
    renderProductsGrid({ containerId: "productsGrid", filterCategory: "all" });

    if (filterSelect) {
        filterSelect.addEventListener("change", () => {
            renderProductsGrid({
                containerId: "productsGrid",
                filterCategory: filterSelect.value
            });
        });
    }
}

function initCartPage() {
    const container = document.getElementById("cartItemsContainer");
    const summary = document.getElementById("cartSummary");
    if (!container || !summary) return;

    const cart = getCart();

    if (!cart.length) {
        container.innerHTML = `
            <div class="empty-state">
                <h2>Your cart is empty</h2>
                <p>Add some products to your cart to see them here.</p>
                <a href="products.html" class="btn btn-primary">Browse Products</a>
            </div>
        `;
        summary.innerHTML = `
            <h2>Price Details</h2>
            <p class="muted-text">Add products to see the summary.</p>
        `;
        return;
    }

    container.innerHTML = "";

    const detailedItems = cart
        .map(item => {
            const product = products.find(p => p.id === item.id);
            if (!product) return null;
            return {
                ...product,
                quantity: item.quantity,
                totalPrice: product.priceValue * item.quantity
            };
        })
        .filter(Boolean);

    detailedItems.forEach(item => {
        const card = document.createElement("div");
        card.className = "cart-item-card";
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-body">
                <div class="cart-item-header">
                    <div>
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-meta">${item.category.toUpperCase()}</div>
                    </div>
                    <div class="cart-item-price">${formatCurrency(item.totalPrice)}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="qty-control">
                        <button class="qty-btn" data-action="minus" data-id="${item.id}">-</button>
                        <span class="qty-value" data-qty-id="${item.id}">${item.quantity}</span>
                        <button class="qty-btn" data-action="plus" data-id="${item.id}">+</button>
                    </div>
                    <button class="cart-remove-btn" data-remove-id="${item.id}">Remove</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    const subtotal = detailedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const shipping = subtotal > 1999 ? 0 : 99;
    const total = subtotal + shipping;

    summary.innerHTML = `
        <h2>Price Details</h2>
        <div class="cart-summary-row">
            <span>Items</span>
            <span>${detailedItems.length}</span>
        </div>
        <div class="cart-summary-row">
            <span>Subtotal</span>
            <span>${formatCurrency(subtotal)}</span>
        </div>
        <div class="cart-summary-row">
            <span>Shipping</span>
            <span>${shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
        </div>
        <div class="cart-summary-row total">
            <span>Total</span>
            <span>${formatCurrency(total)}</span>
        </div>
        <button id="proceedToCheckout" class="btn btn-primary btn-full" style="margin-top: 1rem;">
            Proceed to Checkout
        </button>
        <p class="small-text">You can review your order details on the next page before placing the order.</p>
    `;

    container.addEventListener("click", e => {
        const target = e.target;
        if (target.matches(".qty-btn")) {
            const id = target.getAttribute("data-id");
            const action = target.getAttribute("data-action");
            const qtySpan = container.querySelector(`[data-qty-id="${id}"]`);
            let currentQty = parseInt(qtySpan.textContent, 10) || 1;
            currentQty = action === "plus" ? currentQty + 1 : Math.max(1, currentQty - 1);
            updateCartItemQuantity(id, currentQty);
            initCartPage();
        } else if (target.matches(".cart-remove-btn")) {
            const id = target.getAttribute("data-remove-id");
            removeCartItem(id);
            initCartPage();
        }
    });

    const checkoutBtn = document.getElementById("proceedToCheckout");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            window.location.href = "checkout.html";
        });
    }
}

function initCheckoutPage() {
    const addressesContainer = document.getElementById("addressesContainer");
    const addressForm = document.getElementById("addressForm");
    const checkoutSummary = document.getElementById("checkoutSummary");
    if (!addressesContainer || !addressForm || !checkoutSummary) return;

    function renderAddresses() {
        const addresses = getAddresses();
        const selectedId = getSelectedAddressId();

        if (!addresses.length) {
            addressesContainer.innerHTML = `<p class="muted-text">No saved addresses. Please add a new address below.</p>`;
            return;
        }

        addressesContainer.innerHTML = "";
        addresses.forEach(address => {
            const card = document.createElement("label");
            card.className = "address-card" + (address.id === selectedId ? " selected" : "");
            card.innerHTML = `
                <input type="radio" class="address-radio" name="selectedAddress" value="${address.id}" ${address.id === selectedId ? "checked" : ""}>
                <div class="address-body">
                    <h3>${address.fullName} (${address.phoneNumber})</h3>
                    <p>${address.flat}, ${address.area}</p>
                    <p>${address.city}, ${address.state} - ${address.pincode}</p>
                    <span class="address-tag">${address.type}</span>
                </div>
            `;
            addressesContainer.appendChild(card);
        });

        addressesContainer.querySelectorAll('input[name="selectedAddress"]').forEach(radio => {
            radio.addEventListener("change", () => {
                setSelectedAddressId(radio.value);
                renderAddresses();
            });
        });
    }

    addressForm.addEventListener("submit", e => {
        e.preventDefault();
        const newAddress = {
            id: "addr-" + Date.now(),
            fullName: document.getElementById("fullName").value.trim(),
            phoneNumber: document.getElementById("phoneNumber").value.trim(),
            flat: document.getElementById("flat").value.trim(),
            area: document.getElementById("area").value.trim(),
            city: document.getElementById("city").value.trim(),
            state: document.getElementById("state").value.trim(),
            pincode: document.getElementById("pincode").value.trim(),
            type: document.getElementById("addressType").value
        };

        const addresses = getAddresses();
        addresses.push(newAddress);
        saveAddresses(addresses);
        setSelectedAddressId(newAddress.id);
        addressForm.reset();
        renderAddresses();
        alert("Address saved");
    });

    function renderSummary() {
        const cart = getCart();
        if (!cart.length) {
            checkoutSummary.innerHTML = `
                <h2>Order Summary</h2>
                <p class="muted-text">Your cart is empty. Please add products before checking out.</p>
                <a href="products.html" class="btn btn-primary btn-full">Browse Products</a>
            `;
            return;
        }

        const detailedItems = cart
            .map(item => {
                const product = products.find(p => p.id === item.id);
                if (!product) return null;
                return {
                    ...product,
                    quantity: item.quantity,
                    totalPrice: product.priceValue * item.quantity
                };
            })
            .filter(Boolean);

        const subtotal = detailedItems.reduce((sum, item) => sum + item.totalPrice, 0);
        const shipping = subtotal > 1999 ? 0 : 99;
        const total = subtotal + shipping;

        checkoutSummary.innerHTML = `
            <h2>Order Summary</h2>
            <ul>
                ${detailedItems
                    .map(
                        item => `
                    <li>
                        <span>${item.name} × ${item.quantity}</span>
                        <span>${formatCurrency(item.totalPrice)}</span>
                    </li>
                `
                    )
                    .join("")}
            </ul>
            <div class="checkout-summary-row">
                <span>Subtotal</span>
                <span>${formatCurrency(subtotal)}</span>
            </div>
            <div class="checkout-summary-row">
                <span>Shipping</span>
                <span>${shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
            </div>
            <div class="checkout-summary-row total-line">
                <span>Total</span>
                <span>${formatCurrency(total)}</span>
            </div>
            <button id="placeOrderBtn" class="btn btn-primary btn-full" style="margin-top: 1rem;">
                Place Order Securely
            </button>
            <p class="small-text">By placing your order, you agree to receive updates on your purchase.</p>
        `;

        const placeOrderBtn = document.getElementById("placeOrderBtn");
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener("click", () => {
                const selectedAddressId = getSelectedAddressId();
                const addresses = getAddresses();
                const address = addresses.find(a => a.id === selectedAddressId);

                if (!address) {
                    alert("Please select or add a delivery address before placing the order.");
                    return;
                }

                const paymentRadio = document.querySelector('input[name="paymentMethod"]:checked');
                const paymentMethod = paymentRadio ? paymentRadio.value : "upi";

                const orderId = "UMA" + Math.floor(100000 + Math.random() * 900000);

                const order = {
                    id: orderId,
                    createdAt: new Date().toISOString(),
                    items: detailedItems,
                    subtotal,
                    shipping,
                    total,
                    address,
                    paymentMethod
                };

                saveOrder(order);
                clearCart();
                window.location.href = "order-success.html";
            });
        }
    }

    renderAddresses();
    renderSummary();
}

function initOrderSuccessPage() {
    const card = document.getElementById("orderSuccessCard");
    if (!card) return;

    const order = getLastOrder();
    if (!order) {
        card.innerHTML = `
            <div class="order-success-icon">
                ✓
            </div>
            <h1>Thank you!</h1>
            <p>Your order has been placed.</p>
            <a href="products.html" class="btn btn-primary">Shop More Products</a>
        `;
        return;
    }

    card.innerHTML = `
        <div class="order-success-icon">
            ✓
        </div>
        <h1>Order Placed Successfully</h1>
        <p>Thank you for shopping with UNIMAXAGRO. Your order will be processed shortly.</p>
        <div class="order-success-meta">
            <h3>Order ID</h3>
            <p>${order.id}</p>
            <h3>Delivery To</h3>
            <p>${order.address.fullName} (${order.address.phoneNumber})</p>
            <p>${order.address.flat}, ${order.address.area}</p>
            <p>${order.address.city}, ${order.address.state} - ${order.address.pincode}</p>
            <h3 style="margin-top: 0.75rem;">Payment</h3>
            <p>Method: ${order.paymentMethod.toUpperCase()}</p>
            <p>Total Paid: ${formatCurrency(order.total)}</p>
        </div>
        <a href="products.html" class="btn btn-primary" style="margin-right: 0.5rem;">Shop More</a>
        <a href="index.html#home" class="btn btn-secondary">Go to Home</a>
    `;
}

// ========================================
// INITIALIZE BASED ON PAGE
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge();
    const page = getCurrentPage();

    if (page === "home") {
        initHomePage();
    } else if (page === "products") {
        initProductsPage();
    } else if (page === "cart") {
        initCartPage();
    } else if (page === "checkout") {
        initCheckoutPage();
    } else if (page === "order-success") {
        initOrderSuccessPage();
    }
});



