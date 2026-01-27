/**
 * Toast 提示组件 - 非阻塞式消息提示
 * 用于替代 alert() 提供更好的用户体验
 */
const Toast = (function() {
    'use strict';

    // Toast 类型配置
    const TYPES = {
        success: {
            icon: '✓',
            className: 'toast-success',
            duration: 3000
        },
        error: {
            icon: '✕',
            className: 'toast-error',
            duration: 5000
        },
        info: {
            icon: 'ℹ',
            className: 'toast-info',
            duration: 3000
        },
        warning: {
            icon: '⚠',
            className: 'toast-warning',
            duration: 4000
        }
    };

    /**
     * 显示 Toast 消息
     * @param {string} message - 消息内容
     * @param {string} type - 消息类型 (success/error/info/warning)
     * @param {number} duration - 显示时长（毫秒），0 表示不自动关闭
     */
    function show(message, type = 'info', duration = null) {
        const config = TYPES[type] || TYPES.info;
        const actualDuration = duration !== null ? duration : config.duration;

        // 创建 Toast 容器（如果不存在）
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        // 创建 Toast 元素
        const toast = document.createElement('div');
        toast.className = `toast ${config.className}`;
        toast.innerHTML = `
            <span class="toast-icon">${config.icon}</span>
            <span class="toast-message">${escapeHtml(message)}</span>
            <button class="toast-close" aria-label="关闭">×</button>
        `;

        // 添加关闭按钮事件
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            removeToast(toast);
        });

        // 添加到容器
        container.appendChild(toast);

        // 触发进入动画
        setTimeout(() => {
            toast.classList.add('toast-show');
        }, 10);

        // 自动关闭
        if (actualDuration > 0) {
            setTimeout(() => {
                removeToast(toast);
            }, actualDuration);
        }

        return toast;
    }

    /**
     * 移除 Toast
     */
    function removeToast(toast) {
        if (!toast || !toast.parentElement) return;

        toast.classList.remove('toast-show');
        toast.classList.add('toast-hide');

        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }

            // 如果容器为空，移除容器
            const container = document.getElementById('toast-container');
            if (container && container.children.length === 0) {
                container.remove();
            }
        }, 300);
    }

    /**
     * HTML 转义
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 显示成功消息
     */
    function success(message, duration) {
        return show(message, 'success', duration);
    }

    /**
     * 显示错误消息
     */
    function error(message, duration) {
        return show(message, 'error', duration);
    }

    /**
     * 显示信息消息
     */
    function info(message, duration) {
        return show(message, 'info', duration);
    }

    /**
     * 显示警告消息
     */
    function warning(message, duration) {
        return show(message, 'warning', duration);
    }

    // 公共 API
    return {
        show,
        success,
        error,
        info,
        warning
    };
})();
