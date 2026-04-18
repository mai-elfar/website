function safeNavigate(page) {
    if (['home.html', 'order.html'].includes(page) && !localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'signin.html';
        return;
    }
    window.location.href = page;

}
// Users database simulation
let users = [
    { username: 'user1', password: '123456', loggedIn: false },
    { username: 'user2', password: 'password', loggedIn: false }
];

let currentUser = null;
let selectedProduct = null;

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const protectedPages = ['home.html', 'order.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPage) && !isLoggedIn) {
        window.location.href = 'signin.html';
        return false;
    }
    return true;
}

// Login function
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const error = document.getElementById('error');

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user;
        user.loggedIn = true;
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', username);
        window.location.href = 'home.html';
    } else {
        error.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة';
        error.style.display = 'block';
    }
}

// Signup function
function signup() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const error = document.getElementById('signup-error');

    if (users.find(u => u.username === username)) {
        error.textContent = 'اسم المستخدم موجود بالفعل';
        error.style.display = 'block';
        return;
    }

    users.push({ username, password, loggedIn: true });
    currentUser = { username, password, loggedIn: true };
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', username);
    window.location.href = 'home.html';
}

// Logout function
function logout() {
    if (currentUser) {
        currentUser.loggedIn = false;
    }
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'signin.html';
}

// Order function
function orderNow(productName, price) {
    if (!checkAuth()) return;
    selectedProduct = { name: productName, price: price };
    localStorage.setItem('selectedProduct', JSON.stringify(selectedProduct));
    safeNavigate('order.html');
}

// Initialize pages
document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname.split('/').pop();

    switch (currentPage) {
        case 'home.html':
            checkAuth();
            updateNav();
            break;
        case 'signin.html':
            if (localStorage.getItem('isLoggedIn') === 'true') {
                window.location.href = 'home.html';
            }
            break;
        case 'signup.html':
            if (localStorage.getItem('isLoggedIn') === 'true') {
                window.location.href = 'home.html';
            }
            break;
        case 'order.html':
            checkAuth();
            loadOrder();
            break;
    }
});

// Update navigation
function updateNav() {
    const user = localStorage.getItem('currentUser');
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn && user) {
        logoutBtn.style.display = 'inline-block';
    }
}

// Load order data
function loadOrder() {
    const product = JSON.parse(localStorage.getItem('selectedProduct'));
    if (product) {
        document.getElementById('order-product').textContent = product.name;
        document.getElementById('order-price').textContent = `$${product.price}`;
        document.getElementById('total-price').textContent = `$${product.price}`;
    }
}

// Complete order
function completeOrder() {
    alert('تم استلام طلبك بنجاح! شكراً لك');
    window.location.href = 'home.html';
}

// Enter key support
document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');
        if (loginBtn) login();
        if (signupBtn) signup();
    }
});