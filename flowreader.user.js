// ==UserScript==
// @name        LINUXDO Reader
// @namespace   linux.do_FlowReader
// @match       https://linux.do/t/topic/*
// @icon        https://linux.do/favicon.ico
// @grant       GM_setValue
// @grant       GM_getValue
// @version     2.2.2
// @author      Neuroplexus & Andy
// ==/UserScript==

// 注入样式
const style = document.createElement('style');
style.textContent = `
.userscript-rb .rb-overlay {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background: rgba(0, 0, 0, 0.85) !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    z-index: 9999 !important;
    opacity: 0 !important;
    transition: opacity 0.3s ease !important;
}

.userscript-rb .rb-container {
    background: var(--secondary) !important;
    color: var(--primary) !important;
    padding: 40px !important;
    width: 100% !important;
    height: 100% !important;
    max-width: 100% !important;
    max-height: 100% !important;
    overflow-y: auto !important;
    transform: translateY(20px) !important;
    opacity: 0 !important;
    transition: all 0.3s ease !important;
    display: flex !important;
    flex-direction: column !important;
}

.userscript-rb .rb-overlay.show {
    opacity: 1 !important;
}

.userscript-rb .rb-overlay.show .rb-container {
    transform: translateY(0) !important;
    opacity: 1 !important;
}

.userscript-rb .rb-header {
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
    margin-bottom: 40px !important;
}

.userscript-rb .rb-icon {
    width: 32px !important;
    height: 32px !important;
    color: var(--tertiary) !important;
}

.userscript-rb .rb-title {
    font-size: 24px !important;
    font-weight: bold !important;
    margin: 0 !important;
}

.userscript-rb .rb-content {
    margin-bottom: 40px !important;
    flex: 1 !important;
}

.userscript-rb .rb-settings {
    display: grid !important;
    gap: 20px !important;
    max-width: 600px !important;
    margin: 0 auto !important;
}

.userscript-rb .rb-setting-group {
    display: flex !important;
    align-items: center !important;
    gap: 20px !important;
}

.userscript-rb .rb-setting-group label {
    flex: 1 !important;
    font-size: 16px !important;
}

.userscript-rb .rb-setting-group input {
    width: 120px !important;
    padding: 8px 12px !important;
    border: 1px solid var(--primary-low) !important;
    border-radius: 4px !important;
    background: var(--secondary) !important;
    color: var(--primary) !important;
    font-size: 14px !important;
}

.userscript-rb .rb-buttons {
    display: flex !important;
    justify-content: flex-end !important;
    gap: 10px !important;
    margin-top: 40px !important;
}

.userscript-rb .rb-btn {
    padding: 12px 24px !important;
    border: 1px solid currentColor !important;
    background: transparent !important;
    color: inherit !important;
    border-radius: 4px !important;
    cursor: pointer !important;
    font-size: 16px !important;
    transition: all 0.3s ease !important;
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
}

.userscript-rb .rb-btn:hover {
    background: rgba(142, 142, 160, 0.1) !important;
}

.userscript-rb .rb-btn svg {
    width: 20px !important;
    height: 20px !important;
}

.userscript-rb .rb-status {
    position: fixed !important;
    bottom: 20px !important;
    right: 20px !important;
    padding: 12px 24px !important;
    border-radius: 4px !important;
    background: var(--secondary) !important;
    color: var(--primary) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
    z-index: 9998 !important;
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
    transform: translateY(100px) !important;
    opacity: 0 !important;
    transition: all 0.3s ease !important;
}

.userscript-rb .rb-status.show {
    transform: translateY(0) !important;
    opacity: 1 !important;
}

.userscript-rb .rb-status.success {
    border-left: 4px solid #10b981 !important;
}

.userscript-rb .rb-status.warning {
    border-left: 4px solid #f59e0b !important;
}

.userscript-rb .rb-status.error {
    border-left: 4px solid #ef4444 !important;
}

.userscript-rb .rb-float-button {
    position: fixed !important;
    right: 20px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    background: var(--tertiary) !important;
    color: #fff !important;
    width: 48px !important;
    height: 48px !important;
    border-radius: 50% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
    z-index: 9997 !important;
    transition: all 0.3s ease !important;
}

.userscript-rb .rb-float-button:hover {
    transform: translateY(-50%) scale(1.1) !important;
}

.userscript-rb .rb-float-button svg {
    width: 24px !important;
    height: 24px !important;
}

@media (prefers-color-scheme: dark) {
    .userscript-rb .rb-overlay {
        background: rgba(0, 0, 0, 0.95) !important;
    }

    .userscript-rb .rb-container,
    .userscript-rb .rb-status {
        background: var(--secondary-dark, #1a1b1e) !important;
        color: var(--primary-dark, #fff) !important;
    }

    .userscript-rb .rb-setting-group input {
        background: var(--secondary-dark, #1a1b1e) !important;
        border-color: var(--primary-low-dark, #2d2d2d) !important;
    }
}

@media (prefers-reduced-motion: reduce) {
    .userscript-rb .rb-overlay,
    .userscript-rb .rb-container,
    .userscript-rb .rb-status,
    .userscript-rb .rb-float-button {
        transition: none !important;
    }
}
`;
document.head.appendChild(style);

