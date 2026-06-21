const API_BASE = "/api";

const cartKey = "ecommerce_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(cartKey)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  const countEls = document.querySelectorAll("#cartCount");
  countEls.forEach((el) => {
    el.textContent = count;
  });
}

function formatPrice(value) {
  return `₹${value.toLocaleString()}`;
}

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (res.ok && data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userRole", data.role || "user");
    window.location.href = "products.html";
  } else {
    alert(data.message || "Login failed.");
  }
}

async function registerUser() {
  const name = document.getElementById("name")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();

  if (!name || !email || !password) {
    alert("Please enter name, email, and password.");
    return;
  }

  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();
  if (res.ok) {
    alert("Registration successful. Please login.");
    window.location.href = "login.html";
  } else {
    alert(data.message || "Registration failed.");
  }
}

function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  window.location.href = "login.html";
}

let allProducts = [];

async function loadProducts() {
  const res = await fetch(`${API_BASE}/products`);
  const products = await res.json();
  allProducts = products;
  renderProductGrid(products);
}

function setupProductSearch() {
  const searchInput = document.getElementById('productSearch');
  if (!searchInput) return;
  searchInput.addEventListener('input', (event) => {
    searchProducts(event.target.value);
  });
}

function renderProductGrid(products) {
  const box = document.getElementById("products");
  if (!box) return;
  box.innerHTML = products
    .map((p) => {
      const stars = Array.from({ length: 5 }, (_, index) =>
        index < Math.round(p.rating) ? '★' : '☆'
      ).join('');
      const imageUrl = p.image || 'https://via.placeholder.com/440x300?text=Product+Image';
      const tagBadge = p.tag ? `<span class="product-tag">${p.tag}</span>` : '';
      return `
      <div class="product">
        <img class="product-image" src="${imageUrl}" alt="${p.name}" />
        <div class="product-body">
          <div class="product-meta">
            <span class="product-category">${p.category}</span>
            ${tagBadge}
          </div>
          <div class="product-title">${p.name}</div>
          <div class="product-desc">${p.description}</div>
          <div class="product-footer">
            <div>
              <div class="product-price">${formatPrice(p.price)}</div>
              <div class="product-delivery">${p.delivery || 'Fast delivery available'}</div>
            </div>
            <div class="product-actions">
              <button onclick="showProductDetails(${p.id})">View Details</button>
              <button onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>`;
    })
    .join("");
}

function searchProducts(query) {
  if (!query) return renderProductGrid(allProducts);
  const normalized = query.toLowerCase().trim();
  const filtered = allProducts.filter((p) =>
    [p.name, p.description, p.category].some((text) => text.toLowerCase().includes(normalized))
  );
  renderProductGrid(filtered);
}

function showProductDetails(productId) {
  const product = allProducts.find((item) => item.id === productId);
  if (!product) return;
  document.getElementById('modalImage').src = product.image || 'https://via.placeholder.com/440x300?text=Product+Image';
  document.getElementById('modalTitle').innerText = product.name;
  document.getElementById('modalCategory').innerText = product.category;
  document.getElementById('modalRating').innerText = `★ ${product.rating ? product.rating.toFixed(1) : '0.0'}`;
  document.getElementById('modalDetails').innerText = product.details || product.description || 'Full product information not available.';
  const specsContainer = document.getElementById('modalSpecs');
  if (specsContainer) {
    if (product.specs && product.specs.length) {
      specsContainer.innerHTML = `<ul>${product.specs.map((spec) => `<li>${spec}</li>`).join('')}</ul>`;
    } else {
      specsContainer.innerHTML = '';
    }
  }
  document.getElementById('modalPrice').innerText = formatPrice(product.price);
  document.getElementById('modalDelivery').innerText = product.delivery || 'Free delivery available';
  const tagLabel = document.getElementById('modalTag');
  if (tagLabel) {
    tagLabel.textContent = product.tag || '';
    tagLabel.style.display = product.tag ? 'inline-flex' : 'none';
  }
  document.getElementById('modalPrice').innerText = formatPrice(product.price);
  document.getElementById('modalDelivery').innerText = product.delivery || 'Free delivery available';
  const addButton = document.getElementById('modalAddButton');
  addButton.onclick = () => {
    addToCart(product.id);
    closeProductModal();
  };
  document.getElementById('productModal').classList.remove('hidden');
}

function closeProductModal() {
  document.getElementById('productModal').classList.add('hidden');
}

function addToCart(productId) {
  const product = allProducts.find((item) => item.id === productId);
  if (!product) {
    return fetch(`${API_BASE}/products`)
      .then((res) => res.json())
      .then((products) => {
        const found = products.find((item) => item.id === productId);
        if (!found) return;
        addToCart(found.id);
      });
  }
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  alert(`${product.name} added to cart.`);
}

function renderCart() {
  const cartContainer = document.getElementById("cart");
  if (!cartContainer) return;
  const cart = getCart();
  if (!cart.length) {
    cartContainer.innerHTML = `<div class="empty-cart">Your cart is empty. <a href="products.html">Shop now</a>.</div>`;
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartContainer.innerHTML = `
    <div class="cart-items">
      ${cart
        .map(
          (item) => `
        <div class="cart-item">
          <div>
            <div class="cart-title">${item.name}</div>
            <div class="cart-quantity">Quantity: ${item.quantity}</div>
          </div>
          <div>
            <div class="cart-price">${formatPrice(item.price * item.quantity)}</div>
            <button onclick="removeFromCart(${item.id})">Remove</button>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
    <div class="cart-summary">
      <div class="summary-row"><span>Subtotal</span><span>${formatPrice(total)}</span></div>
      <div class="summary-row total"><span>Total</span><span>${formatPrice(total)}</span></div>
      <button onclick="checkout()">Checkout</button>
    </div>
  `;
}

function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
  renderCart();
}

async function checkout() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login before checkout.");
    window.location.href = "login.html";
    return;
  }

  const cart = getCart();
  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ items: cart, total }),
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.removeItem(cartKey);
    updateCartCount();
    // redirect to checkout confirmation page
    window.location.href = `checkout.html?orderId=${data.orderId}`;
  } else {
    alert(data.message || "Order could not be placed.");
  }
}

function initializePage() {
  updateCartCount();
  loadProducts();
  setupProductSearch();
  renderCart();
}

initializePage();
