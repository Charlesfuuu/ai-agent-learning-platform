/**
 * UI Controller Module
 * Handles UI interactions: sidebar toggle, message display, etc.
 */
const UIController = (function() {
    /**
     * Toggle sidebar open/closed
     */
    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');

        if (sidebar && overlay) {
            const isOpen = sidebar.classList.contains('open');
            if (isOpen) {
                closeSidebar();
            } else {
                openSidebar();
            }
        }
    }

    /**
     * Open sidebar
     */
    function openSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');

        if (sidebar) sidebar.classList.add('open');
        if (overlay) overlay.classList.add('active');
    }

    /**
     * Close sidebar
     */
    function closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');

        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
    }

    /**
     * Display messages in the chat area
     */
    function displayMessages(messages) {
        const chatDisplay = document.getElementById('chatMessagesDisplay');
        if (!chatDisplay) return;

        if (messages.length === 0) {
            chatDisplay.innerHTML = `<div class="no-messages" data-i18n="ui.chat.noMessages">${I18n.translate('ui.chat.noMessages')}</div>`;
            chatDisplay.style.display = 'block';
            return;
        }

        let html = '';
        for (const msg of messages) {
            const roleClass = msg.role === 'USER' ? 'user' : 'assistant';
            const roleLabel = msg.role === 'USER' ? I18n.translate('ui.chat.you') : I18n.translate('ui.chat.assistant');

            html += `
                <div class="message ${roleClass}">
                    <div class="message-header">${roleLabel}</div>
                    <div class="message-content">${escapeHtml(msg.content)}</div>
                </div>
            `;
        }

        chatDisplay.innerHTML = html;
        chatDisplay.style.display = 'block';

        // Scroll to bottom
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }

    /**
     * Clear chat display
     */
    function clearChatDisplay() {
        const chatDisplay = document.getElementById('chatMessagesDisplay');
        if (chatDisplay) {
            chatDisplay.innerHTML = '';
            chatDisplay.style.display = 'none';
        }
    }

    /**
     * Add a single message to the display (for real-time updates)
     */
    function appendMessage(role, content) {
        const chatDisplay = document.getElementById('chatMessagesDisplay');
        if (!chatDisplay) return;

        // Remove "no messages" placeholder if it exists
        const noMessages = chatDisplay.querySelector('.no-messages');
        if (noMessages) {
            noMessages.remove();
        }

        chatDisplay.style.display = 'block';

        const roleClass = role === 'USER' ? 'user' : 'assistant';
        const roleLabel = role === 'USER' ? I18n.translate('ui.chat.you') : I18n.translate('ui.chat.assistant');

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${roleClass}`;
        messageDiv.innerHTML = `
            <div class="message-header">${roleLabel}</div>
            <div class="message-content">${escapeHtml(content)}</div>
        `;

        chatDisplay.appendChild(messageDiv);

        // Scroll to bottom
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }

    /**
     * Show loading indicator in chat
     */
    function showChatLoading() {
        const chatDisplay = document.getElementById('chatMessagesDisplay');
        if (!chatDisplay) return;

        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message assistant loading';
        loadingDiv.id = 'loadingMessage';
        loadingDiv.innerHTML = `
            <div class="message-header">${I18n.translate('ui.chat.assistant')}</div>
            <div class="message-content">${I18n.translate('ui.chat.thinking')}</div>
        `;

        chatDisplay.appendChild(loadingDiv);
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }

    /**
     * Remove loading indicator
     */
    function hideChatLoading() {
        const loadingMsg = document.getElementById('loadingMessage');
        if (loadingMsg) {
            loadingMsg.remove();
        }
    }

    /**
     * Escape HTML
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Public API
    return {
        toggleSidebar,
        openSidebar,
        closeSidebar,
        displayMessages,
        clearChatDisplay,
        appendMessage,
        showChatLoading,
        hideChatLoading
    };
})();
