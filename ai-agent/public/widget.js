// widget.js
const AgileWidget = (function() {
    let config = {
        apiUrl: 'http://localhost:8000/chat',
        themeColor: '#2563eb',
        title: 'Agile Assistant',
        subtitle: 'We generally reply instantly'
    };
    
    // Generate a unique session ID for the user's browser session
    let sessionId = localStorage.getItem('agile_chat_session');
    if (!sessionId) {
        sessionId = 'session_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('agile_chat_session', sessionId);
    }

    function init(userConfig) {
        config = { ...config, ...userConfig };
        injectStyles();
        renderWidget();
        attachEventListeners();
    }

    function injectStyles() {
        // Assume CSS is loaded via <link> in the parent HTML, 
        // but if we were injecting this snippet externally, we'd inject CSS here.
        document.documentElement.style.setProperty('--agile-theme', config.themeColor);
    }

    function renderWidget() {
        const container = document.getElementById('agile-ai-widget');
        if (!container) {
            console.error('Agile Widget container #agile-ai-widget not found.');
            return;
        }

        container.innerHTML = `
            <div class="agile-chat-window" id="agile-chat-window">
                <div class="agile-chat-header" style="background: ${config.themeColor}">
                    <div>
                        <div class="agile-chat-header-title">${config.title}</div>
                        <div class="agile-chat-header-subtitle">${config.subtitle}</div>
                    </div>
                    <button class="agile-close-btn" id="agile-close-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div class="agile-chat-body" id="agile-chat-body">
                    <div class="agile-message bot">Hello! I am your AI assistant for Agile Healthcare. How can I help you today?</div>
                    <div class="agile-typing-indicator" id="agile-typing">
                        <span></span><span></span><span></span>
                    </div>
                </div>
                <div class="agile-chat-footer">
                    <input type="text" class="agile-chat-input" id="agile-chat-input" placeholder="Type your message..." />
                    <button class="agile-send-btn" id="agile-send-btn" style="background: ${config.themeColor}">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </div>
            </div>
            <button class="agile-widget-btn" id="agile-widget-btn" style="background: ${config.themeColor}">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
            </button>
        `;
    }

    function attachEventListeners() {
        const toggleBtn = document.getElementById('agile-widget-btn');
        const closeBtn = document.getElementById('agile-close-btn');
        const chatWindow = document.getElementById('agile-chat-window');
        const sendBtn = document.getElementById('agile-send-btn');
        const input = document.getElementById('agile-chat-input');

        toggleBtn.addEventListener('click', () => {
            chatWindow.classList.add('open');
            toggleBtn.style.transform = 'scale(0)';
        });

        closeBtn.addEventListener('click', () => {
            chatWindow.classList.remove('open');
            toggleBtn.style.transform = 'scale(1)';
        });

        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    async function sendMessage() {
        const input = document.getElementById('agile-chat-input');
        const message = input.value.trim();
        if (!message) return;

        // Clear input and show user message
        input.value = '';
        appendMessage(message, 'user');
        
        // Show typing indicator
        const typingIndicator = document.getElementById('agile-typing');
        typingIndicator.style.display = 'block';
        scrollToBottom();

        try {
            const response = await fetch(config.apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message, session_id: sessionId })
            });

            const data = await response.json();
            typingIndicator.style.display = 'none';
            appendMessage(data.response, 'bot');
        } catch (error) {
            console.error('Chat API Error:', error);
            typingIndicator.style.display = 'none';
            appendMessage('Sorry, I am having trouble connecting to the server. Please try again later.', 'bot');
        }
    }

    function appendMessage(text, sender) {
        const body = document.getElementById('agile-chat-body');
        const typingIndicator = document.getElementById('agile-typing');
        
        const msgDiv = document.createElement('div');
        msgDiv.className = `agile-message ${sender}`;
        
        // Format simple markdown (bold) and line breaks
        let formattedText = text.replace(/\n/g, '<br/>');
        formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        msgDiv.innerHTML = formattedText;
        
        // Insert before typing indicator
        body.insertBefore(msgDiv, typingIndicator);
        scrollToBottom();
    }

    function scrollToBottom() {
        const body = document.getElementById('agile-chat-body');
        body.scrollTop = body.scrollHeight;
    }

    return { init };
})();
