// Switching between login and register forms
function switchForm(event) {
    event.preventDefault();
    document.getElementById('login-form').classList.toggle('active');
    document.getElementById('register-form').classList.toggle('active');
}

// Handle login
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Save current user session
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert(`Добро пожаловать, ${user.name}!`);
        window.location.href = 'index.html';
    } else {
        alert('Неверный email или пароль');
    }
}

// Handle registration
function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;

    if (password !== confirm) {
        alert('Пароли не совпадают');
        return;
    }

    // Get existing users
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if user already exists
    if (users.find(u => u.email === email)) {
        alert('Пользователь с таким email уже существует');
        return;
    }

    // Add new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        avatar: `https://i.pravatar.cc/150?img=${Math.random() * 70}`
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Аккаунт успешно создан! Теперь войдите');
    switchForm(event);
    document.getElementById('login-email').value = email;
}

// Initialize demo users on first load
if (!localStorage.getItem('users')) {
    const demoUsers = [
        {
            id: 1,
            name: 'Александр',
            email: 'alex@example.com',
            password: '123456',
            avatar: 'https://i.pravatar.cc/150?img=1'
        },
        {
            id: 2,
            name: 'Мария',
            email: 'maria@example.com',
            password: '123456',
            avatar: 'https://i.pravatar.cc/150?img=2'
        },
        {
            id: 3,
            name: 'Иван',
            email: 'ivan@example.com',
            password: '123456',
            avatar: 'https://i.pravatar.cc/150?img=3'
        }
    ];
    localStorage.setItem('users', JSON.stringify(demoUsers));
}