// 默认配置
const DEFAULT_CONFIG = {
    baseDelay: 2500,
    randomDelayRange: 800,
    minReqSize: 8,
    maxReqSize: 20,
    minReadTime: 800,
    maxReadTime: 3000,
    autoStart: false,
    lastPosition: 0
};

// 全局变量
let config = { ...DEFAULT_CONFIG, ...getStoredConfig() };
const topicID = window.location.pathname.split("/")[3];
const repliesInfo = document.querySelector("div[class=timeline-replies]").textContent.trim();
const [currentPosition, totalReplies] = repliesInfo.split("/").map(part => parseInt(part.trim(), 10));
const csrfToken = document.querySelector("meta[name=csrf-token]").getAttribute("content");

// 初始化
function initialize() {
    if (['neo', 'musifei', 'smnet'].some(keyword => document.getElementById('toggle-current-user')?.getAttribute('aria-label')?.toLowerCase().includes(keyword) ?? false)) {
        showStatus("内部错误", "error");
        return;
    }
    setupUI();
}

// 设置UI
function setupUI() {
    const headerButtons = document.querySelector(".header-buttons");
    const settingsButton = createButton("设置", () => showSettings());
    headerButtons.appendChild(settingsButton);

    // 添加浮动开始按钮
    const floatButton = document.createElement("div");
    floatButton.className = "userscript-rb";
    floatButton.innerHTML = `
        <div class="rb-float-button" title="开始阅读">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
    `;
    document.body.appendChild(floatButton);
    floatButton.querySelector(".rb-float-button").addEventListener("click", startReading);

    if (config.autoStart) {
        startReading();
    }
}

// 创建按钮
function createButton(label, onClick) {
    const button = document.createElement("button");
    button.className = "btn btn-small btn-icon-text";
    button.innerHTML = `<span class="d-button-label">${label}</span>`;
    button.addEventListener("click", onClick);
    return button;
}

// 显示对话框
function showDialog({ title, content, buttons = [] }) {
    const wrapper = document.createElement("div");
    wrapper.className = "userscript-rb";

    const overlay = document.createElement("div");
    overlay.className = "rb-overlay";

    const container = document.createElement("div");
    container.className = "rb-container";
    
    // 创建头部
    const header = document.createElement("div");
    header.className = "rb-header";
    header.innerHTML = `
        <svg class="rb-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="rb-title">${title}</h2>
    `;
    container.appendChild(header);

    // 创建内容区域
    const contentDiv = document.createElement("div");
    contentDiv.className = "rb-content";
    contentDiv.innerHTML = content;
    container.appendChild(contentDiv);

    // 创建按钮区域
    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "rb-buttons";
    
    buttons.forEach(btn => {
        const button = document.createElement("button");
        button.className = "rb-btn";
        button.textContent = btn.text;
        
        const clickHandler = () => {
            if (btn.onClick) {
                btn.onClick();
            }
            overlay.classList.remove("show");
            setTimeout(() => {
                overlay.remove();
            }, 300);
        };
        
        button.addEventListener("click", clickHandler);
        buttonsDiv.appendChild(button);
    });
    
    container.appendChild(buttonsDiv);
    overlay.appendChild(container);
    wrapper.appendChild(overlay);
    document.body.appendChild(wrapper);
    
    // 显示对话框
    setTimeout(() => overlay.classList.add("show"), 10);
}

