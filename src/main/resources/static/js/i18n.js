/**
 * 轻量级 i18n 模块
 * 提供中英文切换功能，支持 localStorage 持久化
 */
const I18n = (function() {
    const STORAGE_KEY = 'app-language';
    const DEFAULT_LOCALE = 'zh-CN';

    // 翻译字典
    const translations = {
        'zh-CN': {
            'ui.title': 'AI Agent 学习助手',
            'ui.chat.header': '💬 对话学习',
            'ui.chat.placeholder': '输入你的问题...',
            'ui.chat.sendButton': '发送',
            'ui.chat.thinking': '思考中...',
            'ui.chat.error': '错误: ',
            'ui.chat.noMessages': '暂无消息',
            'ui.chat.you': '你',
            'ui.chat.assistant': 'AI助手',
            'ui.codereview.header': '🔍 代码审查',
            'ui.codereview.placeholder': '粘贴你的 Java 代码...',
            'ui.codereview.reviewButton': '审查代码',
            'ui.codereview.analyzing': '分析中...',
            'ui.codereview.error': '错误: ',
            'ui.alert.emptyQuestion': '请输入问题',
            'ui.alert.emptyCode': '请输入代码',
            'ui.language.label': '语言',
            'ui.language.chinese': '中文',
            'ui.language.english': 'English',
            'ui.export': '导出',
            'ui.sessions.header': '对话历史',
            'ui.sessions.newButton': '新建对话',
            'ui.sessions.empty': '暂无对话',
            'ui.sessions.delete': '删除',
            'ui.sessions.confirmDelete': '确定删除这个对话吗？',
            'ui.sessions.cannotDeleteLast': '不能删除最后一个对话',
            'ui.sessions.createError': '创建对话失败',
            'ui.sessions.deleteError': '删除对话失败',
            'ui.sessions.today': '今天',
            'ui.sessions.yesterday': '昨天',
            'ui.sessions.last7days': '最近7天',
            'ui.sessions.last30days': '最近30天',
            'ui.sessions.older': '更早',
            'ui.sessions.justNow': '刚刚',
            'ui.sessions.minutesAgo': '分钟前',
            'ui.sessions.hoursAgo': '小时前'
        },
        'en-US': {
            'ui.title': 'AI Agent Learning Assistant',
            'ui.chat.header': '💬 Chat & Learn',
            'ui.chat.placeholder': 'Enter your question...',
            'ui.chat.sendButton': 'Send',
            'ui.chat.thinking': 'Thinking...',
            'ui.chat.error': 'Error: ',
            'ui.chat.noMessages': 'No messages yet',
            'ui.chat.you': 'You',
            'ui.chat.assistant': 'AI Assistant',
            'ui.codereview.header': '🔍 Code Review',
            'ui.codereview.placeholder': 'Paste your Java code here...',
            'ui.codereview.reviewButton': 'Review Code',
            'ui.codereview.analyzing': 'Analyzing...',
            'ui.codereview.error': 'Error: ',
            'ui.alert.emptyQuestion': 'Please enter a question',
            'ui.alert.emptyCode': 'Please enter code',
            'ui.language.label': 'Language',
            'ui.language.chinese': '中文',
            'ui.language.english': 'English',
            'ui.export': 'Export',
            'ui.sessions.header': 'Chat History',
            'ui.sessions.newButton': 'New Chat',
            'ui.sessions.empty': 'No conversations yet',
            'ui.sessions.delete': 'Delete',
            'ui.sessions.confirmDelete': 'Delete this conversation?',
            'ui.sessions.cannotDeleteLast': 'Cannot delete the last conversation',
            'ui.sessions.createError': 'Failed to create conversation',
            'ui.sessions.deleteError': 'Failed to delete conversation',
            'ui.sessions.today': 'Today',
            'ui.sessions.yesterday': 'Yesterday',
            'ui.sessions.last7days': 'Last 7 Days',
            'ui.sessions.last30days': 'Last 30 Days',
            'ui.sessions.older': 'Older',
            'ui.sessions.justNow': 'Just now',
            'ui.sessions.minutesAgo': ' min ago',
            'ui.sessions.hoursAgo': ' hrs ago'
        }
    };

    let currentLocale = DEFAULT_LOCALE;

    /**
     * 初始化 i18n 模块，从 localStorage 加载保存的语言
     */
    function init() {
        try {
            const savedLocale = localStorage.getItem(STORAGE_KEY);
            if (savedLocale && translations[savedLocale]) {
                currentLocale = savedLocale;
            }
        } catch (e) {
            console.warn('localStorage not available, using default locale');
        }
        return currentLocale;
    }

    /**
     * 获取当前语言
     */
    function getLocale() {
        return currentLocale;
    }

    /**
     * 设置语言并保存到 localStorage
     */
    function setLocale(locale) {
        if (!translations[locale]) {
            console.warn(`Locale ${locale} not supported, using default`);
            locale = DEFAULT_LOCALE;
        }
        currentLocale = locale;
        try {
            localStorage.setItem(STORAGE_KEY, locale);
        } catch (e) {
            console.warn('Failed to save locale to localStorage');
        }
    }

    /**
     * 根据 key 获取翻译文本
     */
    function translate(key) {
        const translation = translations[currentLocale][key];
        if (!translation) {
            console.warn(`Translation not found for key: ${key}`);
            return key;
        }
        return translation;
    }

    /**
     * 更新页面上所有标记了 data-i18n 的元素
     */
    function updatePageTranslations() {
        // 更新文本内容
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translatedText = translate(key);

            // 如果元素有 data-i18n-attr 属性，更新对应的属性
            const attrName = element.getAttribute('data-i18n-attr');
            if (attrName) {
                element.setAttribute(attrName, translatedText);
            } else {
                // 否则更新文本内容
                element.textContent = translatedText;
            }
        });

        // 更新 select option 的文本
        document.querySelectorAll('option[data-i18n]').forEach(option => {
            const key = option.getAttribute('data-i18n');
            option.textContent = translate(key);
        });
    }

    // 公开接口
    return {
        init: init,
        getLocale: getLocale,
        setLocale: setLocale,
        translate: translate,
        updatePageTranslations: updatePageTranslations
    };
})();
