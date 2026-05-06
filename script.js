// Application State
let walletBalance = 0;
let cart = [];

// Format Currency
const formatMoney = (amount) => `₹${amount}`;

// Extract Price and Size from select dropdown text (e.g., "500ml - ₹28")
function parseSelection(selectElement) {
    const text = selectElement.options[selectElement.selectedIndex].text;
    const parts = text.split(' - ₹');
    return {
        size: parts[0],
        price: parseInt(parts[1])
    };
}

// Add Item to Cart
function addToCart(productName, selectId) {
    const selectEl = document.getElementById(selectId);
    const details = parseSelection(selectEl);
    
    cart.push({
        name: productName,
        size: details.size,
        price: details.price
    });

    updateCartUI();
    
    // Quick visual feedback
    const btn = selectEl.nextElementSibling;
    btn.innerHTML = "✓";
    btn.style.background = "#22c55e";
    setTimeout(() => {
        btn.innerHTML = "+";
        btn.style.background = "var(--accent-green)";
    }, 1000);
}

// Update Cart Display
function updateCartUI() {
    const container = document.getElementById('cart-items-container');
    const badge = document.getElementById('cart-badge');
    const totalEl = document.getElementById('cart-total');
    
    badge.innerText = cart.length;
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        totalEl.innerText = formatMoney(0);
        return;
    }

    container.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        container.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>${item.size}</small>
                </div>
                <div>
                    <strong>${formatMoney(item.price)}</strong>
                </div>
            </div>
        `;
    });

    totalEl.innerText = formatMoney(total);
}

// Checkout Logic
function processOrder() {
    if (cart.length === 0) {
        alert("Please add items to your cart first!");
        return;
    }

    const address = document.getElementById('address').value.trim();
    if (!address) {
        alert("Please enter a delivery address for your subscription.");
        return;
    }

    let total = cart.reduce((sum, item) => sum + item.price, 0);

    // Business Logic: Check Wallet Balance
    if (walletBalance < total) {
        alert(`Insufficient Funds!\n\nYour total is ${formatMoney(total)} but your wallet only has ${formatMoney(walletBalance)}.\nPlease add money to your wallet to start the subscription.`);
        toggleCart(); // Close cart
        setTimeout(toggleWallet, 500); // Open wallet modal
    } else {
        // Successful Order
        walletBalance -= total;
        cart = []; // Empty Cart
        updateWalletUI();
        updateCartUI();
        document.getElementById('address').value = ''; // clear address
        
        alert("Subscription Confirmed! 🎉\nMoney has been deducted from your Moo Wallet.");
        toggleCart();
    }
}

// Wallet Functions
function addFunds(amount) {
    walletBalance += amount;
    updateWalletUI();
    alert(`${formatMoney(amount)} added successfully via UPI!`);
}

function updateWalletUI() {
    document.getElementById('wallet-display').innerText = formatMoney(walletBalance);
    document.getElementById('modal-wallet-display').innerText = formatMoney(walletBalance);
}

// UI Toggles
function toggleWallet() {
    const modal = document.getElementById('wallet-modal');
    const overlay = document.getElementById('wallet-overlay');
    const isShowing = modal.style.display === 'block';
    
    modal.style.display = isShowing ? 'none' : 'block';
    overlay.style.display = isShowing ? 'none' : 'block';
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    
    sidebar.classList.toggle('open');
    overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
}