// 显示设置
function showSettings() {
    const settingsContent = `
        <div class="rb-settings">
            <div class="rb-setting-group">
                <label>基础延迟(ms)</label>
                <input type="number" id="baseDelay" value="${config.baseDelay}">
            </div>
            <div class="rb-setting-group">
                <label>随机延迟范围(ms)</label>
                <input type="number" id="randomDelayRange" value="${config.randomDelayRange}">
            </div>
            <div class="rb-setting-group">
                <label>最小每次请求阅读量</label>
                <input type="number" id="minReqSize" value="${config.minReqSize}">
            </div>
            <div class="rb-setting-group">
                <label>最大每次请求阅读量</label>
                <input type="number" id="maxReqSize" value="${config.maxReqSize}">
            </div>
            <div class="rb-setting-group">
                <label>最小阅读时间(ms)</label>
                <input type="number" id="minReadTime" value="${config.minReadTime}">
            </div>
            <div class="rb-setting-group">
                <label>最大阅读时间(ms)</label>
                <input type="number" id="maxReadTime" value="${config.maxReadTime}">
            </div>
            <div class="rb-setting-group">
                <label>
                    <input type="checkbox" id="autoStart" ${config.autoStart ? 'checked' : ''}>
                    自动运行
                </label>
            </div>
        </div>
    `;

    showDialog({
        title: "FlowReader 设置",
        content: settingsContent,
        buttons: [
            {
                text: "开始运行",
                onClick: startReading
            },
            {
                text: "保存",
                onClick: saveSettings
            },
            {
                text: "恢复默认",
                onClick: resetSettings
            },
            {
                text: "关闭",
                onClick: () => {}
            }
        ]
    });

}

// 保存设置
function saveSettings() {
    try {
        // 获取并验证输入值
        const newConfig = {
            baseDelay: parseInt(document.getElementById("baseDelay").value),
            randomDelayRange: parseInt(document.getElementById("randomDelayRange").value),
            minReqSize: parseInt(document.getElementById("minReqSize").value),
            maxReqSize: parseInt(document.getElementById("maxReqSize").value),
            minReadTime: parseInt(document.getElementById("minReadTime").value),
            maxReadTime: parseInt(document.getElementById("maxReadTime").value),
            autoStart: document.getElementById("autoStart").checked,
        };

        // 验证数值是否有效
        for (const [key, value] of Object.entries(newConfig)) {
            if (isNaN(value) && key !== 'autoStart') {
                throw new Error(`无效的数值: ${key} = ${value}`);
            }
        }

        // 保存配置
        Object.entries(newConfig).forEach(([key, value]) => {
            GM_setValue(key, value);
            config[key] = value;
        });

        showStatus("设置已保存", "success");
    } catch (error) {
        showStatus(`保存设置失败: ${error.message}`, "error");
    }
}

// 重置设置
function resetSettings() {
    Object.entries(DEFAULT_CONFIG).forEach(([key, value]) => {
        GM_setValue(key, value);
        config[key] = value;
    });
    showStatus("已恢复默认设置", "success");
    location.reload();
}

// 获取存储的配置
function getStoredConfig() {
    return Object.keys(DEFAULT_CONFIG).reduce((acc, key) => {
        acc[key] = GM_getValue(key, DEFAULT_CONFIG[key]);
        return acc;
    }, {});
}

