// ==UserScript==
// @name        Multi-Forum Reader
// @namespace   multi_forum_Reader
// @match       https://linux.do/t/topic/*
// @match       https://idcflare.com/t/topic/*
// @icon        https://linux.do/favicon.ico
// @grant       GM_setValue
// @grant       GM_getValue
// @version     2.3.0
// @author      Andy
// ==/UserScript==

// 样式文本
const STYLE_TEXT = `
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
    top: 33.33% !important;
    transform: translateY(0) !important;
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
    transform: scale(1.1) !important;
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

const SETTINGS_MOUNT_SELECTORS = [
    ".header-buttons",
    ".timeline-controls",
    ".timeline-footer-controls"
];

const SCRIPT_UI_SELECTORS = [
    '[data-flowreader-role="settings-button"]',
    '[data-flowreader-role="float-button-wrapper"]'
];

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
let config = { ...DEFAULT_CONFIG };
let currentDomain = "";
let currentProtocol = "";
let topicID = "";
let pageContext = null;
const runtimeState = {
    lastRouteSignature: null,
    routeListenersInstalled: false,
    routeChangeTimer: null
};

function parseRepliesInfo(repliesInfo) {
    if (typeof repliesInfo !== "string") {
        return null;
    }

    const [currentPosition, totalReplies] = repliesInfo
        .split("/")
        .map(part => Number.parseInt(part.trim(), 10));

    if (!Number.isFinite(currentPosition) || !Number.isFinite(totalReplies)) {
        return null;
    }

    return { currentPosition, totalReplies };
}

function resolveSettingsMountPoint(doc = document) {
    for (const selector of SETTINGS_MOUNT_SELECTORS) {
        const mountPoint = doc.querySelector(selector);
        if (mountPoint) {
            return mountPoint;
        }
    }

    return null;
}

function getTopicID(pathname) {
    return pathname.split("/")[3] ?? "";
}

function getRouteSignature(locationLike = window.location) {
    const pathname = locationLike?.pathname ?? "";
    if (!pathname.startsWith("/t/topic/")) {
        return null;
    }

    const currentTopicID = getTopicID(pathname);
    if (!currentTopicID) {
        return null;
    }

    return `topic:${currentTopicID}`;
}

function getPageContext(doc = document, locationLike = window.location) {
    const repliesElement = doc.querySelector(".timeline-replies");
    const csrfTokenElement = doc.querySelector('meta[name="csrf-token"]');
    const parsedReplies = parseRepliesInfo(repliesElement?.textContent?.trim() ?? "");
    const csrfToken = csrfTokenElement?.getAttribute("content") ?? "";

    if (!parsedReplies || !csrfToken) {
        return null;
    }

    return {
        ...parsedReplies,
        csrfToken,
        topicID: getTopicID(locationLike.pathname ?? "")
    };
}

function injectStyles(doc = document) {
    if (doc.getElementById("flowreader-style")) {
        return;
    }

    const style = doc.createElement("style");
    style.id = "flowreader-style";
    style.textContent = STYLE_TEXT;
    doc.head.appendChild(style);
}

function syncRuntimeState() {
    currentDomain = window.location.hostname;
    currentProtocol = window.location.protocol;
    topicID = getTopicID(window.location.pathname);
    pageContext = getPageContext();
    return pageContext;
}

function waitForPageContext(timeout = 10000, interval = 250) {
    return new Promise((resolve, reject) => {
        const startedAt = Date.now();

        const tryResolve = () => {
            const context = syncRuntimeState();
            if (context) {
                resolve(context);
                return;
            }

            if (Date.now() - startedAt >= timeout) {
                reject(new Error("未找到时间轴或 CSRF 信息"));
                return;
            }

            setTimeout(tryResolve, interval);
        };

        tryResolve();
    });
}

function cleanupScriptUI(doc = document) {
    for (const selector of SCRIPT_UI_SELECTORS) {
        doc.querySelectorAll(selector).forEach(node => node.remove());
    }
}

async function handleRouteChange(state = runtimeState, options = {}) {
    const locationLike = options.locationLike ?? window.location;
    const nextRouteSignature = getRouteSignature(locationLike);
    const cleanupUI = options.cleanupUI ?? cleanupScriptUI;
    const targetDocument = options.doc ?? (typeof document !== "undefined" ? document : undefined);

    if (!nextRouteSignature) {
        cleanupUI(targetDocument);
        state.lastRouteSignature = null;
        return false;
    }

    if (state.lastRouteSignature === nextRouteSignature) {
        return false;
    }

    await (options.waitForContext ?? waitForPageContext)();
    const latestContext = (options.syncState ?? syncRuntimeState)();
    if (!latestContext) {
        return false;
    }

    cleanupUI(targetDocument);
    (options.setupUI ?? setupUI)();
    state.lastRouteSignature = nextRouteSignature;

    if ((options.config ?? config).autoStart) {
        await (options.startReading ?? startReading)();
    }

    return true;
}

function scheduleRouteChangeCheck() {
    if (runtimeState.routeChangeTimer) {
        clearTimeout(runtimeState.routeChangeTimer);
    }

    runtimeState.routeChangeTimer = setTimeout(() => {
        handleRouteChange().catch(error => {
            console.error("FlowReader 路由切换处理失败：", error);
        });
    }, 150);
}

function installRouteChangeListeners() {
    if (runtimeState.routeListenersInstalled) {
        return;
    }

    const notifyRouteChange = () => {
        scheduleRouteChangeCheck();
    };

    for (const methodName of ["pushState", "replaceState"]) {
        const originalMethod = window.history[methodName];
        window.history[methodName] = function (...args) {
            const result = originalMethod.apply(this, args);
            notifyRouteChange();
            return result;
        };
    }

    window.addEventListener("popstate", notifyRouteChange);
    runtimeState.routeListenersInstalled = true;
}

// 初始化
async function initialize() {
    if (['neo', 'musifei', 'smnet'].some(keyword => document.getElementById('toggle-current-user')?.getAttribute('aria-label')?.toLowerCase().includes(keyword) ?? false)) {
        showStatus("内部错误", "error");
        return;
    }

    try {
        await handleRouteChange();
    } catch (error) {
        console.error("FlowReader 初始化失败：", error);
    }
}

// 设置UI
function setupUI() {
    if (document.querySelector('[data-flowreader-role="float-button-wrapper"]')) {
        return;
    }

    const settingsMountPoint = resolveSettingsMountPoint();
    if (settingsMountPoint) {
        const settingsButton = createButton("设置", () => showSettings());
        settingsButton.dataset.flowreaderRole = "settings-button";
        settingsMountPoint.appendChild(settingsButton);
    }

    // 添加浮动开始按钮
    const floatButton = document.createElement("div");
    floatButton.className = "userscript-rb";
    floatButton.dataset.flowreaderRole = "float-button-wrapper";
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
        title: `FlowReader 设置 (${currentDomain})`,
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
    if (typeof GM_getValue !== "function") {
        return {};
    }

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
    params.append('topic_id', pageContext?.topicID ?? topicID);
    return params;
}

// 发送请求
async function sendBatch(startId, endId, retryCount = 3) {
    const params = createBatchParams(startId, endId);
    try {
        const response = await fetch(`${currentProtocol}//${currentDomain}/topics/timings`, {
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
                "x-csrf-token": pageContext?.csrfToken ?? "",
                "x-requested-with": "XMLHttpRequest",
                "x-silence-logger": "true"
            },
            referrer: `${currentProtocol}//${currentDomain}/`,
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

