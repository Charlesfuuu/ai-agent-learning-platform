/**
 * Session Management Module
 * Handles all session-related operations: create, switch, delete, load
 */
const SessionManager = (function() {
    let currentSessionId = null;
    let sessions = [];

    const API_BASE = '/api/sessions';

    /**
     * Initialize session manager
     */
    async function init() {
        await loadSessions();

        // Create initial session if none exist
        if (sessions.length === 0) {
            await createNewSession();
        } else {
            // Switch to the most recent session
            await switchToSession(sessions[0].sessionId);
        }
    }

    /**
     * Load all sessions from the backend
     */
    async function loadSessions() {
        try {
            const response = await fetch(API_BASE);
            if (!response.ok) throw new Error('Failed to load sessions');

            sessions = await response.json();
            renderSessionList();
        } catch (error) {
            console.error('Error loading sessions:', error);
            sessions = [];
        }
    }

    /**
     * Create a new session
     */
    async function createNewSession() {
        try {
            const response = await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error('Failed to create session');

            const newSession = await response.json();

            // Reload all sessions from server to ensure consistency
            await loadSessions();

            // Switch to the new session
            await switchToSession(newSession.sessionId);

            // Close sidebar on mobile after creating session
            if (window.innerWidth <= 768) {
                UIController.closeSidebar();
            }
        } catch (error) {
            console.error('Error creating session:', error);
            alert(I18n.translate('ui.sessions.createError'));
        }
    }

    /**
     * Switch to a different session
     */
    async function switchToSession(sessionId) {
        currentSessionId = sessionId;
        updateActiveSession(sessionId);
        await loadSessionMessages(sessionId);

        // Close sidebar on mobile after switching
        if (window.innerWidth <= 768) {
            UIController.closeSidebar();
        }
    }

    /**
     * Delete a session
     */
    async function deleteSession(sessionId) {
        if (sessions.length === 1) {
            alert(I18n.translate('ui.sessions.cannotDeleteLast'));
            return;
        }

        const confirmed = confirm(I18n.translate('ui.sessions.confirmDelete'));
        if (!confirmed) return;

        try {
            const response = await fetch(`${API_BASE}/${sessionId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete session');

            // Remove from local array
            sessions = sessions.filter(s => s.sessionId !== sessionId);
            renderSessionList();

            // If we deleted the current session, switch to another
            if (sessionId === currentSessionId) {
                if (sessions.length > 0) {
                    await switchToSession(sessions[0].sessionId);
                } else {
                    await createNewSession();
                }
            }
        } catch (error) {
            console.error('Error deleting session:', error);
            alert(I18n.translate('ui.sessions.deleteError'));
        }
    }

    /**
     * Load messages for a session
     */
    async function loadSessionMessages(sessionId) {
        try {
            const response = await fetch(`${API_BASE}/${sessionId}/messages`);
            if (!response.ok) {
                // Session might be new with no messages yet
                UIController.clearChatDisplay();
                return;
            }

            const messages = await response.json();
            UIController.displayMessages(messages);
        } catch (error) {
            console.error('Error loading messages:', error);
            UIController.clearChatDisplay();
        }
    }

    /**
     * Render the session list in the sidebar
     */
    function renderSessionList() {
        const container = document.getElementById('sessionList');
        if (!container) return;

        if (sessions.length === 0) {
            container.innerHTML = `<div class="session-empty" data-i18n="ui.sessions.empty">${I18n.translate('ui.sessions.empty')}</div>`;
            return;
        }

        // Group sessions by time
        const grouped = groupSessionsByTime(sessions);

        let html = '';
        for (const [groupName, groupSessions] of Object.entries(grouped)) {
            html += `<div class="session-group">`;
            html += `<div class="session-group-title" data-i18n="ui.sessions.${groupName}">${I18n.translate(`ui.sessions.${groupName}`)}</div>`;

            for (const session of groupSessions) {
                const isActive = session.sessionId === currentSessionId;
                html += `
                    <div class="session-item ${isActive ? 'active' : ''}" data-session-id="${session.sessionId}">
                        <div class="session-item-content" onclick="SessionManager.switchToSession('${session.sessionId}')">
                            <div class="session-title">${escapeHtml(session.title)}</div>
                            <div class="session-time">${formatTime(session.updatedAt)}</div>
                        </div>
                        <button class="session-delete"
                                onclick="event.stopPropagation(); SessionManager.deleteSession('${session.sessionId}')"
                                title="${I18n.translate('ui.sessions.delete')}">
                            🗑️
                        </button>
                    </div>
                `;
            }
            html += `</div>`;
        }

        container.innerHTML = html;
    }

    /**
     * Group sessions by time periods
     */
    function groupSessionsByTime(sessions) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const groups = {
            today: [],
            yesterday: [],
            last7days: [],
            last30days: [],
            older: []
        };

        for (const session of sessions) {
            const sessionDate = new Date(session.updatedAt);

            if (sessionDate >= today) {
                groups.today.push(session);
            } else if (sessionDate >= yesterday) {
                groups.yesterday.push(session);
            } else if (sessionDate >= sevenDaysAgo) {
                groups.last7days.push(session);
            } else if (sessionDate >= thirtyDaysAgo) {
                groups.last30days.push(session);
            } else {
                groups.older.push(session);
            }
        }

        // Remove empty groups
        return Object.fromEntries(
            Object.entries(groups).filter(([_, sessions]) => sessions.length > 0)
        );
    }

    /**
     * Update active session styling
     */
    function updateActiveSession(sessionId) {
        document.querySelectorAll('.session-item').forEach(item => {
            if (item.dataset.sessionId === sessionId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    /**
     * Format timestamp for display
     */
    function formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);

        if (diffMins < 1) return I18n.translate('ui.sessions.justNow');
        if (diffMins < 60) return `${diffMins}${I18n.translate('ui.sessions.minutesAgo')}`;
        if (diffHours < 24) return `${diffHours}${I18n.translate('ui.sessions.hoursAgo')}`;

        return date.toLocaleDateString(I18n.getLocale() === 'zh-CN' ? 'zh-CN' : 'en-US', {
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Get current session ID
     */
    function getCurrentSessionId() {
        return currentSessionId;
    }

    /**
     * Refresh session list (call after sending a message)
     */
    async function refreshSessions() {
        await loadSessions();
    }

    // Public API
    return {
        init,
        createNewSession,
        switchToSession,
        deleteSession,
        getCurrentSessionId,
        refreshSessions,
        renderSessionList
    };
})();