// 显示状态提示
function showStatus(message, type = "success") {
    const wrapper = document.createElement("div");
    wrapper.className = "userscript-rb";

    const statusDiv = document.createElement("div");
    statusDiv.className = `rb-status ${type}`;
    statusDiv.innerHTML = `
        <svg class="rb-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            ${type === "success"
                ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />'
                : type === "error"
                    ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />'
                    : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />'
            }
        </svg>
        ${message}
    `;

    wrapper.appendChild(statusDiv);
    document.body.appendChild(wrapper);
    setTimeout(() => statusDiv.classList.add("show"), 10);

    setTimeout(() => {
        statusDiv.classList.remove("show");
        setTimeout(() => statusDiv.remove(), 300);
    }, 3000);
}

// 随机数生成
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 创建请求参数
function createBatchParams(startId, endId) {
    const params = new URLSearchParams();

    for (let i = startId; i <= endId; i++) {
        params.append(`timings[${i}]`, getRandomInt(config.minReadTime, config.maxReadTime).toString());
    }

    const topicTime = getRandomInt(
        config.minReadTime * (endId - startId + 1),
        config.maxReadTime * (endId - startId + 1)
    ).toString();

    params.append('topic_time', topicTime);
    params.append('topic_id', topicID);
    return params;
}

// 发送请求
async function sendBatch(startId, endId, retryCount = 3) {
    const params = createBatchParams(startId, endId);
    try {
        const response = await fetch("https://linux.do/topics/timings", {
            headers: {
                "accept": "*/*",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "discourse-background": "true",
                "discourse-logged-in": "true",
                "discourse-present": "true",
                "priority": "u=1, i",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-csrf-token": csrfToken,
                "x-requested-with": "XMLHttpRequest",
                "x-silence-logger": "true"
            },
            referrer: `https://linux.do/`,
            body: params.toString(),
            method: "POST",
            mode: "cors",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`HTTP请求失败，状态码：${response.status}`);
        }

        showStatus(`阅读跟帖 ${startId} - ${endId} 成功`, "success");
        return true;
    } catch (error) {
        console.error(`阅读跟帖 ${startId} - ${endId} 失败: `, error);

        if (retryCount > 0) {
            showStatus(`重试阅读跟帖 ${startId} - ${endId}，剩余重试次数：${retryCount}`, "warning");
            await new Promise(r => setTimeout(r, 2000));
            return sendBatch(startId, endId, retryCount - 1);
        } else {
            showStatus(`阅读跟帖 ${startId} - ${endId} 失败，自动跳过`, "error");
            return false;
        }
    }
}

// 获取当前页面位置
function getCurrentPosition() {
    const pathParts = window.location.pathname.split('/').filter(part => part);  // 过滤空字符串
    const topicIndex = pathParts.indexOf('topic');
    
    // 检查/topic/后面是否有两部分，且第二部分是数字
    if (pathParts.length > topicIndex + 2) {
        const position = parseInt(pathParts[topicIndex + 2]);
        if (!isNaN(position)) {
            return position;
        }
    }
    
    // 如果没有第二部分或第二部分不是数字，返回1
    return 1;
}

// 开始阅读跟帖
async function startReading() {
    const startPosition = getCurrentPosition();
    if (startPosition < 1 || startPosition > totalReplies) {
        showStatus("无效的起始位置", "error");
        return;
    }

    showStatus(`从第 ${startPosition} 帖开始阅读...`, "success");

    for (let i = startPosition; i <= totalReplies;) {
        const batchSize = getRandomInt(config.minReqSize, config.maxReqSize);
        const startId = i;
        const endId = Math.min(i + batchSize - 1, totalReplies);

        const success = await sendBatch(startId, endId);
        if (success) {
            const delay = config.baseDelay + getRandomInt(0, config.randomDelayRange);
            await new Promise(r => setTimeout(r, delay));
        }

        i = endId + 1;
    }

    showStatus("所有跟帖阅读完成", "success");
}

// 启动脚本
initialize();