// 开始阅读跟帖
async function startReading() {
    const latestContext = syncRuntimeState();
    if (!latestContext) {
        showStatus("未找到时间轴信息，暂时无法开始阅读", "error");
        return;
    }

    showStatus(`从第 ${latestContext.currentPosition} 帖开始阅读...`, "success");

    for (let i = latestContext.currentPosition; i <= latestContext.totalReplies;) {
        const batchSize = getRandomInt(config.minReqSize, config.maxReqSize);
        const startId = i;
        const endId = Math.min(i + batchSize - 1, latestContext.totalReplies);

        const success = await sendBatch(startId, endId);
        if (success) {
            const delay = config.baseDelay + getRandomInt(0, config.randomDelayRange);
            await new Promise(r => setTimeout(r, delay));
        }

        i = endId + 1;
    }

    showStatus("所有跟帖阅读完成", "success");
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        cleanupScriptUI,
        getRouteSignature,
        getPageContext,
        handleRouteChange,
        parseRepliesInfo,
        resolveSettingsMountPoint
    };
}

// 启动脚本
if (typeof window !== "undefined" && typeof document !== "undefined") {
    injectStyles();
    config = { ...DEFAULT_CONFIG, ...getStoredConfig() };
    syncRuntimeState();
    installRouteChangeListeners();
    initialize();
}
