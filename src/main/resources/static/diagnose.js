// 在浏览器 Console 中运行此脚本来诊断问题

console.log('=== 开始诊断重新生成功能 ===\n');

// 1. 检查 UIController
console.log('1. 检查 UIController:');
console.log('   - UIController 存在:', typeof UIController !== 'undefined');
console.log('   - regenerateMessage 方法:', typeof UIController?.regenerateMessage);

// 2. 检查按钮
console.log('\n2. 检查重新生成按钮:');
const regenButtons = document.querySelectorAll('.regenerate-btn');
console.log('   - 按钮数量:', regenButtons.length);

if (regenButtons.length > 0) {
    const firstBtn = regenButtons[0];
    console.log('   - 第一个按钮的 onclick:', firstBtn.getAttribute('onclick'));
    console.log('   - 按钮是否可见:', firstBtn.offsetParent !== null);
    console.log('   - 按钮 opacity:', window.getComputedStyle(firstBtn).opacity);
}

// 3. 检查用户消息属性
console.log('\n3. 检查用户消息属性:');
const userMsgs = document.querySelectorAll('.message.user');
console.log('   - 用户消息数量:', userMsgs.length);

userMsgs.forEach((msg, i) => {
    const hasAttr = msg.hasAttribute('data-user-message');
    const value = msg.getAttribute('data-user-message');
    console.log(`   - 消息 #${i+1}: ${hasAttr ? '✓' : '✗'} data-user-message ${value ? '(' + value.substring(0, 30) + '...)' : '(无值)'}`);
});

// 4. 检查 SessionManager
console.log('\n4. 检查 SessionManager:');
console.log('   - SessionManager 存在:', typeof SessionManager !== 'undefined');
console.log('   - getCurrentSessionId 方法:', typeof SessionManager?.getCurrentSessionId);
if (typeof SessionManager !== 'undefined' && typeof SessionManager.getCurrentSessionId === 'function') {
    console.log('   - 当前会话ID:', SessionManager.getCurrentSessionId());
}

// 5. 检查 sendChatWithData
console.log('\n5. 检查 sendChatWithData:');
console.log('   - 全局函数存在:', typeof window.sendChatWithData !== 'undefined');

// 6. 手动测试点击
console.log('\n6. 手动测试点击事件:');
if (regenButtons.length > 0) {
    console.log('   尝试手动触发第一个按钮的点击...');
    try {
        const btn = regenButtons[0];
        console.log('   - 获取消息元素...');
        const msgElement = btn.closest('.message');
        console.log('   - 消息元素:', msgElement ? '找到' : '未找到');

        if (msgElement) {
            console.log('   - 查找前一个用户消息...');
            let prevElement = msgElement.previousElementSibling;
            let foundUser = false;

            while (prevElement) {
                if (prevElement.classList.contains('user')) {
                    console.log('   - 找到用户消息');
                    const userMsg = prevElement.getAttribute('data-user-message');
                    console.log('   - data-user-message:', userMsg ? '有值 (' + userMsg.substring(0, 50) + '...)' : '无值 ⚠️');
                    foundUser = true;
                    break;
                }
                prevElement = prevElement.previousElementSibling;
            }

            if (!foundUser) {
                console.log('   - ⚠️ 未找到前一个用户消息');
            }
        }
    } catch (e) {
        console.error('   - 错误:', e.message);
    }
}

console.log('\n=== 诊断完成 ===');
console.log('如果发现问题，请将上述输出截图发送给开发者');
