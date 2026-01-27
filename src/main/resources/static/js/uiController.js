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
            return;
        }

        // Clear chat display
        chatDisplay.innerHTML = '';

        // Render each message
        for (const msg of messages) {
            const messageHtml = renderMessage(msg.role, msg.content);
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = messageHtml;
            const messageElement = tempDiv.firstElementChild;

            // Store the message ID for deletion
            if (msg.id) {
                messageElement.setAttribute('data-message-id', msg.id);
            }

            // Store the user message content for edit/regenerate functionality
            if (msg.role === 'USER') {
                messageElement.setAttribute('data-user-message', msg.content);
            }

            chatDisplay.appendChild(messageElement);
        }

        // Only keep edit button on the most recent user message
        const userMessages = chatDisplay.querySelectorAll('.message.user');
        if (userMessages.length > 0) {
            userMessages.forEach((msg, index) => {
                if (index < userMessages.length - 1) {
                    const editBtn = msg.querySelector('.edit-btn');
                    if (editBtn) {
                        editBtn.remove();
                    }
                }
            });
        }

        // Only keep regenerate button on the most recent assistant message
        const assistantMessages = chatDisplay.querySelectorAll('.message.assistant:not(.error)');
        if (assistantMessages.length > 0) {
            assistantMessages.forEach((msg, index) => {
                if (index < assistantMessages.length - 1) {
                    const regenBtn = msg.querySelector('.regenerate-btn');
                    if (regenBtn) {
                        regenBtn.remove();
                    }
                }
            });
        }

        // Apply syntax highlighting to code blocks
        highlightCodeBlocks();

        // Scroll parent container to bottom
        const chatContainer = chatDisplay.closest('.chat-display');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }

    /**
     * Render a single message with markdown support
     */
    function renderMessage(role, content, options = {}) {
        const roleClass = role === 'USER' ? 'user' : 'assistant';
        const roleLabel = role === 'USER' ? I18n.translate('ui.chat.you') : I18n.translate('ui.chat.assistant');

        // Check if this is an error message
        const isError = options.isError || false;
        const retryData = options.retryData || null;

        // Render markdown for assistant messages
        let renderedContent;
        if (role === 'ASSISTANT' && typeof marked !== 'undefined' && !isError) {
            try {
                renderedContent = marked.parse(content);
            } catch (e) {
                console.error('Markdown parsing error:', e);
                renderedContent = escapeHtml(content);
            }
        } else {
            renderedContent = escapeHtml(content);
        }

        // Escape content for data attribute (for copy functionality)
        const escapedForAttr = content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

        // Build action buttons HTML
        let actionButtons = '<div class="message-actions">';

        // Add delete button for all messages
        actionButtons += '<button class="delete-btn" title="删除">🗑️</button>';

        // Add copy button
        actionButtons += `<button class="copy-btn" data-content="${escapedForAttr}" title="复制">📋</button>`;

        // Add edit button for user messages
        if (role === 'USER') {
            actionButtons += `<button class="edit-btn" data-content="${escapedForAttr}" title="编辑">✏️</button>`;
        }

        // Add retry button for error messages
        if (isError && retryData) {
            const retryDataStr = JSON.stringify(retryData).replace(/"/g, '&quot;');
            actionButtons += `<button class="retry-btn" data-retry="${retryDataStr}" title="重试">🔄</button>`;
        }

        // Add regenerate button for assistant messages (non-error)
        if (role === 'ASSISTANT' && !isError) {
            actionButtons += '<button class="regenerate-btn" title="重新生成">🔄</button>';
        }

        actionButtons += '</div>';

        const errorClass = isError ? 'error' : '';

        return `
            <div class="message ${roleClass} ${errorClass}">
                <div class="message-header">${roleLabel}</div>
                <div class="message-wrapper">
                    <div class="message-content">${renderedContent}</div>
                    ${actionButtons}
                </div>
            </div>
        `;
    }

    /**
     * Highlight code blocks and add copy buttons
     */
    function highlightCodeBlocks() {
        if (typeof hljs !== 'undefined') {
            document.querySelectorAll('pre code').forEach((block) => {
                // Only highlight if not already highlighted
                if (!block.dataset.highlighted) {
                    hljs.highlightElement(block);
                }
            });
        }

        // Add copy buttons to code blocks
        document.querySelectorAll('pre').forEach((preBlock) => {
            // Skip if already has a copy button
            if (preBlock.querySelector('.code-copy-btn')) {
                return;
            }

            // Create copy button
            const copyBtn = document.createElement('button');
            copyBtn.className = 'code-copy-btn';
            copyBtn.textContent = '复制代码';
            // onclick removed - using event delegation

            // Make pre block relative positioned
            preBlock.style.position = 'relative';
            preBlock.appendChild(copyBtn);
        });
    }

    /**
     * Clear chat display
     */
    function clearChatDisplay() {
        const chatDisplay = document.getElementById('chatMessagesDisplay');
        if (chatDisplay) {
            chatDisplay.innerHTML = '';
        }
    }

    /**
     * Add a single message to the display (for real-time updates)
     */
    function appendMessage(role, content, options = {}) {
        const chatDisplay = document.getElementById('chatMessagesDisplay');
        if (!chatDisplay) return;

        // Remove "no messages" placeholder if it exists
        const noMessages = chatDisplay.querySelector('.no-messages');
        if (noMessages) {
            noMessages.remove();
        }

        // Before adding new message, remove edit/regenerate buttons from previous last message
        if (role === 'USER') {
            // Remove edit button from previous last user message
            const userMessages = chatDisplay.querySelectorAll('.message.user');
            if (userMessages.length > 0) {
                const lastUserMsg = userMessages[userMessages.length - 1];
                const editBtn = lastUserMsg.querySelector('.edit-btn');
                if (editBtn) {
                    editBtn.remove();
                }
            }
        } else if (role === 'ASSISTANT' && !options.isError) {
            // Remove regenerate button from previous last assistant message
            const assistantMessages = chatDisplay.querySelectorAll('.message.assistant:not(.error)');
            if (assistantMessages.length > 0) {
                const lastAssistantMsg = assistantMessages[assistantMessages.length - 1];
                const regenBtn = lastAssistantMsg.querySelector('.regenerate-btn');
                if (regenBtn) {
                    regenBtn.remove();
                }
            }
        }

        const messageHtml = renderMessage(role, content, options);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = messageHtml;
        const messageElement = tempDiv.firstElementChild;

        // Store the last user message for regenerate functionality
        if (role === 'USER') {
            messageElement.setAttribute('data-user-message', content);
        }

        chatDisplay.appendChild(messageElement);

        // Apply syntax highlighting
        highlightCodeBlocks();

        // Scroll parent container to bottom
        const chatContainer = chatDisplay.closest('.chat-display');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }

    /**
     * Show loading indicator in chat with stop button
     */
    function showChatLoading() {
        const chatDisplay = document.getElementById('chatMessagesDisplay');
        if (!chatDisplay) return;

        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message assistant loading';
        loadingDiv.id = 'loadingMessage';
        loadingDiv.innerHTML = `
            <div class="message-header">${I18n.translate('ui.chat.assistant')}</div>
            <div class="message-wrapper">
                <div class="message-content">${I18n.translate('ui.chat.thinking')}</div>
                <div class="message-actions">
                    <button class="stop-btn" title="停止生成">⏹</button>
                </div>
            </div>
        `;

        chatDisplay.appendChild(loadingDiv);

        // Scroll parent container to bottom
        const chatContainer = chatDisplay.closest('.chat-display');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
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

    /**
     * Copy message content to clipboard
     */
    function copyMessage(button) {
        const content = button.getAttribute('data-content');
        if (!content) {
            Toast.error('无法复制：内容为空');
            return;
        }

        const decodedContent = new DOMParser().parseFromString(content, 'text/html').body.textContent;

        // Check if modern clipboard API is available
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(decodedContent).then(() => {
                showCopySuccess(button);
            }).catch(err => {
                console.error('Failed to copy:', err);
                Toast.error('复制失败: ' + err.message);
            });
        } else {
            // Fallback for older browsers or non-HTTPS
            const textArea = document.createElement('textarea');
            textArea.value = decodedContent;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.select();

            try {
                document.execCommand('copy');
                showCopySuccess(button);
            } catch (err) {
                console.error('Fallback copy failed:', err);
                Toast.error('复制失败：您的浏览器不支持该功能');
            }

            document.body.removeChild(textArea);
        }
    }

    /**
     * Show copy success feedback
     */
    function showCopySuccess(button) {
        const originalText = button.textContent;
        button.textContent = '已复制!';
        button.classList.add('copied');

        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    }

    /**
     * Retry failed message
     */
    function retryMessage(button) {
        const retryDataStr = button.getAttribute('data-retry');
        if (!retryDataStr) {
            console.error('[retryMessage] No retry data found');
            Toast.error('重试失败：数据丢失，请刷新页面后重试');
            return;
        }

        try {
            const retryData = JSON.parse(retryDataStr);

            // Validate retry data
            if (!retryData.sessionId || !retryData.message) {
                throw new Error('Retry data is incomplete');
            }

            // Remove the error message
            const messageElement = button.closest('.message');
            if (messageElement) {
                messageElement.remove();
            }

            // Call the global sendChatWithData function
            if (typeof window.sendChatWithData === 'function') {
                window.sendChatWithData(retryData.sessionId, retryData.message);
            } else {
                throw new Error('sendChatWithData function not available');
            }
        } catch (error) {
            console.error('[retryMessage] Error:', error);
            Toast.error('重试失败: ' + error.message + '\n\n请刷新页面后重试');
        }
    }

    /**
     * Regenerate assistant message
     */
    function regenerateMessage(button) {
        const messageElement = button.closest('.message');
        if (!messageElement) {
            console.error('[regenerateMessage] Cannot find message element');
            return;
        }

        // Find the previous user message
        let prevElement = messageElement.previousElementSibling;
        let userMessage = null;
        let foundUserElement = null;

        while (prevElement) {
            if (prevElement.classList.contains('user')) {
                foundUserElement = prevElement;
                userMessage = prevElement.getAttribute('data-user-message');
                if (userMessage) {
                    break;
                }
            }
            prevElement = prevElement.previousElementSibling;
        }

        if (!userMessage) {
            console.error('[regenerateMessage] Cannot find previous user message');
            if (foundUserElement) {
                console.error('[regenerateMessage] Found user element but missing data-user-message attribute');
            } else {
                console.error('[regenerateMessage] No user message element found');
            }
            Toast.error('无法找到对应的用户消息，请刷新页面后重试');
            return;
        }

        // Remove the current assistant message
        messageElement.remove();

        // Resend the request (skip adding user message since it already exists)
        if (window.sendChatWithData) {
            const sessionId = SessionManager.getCurrentSessionId();
            if (sessionId) {
                // Pass skipUserMessage = true and isRegenerate = true
                window.sendChatWithData(sessionId, userMessage, true, true);
            } else {
                console.error('[regenerateMessage] No active session');
                Toast.error('没有活动会话，请刷新页面后重试');
            }
        } else {
            console.error('[regenerateMessage] sendChatWithData function not available');
            Toast.error('功能暂时不可用，请刷新页面后重试');
        }
    }

    /**
     * Stop generation (abort current request)
     */
    function stopGeneration() {
        if (window.currentAbortController) {
            window.currentAbortController.abort();
            window.currentAbortController = null;

            // Remove loading message
            hideChatLoading();

            // Show stopped message
            appendMessage('ASSISTANT', '❌ 已停止生成', { isError: false });
        }
    }

    /**
     * Edit user message
     */
    function editMessage(button) {
        const messageElement = button.closest('.message');
        if (!messageElement) {
            console.error('[editMessage] Cannot find message element');
            return;
        }

        const content = button.getAttribute('data-content');

        if (!content) {
            console.error('[editMessage] No data-content attribute found');
            Toast.error('无法获取消息内容，请刷新页面后重试');
            return;
        }

        const decodedContent = new DOMParser().parseFromString(content, 'text/html').body.textContent;

        // Put content back in input
        const input = document.getElementById('chatInput');
        if (input) {
            input.value = decodedContent;
            input.focus();
            // Auto-resize
            input.style.height = 'auto';
            input.style.height = Math.min(input.scrollHeight, 200) + 'px';
        } else {
            console.error('[editMessage] Cannot find input element');
            return;
        }

        // Remove this message and all subsequent messages
        let currentElement = messageElement;
        const toRemove = [];
        while (currentElement) {
            toRemove.push(currentElement);
            currentElement = currentElement.nextElementSibling;
        }
        toRemove.forEach(el => el.remove());
    }

    /**
     * Delete a message
     */
    async function deleteMessage(button) {
        const messageElement = button.closest('.message');
        if (!messageElement) return;

        if (!confirm('确定要删除这条消息吗？')) {
            return;
        }

        const messageId = messageElement.getAttribute('data-message-id');

        // If message has ID (from database), delete from backend first
        if (messageId) {
            try {
                const response = await fetch(`/api/sessions/messages/${messageId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text().catch(() => response.statusText);
                    throw new Error(`服务器返回错误 ${response.status}: ${errorText}`);
                }

                // Only remove from UI after backend success
                messageElement.remove();

                // Check if chat is empty
                const chatDisplay = document.getElementById('chatMessagesDisplay');
                if (chatDisplay && chatDisplay.children.length === 0) {
                    chatDisplay.innerHTML = `<div class="no-messages" data-i18n="ui.chat.noMessages">开始新对话</div>`;
                }
            } catch (error) {
                console.error('[deleteMessage] Error:', error);
                Toast.error('删除失败: ' + error.message + '\n\n请刷新页面后重试');
                // Do not remove from UI on error - maintain consistency
            }
        } else {
            // No ID means this is a client-only message, safe to delete
            messageElement.remove();

            const chatDisplay = document.getElementById('chatMessagesDisplay');
            if (chatDisplay && chatDisplay.children.length === 0) {
                chatDisplay.innerHTML = `<div class="no-messages" data-i18n="ui.chat.noMessages">开始新对话</div>`;
            }
        }
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
        hideChatLoading,
        copyMessage,
        retryMessage,
        regenerateMessage,
        stopGeneration,
        editMessage,
        deleteMessage
    };
})();
