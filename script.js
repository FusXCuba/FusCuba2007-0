// Simple messenger functionality

function sendMessage() {
    const input = document.getElementById('message-input');
    const messageText = input.value.trim();

    if (messageText === '') return;

    // Create message element
    const messagesContainer = document.querySelector('.messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message sent';
    messageDiv.innerHTML = `<p>${escapeHtml(messageText)}</p>`;

    messagesContainer.appendChild(messageDiv);
    input.value = '';

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Simulate response after 1 second
    setTimeout(() => {
        const responseDiv = document.createElement('div');
        responseDiv.className = 'message received';
        responseDiv.innerHTML = `<p>Спасибо за сообщение! 👍</p>`;
        messagesContainer.appendChild(responseDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
}

// Handle Enter key
document.getElementById('message-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Simple XSS protection
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Contact selection
document.querySelectorAll('.contact').forEach(contact => {
    contact.addEventListener('click', function() {
        document.querySelectorAll('.contact').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        document.querySelector('.chat-header h2').textContent = this.textContent;
    });
});