const API_URL = 'http://localhost:4000';

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

document.getElementById('register-btn').addEventListener('click', async () => {
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    if (!validateEmail(email)) {
        alert('Please enter a valid email address!');
        return;
    }

    const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    alert(data.message);
});


document.getElementById('login-btn').addEventListener('click', async () => {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (data.token) {
        localStorage.setItem('token', data.token);
        window.location.href = data.redirectURL; // Use the redirect URL from the server
    } else {
        alert(data.message);
    }
});


