// Data structure for chats
let chats = {};
let currentChatId = null;
let currentUser = null;
let availableUsers = [];

// Initialize app
function initApp() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!user) {
        window.location.href = 'auth.html';
        return;
    }

    currentUser = user;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    availableUsers = users.filter(u => u.id !== user.id);

    // Display current user info
    document.getElementById('current-name').textContent = user.name;
    document.getElementById('current-email').textContent = user.email;
    document.getElementById('current-avatar').src = user.avatar;

    // Load chats from localStorage
    loadChats();
    loadContacts();
    selectContact(availableUsers[0].id);
}

// Load chats from localStorage
function loadChats() {
    const savedChats = JSON.parse(localStorage.getItem('chats')) || {};
    chats = savedChats;
}

// Save chats to localStorage
function saveChats() {
    localStorage.setItem('chats', JSON.stringify(chats));
}

// Load and display contacts
function loadContacts() {
    const contactsList = document.getElementById('contacts-list');
    contactsList.innerHTML = '';

    availableUsers.forEach(user => {
        const contact = document.createElement('div');
        contact.className = 'contact';
        contact.onclick = () => selectContact(user.id);
        contact.innerHTML = `
            <img src="${user.avatar}" alt="${user.name}" class="avatar-small">
            <div class="contact-info">
                <strong>${user.name}</strong>
                <small>${user.email}</small>
            </div>
            <span class="online-status">●</span>
        `;
        contactsList.appendChild(contact);
    });
}

// Select a contact and display chat
function selectContact(userId) {
    currentChatId = userId;
    const user = availableUsers.find(u => u.id === userId);

    if (!user) return;

    // Update header
    document.getElementById('contact-name').textContent = user.name;
    document.getElementById('contact-avatar').src = user.avatar;
    document.getElementById('contact-status').textContent = 'В сети';

    // Update active contact
    document.querySelectorAll('.contact').forEach((el, idx) => {
        el.classList.toggle('active', availableUsers[idx].id === userId);
    });

    // Load messages
    loadMessages(userId);
}

// Load messages for a chat
function loadMessages(userId) {
    const chatKey = `chat_${Math.min(currentUser.id, userId)}_${Math.max(currentUser.id, userId)}`;
    const messages = chats[chatKey] || [];

    const messagesList = document.getElementById('messages-list');
    messagesList.innerHTML = '';

    messages.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${msg.senderId === currentUser.id ? 'sent' : 'received'}`;
        msgDiv.innerHTML = `<p>${escapeHtml(msg.text)}</p><small>${formatTime(msg.timestamp)}</small>`;
        messagesList.appendChild(msgDiv);
    });

    // Scroll to bottom
    messagesList.scrollTop = messagesList.scrollHeight;
}

// Send message
function sendMessage() {
    const input = document.getElementById('message-input');
    const text = input.value.trim();

    if (!text || !currentChatId) return;

    // Create message object
    const message = {
        id: Date.now(),
        senderId: currentUser.id,
        senderName: currentUser.name,
        text,
        timestamp: new Date().toISOString()
    };

    // Save to chat
    const chatKey = `chat_${Math.min(currentUser.id, currentChatId)}_${Math.max(currentUser.id, currentChatId)}`;
    if (!chats[chatKey]) {
        chats[chatKey] = [];
    }
    chats[chatKey].push(message);
    saveChats();

    input.value = '';
    loadMessages(currentChatId);

    // Simulate response
    setTimeout(() => {
        const response = {
            id: Date.now(),
            senderId: currentChatId,
            senderName: availableUsers.find(u => u.id === currentChatId).name,
            text: getRandomResponse(),
            timestamp: new Date().toISOString()
        };
        chats[chatKey].push(response);
        saveChats();
        loadMessages(currentChatId);
    }, 1000 + Math.random() * 1000);
}

// Handle Enter key
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('message-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});

// New chat
function newChat() {
    if (availableUsers.length > 0) {
        selectContact(availableUsers[0].id);
    }
}

// Logout
function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'auth.html';
    }
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatTime(isoString) {
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

function getRandomResponse() {
    const responses = [
        '😄 Спасибо за сообщение!',
        'Согласен! 👍',
        'Интересная идея 💡',
        'Звучит хорошо! ✨',
        'Не могу не согласиться 🎉',
        'Совершенно верно! 👌',
        'Спасибо, что написал! 💬',
        'Как дела? 😊'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

// Start app
initApp();