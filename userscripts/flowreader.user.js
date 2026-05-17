// ==UserScript==
// @name        Multi-Forum Reader
// @namespace   multi_forum_Reader
// @match       https://linux.do/*
// @match       https://idcflare.com/t/topic/*
// @icon        https://linux.do/favicon.ico
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_download
// @version     2.6.0
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
    border: 0 !important;
    padding: 0 !important;
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

.userscript-rb .rb-fab-menu {
    position: fixed !important;
    right: 20px !important;
    top: calc(33.33% + 52px) !important;
    min-width: 148px !important;
    padding: 0 !important;
    border-radius: 999px !important;
    background: transparent !important;
    color: #fff !important;
    box-shadow: none !important;
    z-index: 9997 !important;
    opacity: 0 !important;
    pointer-events: none !important;
    transform: translateY(-8px) !important;
    transition: opacity 0.22s ease, transform 0.22s ease !important;
}

.userscript-rb.is-menu-open .rb-fab-menu {
    opacity: 1 !important;
    pointer-events: auto !important;
    transform: translateY(0) !important;
}

.userscript-rb .rb-fab-menu-item {
    width: 100% !important;
    min-height: 38px !important;
    padding: 0 14px !important;
    border: 0 !important;
    border-radius: 999px !important;
    background: var(--tertiary) !important;
    color: #fff !important;
    cursor: pointer !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    text-align: center !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
    transition: transform 0.2s ease, box-shadow 0.2s ease !important;
    transform: translateZ(0) !important;
    white-space: nowrap !important;
}

.userscript-rb .rb-fab-menu-item:hover,
.userscript-rb .rb-fab-menu-item:focus {
    transform: translateZ(0) scale(1.04) !important;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.24) !important;
    outline: none !important;
}

.userscript-rb .rb-fab-menu-item:active {
    transform: translateZ(0) scale(0.98) !important;
}

.userscript-rb .rb-home-main-topics-button {
    min-height: 38px !important;
    padding: 0 14px !important;
    border: 0 !important;
    border-radius: 999px !important;
    background: var(--tertiary) !important;
    color: #fff !important;
    cursor: pointer !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    text-align: center !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
    z-index: 9997 !important;
    transition: transform 0.2s ease, box-shadow 0.2s ease !important;
    transform: translateZ(0) !important;
    white-space: nowrap !important;
}

.userscript-rb .rb-home-main-topics-button:hover,
.userscript-rb .rb-home-main-topics-button:focus {
    transform: translateZ(0) scale(1.04) !important;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.24) !important;
    outline: none !important;
}

.userscript-rb .rb-home-main-topics-button:disabled {
    cursor: progress !important;
    opacity: 0.72 !important;
    transform: translateZ(0) !important;
}

.userscript-rb .rb-home-main-topics-wrapper {
    position: fixed !important;
    right: 20px !important;
    top: 33.33% !important;
    z-index: 9997 !important;
    display: grid !important;
    gap: 8px !important;
}

.userscript-rb .rb-home-main-topics-wrapper .rb-fab-menu {
    position: absolute !important;
    right: 0 !important;
    top: calc(100% + 8px) !important;
    min-width: 112px !important;
}

.userscript-rb .rb-home-reset-button {
    background: var(--secondary) !important;
    color: var(--primary) !important;
    border: 1px solid var(--primary-low) !important;
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
    .userscript-rb .rb-float-button,
    .userscript-rb .rb-fab-menu {
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
    '[data-flowreader-role="float-button-wrapper"]',
    '[data-flowreader-role="home-main-topics-wrapper"]',
    '[data-flowreader-role="home-main-topics-button"]',
    '[data-flowreader-role="home-main-topics-reset-button"]'
];

const MAIN_TOPIC_PROGRESS_KEY = "flowreader.mainTopicReadIds";
const MAIN_TOPIC_MAX_CONSECUTIVE_FAILURES = 3;
const MAIN_TOPIC_MAX_PROGRESS_IDS = 20000;

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
    routeChangeTimer: null,
    fabMenuOpenTimer: null,
    fabMenuCloseTimer: null
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

function isSupportedHomePage(locationLike = window.location) {
    const hostname = locationLike?.hostname ?? "";
    const pathname = locationLike?.pathname ?? "";
    return hostname === "linux.do" && (pathname === "/" || pathname === "/latest");
}

function getRouteSignature(locationLike = window.location) {
    const pathname = locationLike?.pathname ?? "";
    if (pathname.startsWith("/t/topic/")) {
        const currentTopicID = getTopicID(pathname);
        if (!currentTopicID) {
            return null;
        }

        return `topic:${currentTopicID}`;
    }

    if (isSupportedHomePage(locationLike)) {
        return `home:${pathname || "/"}`;
    }

    return null;
}

function canExportMarkdown(locationLike = window.location) {
    const hostname = locationLike?.hostname ?? "";
    const pathname = locationLike?.pathname ?? "";
    return hostname === "linux.do" && pathname.startsWith("/t/topic/") && Boolean(getTopicID(pathname));
}

function getCsrfToken(doc = document) {
    return doc.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ?? "";
}

function getPageContext(doc = document, locationLike = window.location) {
    const repliesElement = doc.querySelector(".timeline-replies");
    const parsedReplies = parseRepliesInfo(repliesElement?.textContent?.trim() ?? "");
    const csrfToken = getCsrfToken(doc);

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

function parseTopicUrl(href, baseUrl = window.location.href) {
    if (!href) {
        return null;
    }

    let topicUrl;
    try {
        topicUrl = new URL(href, baseUrl);
    } catch {
        return null;
    }

    if (topicUrl.hostname !== "linux.do") {
        return null;
    }

    const parts = topicUrl.pathname.split("/").filter(Boolean);
    if (parts[0] !== "t") {
        return null;
    }

    let topicId = parts[1] === "topic" ? parts[2] : "";
    if (!topicId) {
        for (let index = parts.length - 1; index > 0; index--) {
            if (/^\d+$/.test(parts[index])) {
                topicId = parts[index];
                break;
            }
        }
    }

    if (!topicId || !/^\d+$/.test(topicId)) {
        return null;
    }

    topicUrl.hash = "";
    return {
        id: topicId,
        url: topicUrl.toString()
    };
}

function collectHomeTopicItems(doc = document, locationLike = window.location) {
    const baseUrl = locationLike.href || `${locationLike.origin}${locationLike.pathname}`;
    const items = [];
    const seenTopicIds = new Set();

    for (const link of doc.querySelectorAll('a[href*="/t/"]')) {
        const parsed = parseTopicUrl(link.getAttribute("href") || link.href, baseUrl);
        if (!parsed || seenTopicIds.has(parsed.id)) {
            continue;
        }

        seenTopicIds.add(parsed.id);
        items.push({
            id: parsed.id,
            url: parsed.url,
            title: link.textContent?.trim() || link.getAttribute("title") || `topic-${parsed.id}`
        });
    }

    return items;
}

function normalizeMainTopicIdList(value, maxItems = MAIN_TOPIC_MAX_PROGRESS_IDS) {
    let parsedValue = value;
    if (typeof value === "string") {
        try {
            parsedValue = JSON.parse(value);
        } catch {
            parsedValue = value.split(",");
        }
    }

    if (!Array.isArray(parsedValue)) {
        return [];
    }

    const seen = new Set();
    const normalizedTopicIds = parsedValue
        .map(item => String(item).trim())
        .filter(item => /^\d+$/.test(item))
        .filter(item => {
            if (seen.has(item)) {
                return false;
            }

            seen.add(item);
            return true;
        });

    if (!Number.isFinite(maxItems) || maxItems <= 0) {
        return normalizedTopicIds;
    }

    return normalizedTopicIds.slice(-maxItems);
}

function getReadMainTopicIds(storageGetter = typeof GM_getValue === "function" ? GM_getValue : null) {
    if (!storageGetter) {
        return [];
    }

    return normalizeMainTopicIdList(storageGetter(MAIN_TOPIC_PROGRESS_KEY, "[]"));
}

function saveReadMainTopicIds(topicIds, storageSetter = typeof GM_setValue === "function" ? GM_setValue : null) {
    const normalizedTopicIds = normalizeMainTopicIdList(topicIds);
    if (storageSetter) {
        storageSetter(MAIN_TOPIC_PROGRESS_KEY, JSON.stringify(normalizedTopicIds));
    }

    return normalizedTopicIds;
}

function mergeReadMainTopicIds(topicIds, topicId, maxItems = MAIN_TOPIC_MAX_PROGRESS_IDS) {
    return normalizeMainTopicIdList([...normalizeMainTopicIdList(topicIds, maxItems), topicId], maxItems);
}

function filterUnreadHomeTopicItems(topics, readTopicIds) {
    const readTopicIdSet = new Set(normalizeMainTopicIdList(readTopicIds));
    return topics.filter(topic => !readTopicIdSet.has(String(topic.id)));
}

function getHomeBrowseButtonLabel(readCount = getReadMainTopicIds().length) {
    return readCount > 0 ? "FlowReader 继续浏览主帖" : "FlowReader 浏览主帖";
}

function shouldStopMainTopicBrowsing(consecutiveFailureCount, threshold = MAIN_TOPIC_MAX_CONSECUTIVE_FAILURES) {
    return consecutiveFailureCount >= threshold;
}

function setButtonLabel(button, label) {
    const buttonLabel = button?.querySelector(".d-button-label");
    if (buttonLabel) {
        buttonLabel.textContent = label;
        return;
    }

    if (button) {
        button.textContent = label;
    }
}

function resetMainTopicProgress() {
    const confirmImpl = typeof window !== "undefined" && typeof window.confirm === "function"
        ? window.confirm.bind(window)
        : null;
    if (confirmImpl && !confirmImpl("确定要清空主帖浏览进度吗？")) {
        return;
    }

    saveReadMainTopicIds([]);
    const button = document.querySelector('[data-flowreader-role="home-main-topics-button"]');
    setButtonLabel(button, getHomeBrowseButtonLabel(0));
    showStatus("主帖浏览进度已重置，已记录 0 个主帖", "success");
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
    clearTimeout(runtimeState.fabMenuOpenTimer);
    clearTimeout(runtimeState.fabMenuCloseTimer);

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

    const isTopicRoute = nextRouteSignature.startsWith("topic:");
    if (isTopicRoute) {
        await (options.waitForContext ?? waitForPageContext)();
        const latestContext = (options.syncState ?? syncRuntimeState)();
        if (!latestContext) {
            return false;
        }
    } else {
        (options.syncState ?? syncRuntimeState)();
    }

    cleanupUI(targetDocument);
    (options.setupUI ?? setupUI)();
    state.lastRouteSignature = nextRouteSignature;

    if (isTopicRoute && (options.config ?? config).autoStart) {
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

function setFabMenuOpen(wrapper, isOpen) {
    const trigger = wrapper.querySelector(".rb-float-button, .rb-home-main-topics-button");
    wrapper.classList.toggle("is-menu-open", isOpen);
    trigger?.setAttribute("aria-expanded", String(isOpen));
}

function scheduleFabMenuOpen(wrapper, delay = 500) {
    clearTimeout(runtimeState.fabMenuCloseTimer);
    clearTimeout(runtimeState.fabMenuOpenTimer);
    runtimeState.fabMenuOpenTimer = setTimeout(() => setFabMenuOpen(wrapper, true), delay);
}

function scheduleFabMenuClose(wrapper, delay = 180) {
    clearTimeout(runtimeState.fabMenuOpenTimer);
    clearTimeout(runtimeState.fabMenuCloseTimer);
    runtimeState.fabMenuCloseTimer = setTimeout(() => setFabMenuOpen(wrapper, false), delay);
}

function bindFabMenuInteractions(wrapper, trigger, menu) {
    if (!trigger || !menu) {
        return;
    }

    trigger.addEventListener("mouseenter", () => scheduleFabMenuOpen(wrapper));
    trigger.addEventListener("mouseleave", () => scheduleFabMenuClose(wrapper, 320));
    menu.addEventListener("mouseenter", () => {
        clearTimeout(runtimeState.fabMenuCloseTimer);
        setFabMenuOpen(wrapper, true);
    });
    menu.addEventListener("mouseleave", () => scheduleFabMenuClose(wrapper, 220));
    wrapper.addEventListener("mouseleave", () => scheduleFabMenuClose(wrapper));
    wrapper.addEventListener("focusin", () => setFabMenuOpen(wrapper, true));
    wrapper.addEventListener("focusout", event => {
        if (!wrapper.contains(event.relatedTarget)) {
            scheduleFabMenuClose(wrapper, 120);
        }
    });
    wrapper.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            setFabMenuOpen(wrapper, false);
            trigger.focus();
        }

        if (event.key === "ArrowDown" && document.activeElement === trigger) {
            event.preventDefault();
            setFabMenuOpen(wrapper, true);
            menu.querySelector(".rb-fab-menu-item")?.focus();
        }
    });
}

function bindFloatMenu(wrapper) {
    const trigger = wrapper.querySelector(".rb-float-button");
    const menu = wrapper.querySelector(".rb-fab-menu");
    const exportButton = wrapper.querySelector('[data-flowreader-action="export-markdown"]');

    trigger.addEventListener("click", startReading);
    bindFabMenuInteractions(wrapper, trigger, menu);

    exportButton?.addEventListener("click", () => {
        setFabMenuOpen(wrapper, false);
        exportMainPostMarkdown();
    });
}

function bindHomeMainTopicsMenu(wrapper) {
    const trigger = wrapper.querySelector('[data-flowreader-role="home-main-topics-button"]');
    const menu = wrapper.querySelector(".rb-fab-menu");
    const resetButton = wrapper.querySelector('[data-flowreader-action="reset-main-topic-progress"]');
    if (!trigger) {
        return;
    }

    trigger.addEventListener("click", () => startReadingMainTopics({
        button: trigger
    }));
    bindFabMenuInteractions(wrapper, trigger, menu);

    resetButton?.addEventListener("click", () => {
        setFabMenuOpen(wrapper, false);
        resetMainTopicProgress();
    });
}

function setupHomeUI() {
    if (!isSupportedHomePage(window.location)) {
        return;
    }

    if (document.querySelector('[data-flowreader-role="home-main-topics-wrapper"]')) {
        return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "userscript-rb";
    wrapper.dataset.flowreaderRole = "home-main-topics-wrapper";

    const controls = document.createElement("div");
    controls.className = "rb-home-main-topics-wrapper";
    const readTopicCount = getReadMainTopicIds().length;

    const browseMainTopicsButton = document.createElement("button");
    browseMainTopicsButton.className = "rb-home-main-topics-button";
    browseMainTopicsButton.type = "button";
    browseMainTopicsButton.dataset.flowreaderRole = "home-main-topics-button";
    browseMainTopicsButton.title = `浏览当前页面可见主帖，已记录 ${readTopicCount} 个主帖`;
    browseMainTopicsButton.setAttribute("aria-haspopup", "menu");
    browseMainTopicsButton.setAttribute("aria-expanded", "false");
    browseMainTopicsButton.setAttribute("aria-controls", "flowreader-home-main-topics-menu");
    browseMainTopicsButton.textContent = getHomeBrowseButtonLabel(readTopicCount);

    const menu = document.createElement("div");
    menu.id = "flowreader-home-main-topics-menu";
    menu.className = "rb-fab-menu";
    menu.setAttribute("role", "menu");
    menu.setAttribute("aria-label", "FlowReader 主帖操作");

    const resetButton = document.createElement("button");
    resetButton.className = "rb-fab-menu-item rb-home-reset-button";
    resetButton.type = "button";
    resetButton.setAttribute("role", "menuitem");
    resetButton.dataset.flowreaderRole = "home-main-topics-reset-button";
    resetButton.dataset.flowreaderAction = "reset-main-topic-progress";
    resetButton.textContent = "重置进度";

    controls.appendChild(browseMainTopicsButton);
    menu.appendChild(resetButton);
    controls.appendChild(menu);
    wrapper.appendChild(controls);
    document.body.appendChild(wrapper);
    bindHomeMainTopicsMenu(wrapper);
}

function setupTopicUI() {
    if (document.querySelector('[data-flowreader-role="float-button-wrapper"]')) {
        return;
    }

    const settingsMountPoint = resolveSettingsMountPoint();
    if (settingsMountPoint) {
        const settingsButton = createButton("设置", () => showSettings());
        settingsButton.dataset.flowreaderRole = "settings-button";
        settingsMountPoint.appendChild(settingsButton);
    }

    // 添加跟帖浏览浮动按钮
    const floatButton = document.createElement("div");
    floatButton.className = "userscript-rb";
    floatButton.dataset.flowreaderRole = "float-button-wrapper";
    const hasExportAction = canExportMarkdown(window.location);
    const menuAttributes = hasExportAction
        ? 'aria-haspopup="menu" aria-expanded="false" aria-controls="flowreader-fab-menu"'
        : "";
    const exportMenu = hasExportAction
        ? `<div id="flowreader-fab-menu" class="rb-fab-menu" role="menu" aria-label="FlowReader 快捷操作">
            <button class="rb-fab-menu-item" type="button" role="menuitem" data-flowreader-action="export-markdown">导出 Markdown</button>
        </div>`
        : "";

    floatButton.innerHTML = `
        <button class="rb-float-button" type="button" title="浏览跟帖" ${menuAttributes}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </button>
        ${exportMenu}
    `;
    document.body.appendChild(floatButton);
    bindFloatMenu(floatButton);
}

// 设置UI
function setupUI() {
    if (isSupportedHomePage(window.location)) {
        setupHomeUI();
        return;
    }

    setupTopicUI();
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

function buildTopicApiUrl(origin, currentTopicID) {
    return `${origin}/t/${currentTopicID}.json`;
}

function buildPostApiUrl(origin, postId) {
    return `${origin}/posts/${postId}.json`;
}

function normalizeSourceUrl(locationLike) {
    const sourceUrl = new URL(locationLike.href || locationLike.pathname, locationLike.origin);
    sourceUrl.hash = "";
    return sourceUrl.toString();
}

function sanitizeFileName(value, fallback = "linuxdo-main-post") {
    const normalized = String(value || fallback)
        .replace(/[\\/:*?"<>|]/g, "-")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/[. ]+$/g, "");

    return (normalized || fallback).slice(0, 120);
}

function yamlString(value) {
    return JSON.stringify(value == null ? "" : String(value));
}

function buildMarkdownDocument(details) {
    const raw = typeof details.raw === "string" ? details.raw : "";
    const metadata = [
        "---",
        `source: ${yamlString(details.url)}`,
        `topic_id: ${yamlString(details.topicId)}`,
        `post_id: ${yamlString(details.postId)}`,
        `title: ${yamlString(details.title)}`,
        `author: ${yamlString(details.author)}`,
        `created_at: ${yamlString(details.createdAt)}`,
        "exported_from: \"flowreader\"",
        "---",
        ""
    ].join("\n");

    return `${metadata}${raw}${raw.endsWith("\n") ? "" : "\n"}`;
}

function pickMainPost(topicData) {
    const posts = topicData?.post_stream?.posts;
    if (Array.isArray(posts) && posts.length > 0) {
        const mainPost = posts.find(post => post?.post_number === 1) || posts[0];
        return {
            id: mainPost?.id,
            post: mainPost
        };
    }

    const stream = topicData?.post_stream?.stream;
    if (Array.isArray(stream) && stream.length > 0) {
        return {
            id: stream[0],
            post: null
        };
    }

    return {
        id: null,
        post: null
    };
}

async function fetchJson(url, fetchImpl = fetch, context = pageContext) {
    const response = await fetchImpl(url, {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
            "Accept": "application/json",
            "X-CSRF-Token": context?.csrfToken ?? "",
            "X-Requested-With": "XMLHttpRequest",
            "X-Silence-Logger": "true"
        }
    });

    if (!response.ok) {
        throw new Error(`请求失败：HTTP ${response.status}`);
    }

    return response.json();
}

async function collectMainPostMarkdown(options = {}) {
    const locationLike = options.locationLike || window.location;
    const fetchImpl = options.fetchImpl || fetch;
    const context = options.context || pageContext || (
        typeof document !== "undefined" ? getPageContext(document, locationLike) : null
    );
    const currentTopicID = getTopicID(locationLike.pathname ?? "");

    if (!canExportMarkdown(locationLike)) {
        throw new Error("当前页面不是 Linux.do 话题详情页");
    }

    const topicData = await fetchJson(buildTopicApiUrl(locationLike.origin, currentTopicID), fetchImpl, context);
    const mainPostInfo = pickMainPost(topicData);

    if (!mainPostInfo.id) {
        throw new Error("未能从话题数据中找到主帖 ID");
    }

    let postData = mainPostInfo.post;
    if (!postData || typeof postData.raw !== "string") {
        postData = await fetchJson(buildPostApiUrl(locationLike.origin, mainPostInfo.id), fetchImpl, context);
    }

    if (typeof postData?.raw !== "string") {
        throw new Error("主帖 API 响应中缺少 raw Markdown 内容");
    }

    const title = topicData.title || postData.topic_slug || `linuxdo-${currentTopicID}`;
    const filename = `${sanitizeFileName(`linuxdo-${currentTopicID}-${title}`)}.md`;
    const markdown = buildMarkdownDocument({
        raw: postData.raw,
        url: normalizeSourceUrl(locationLike),
        topicId: currentTopicID,
        postId: postData.id || mainPostInfo.id,
        title,
        author: postData.username,
        createdAt: postData.created_at
    });

    return {
        filename,
        markdown
    };
}

function triggerAnchorDownload(blobUrl, filename, doc = document) {
    const link = doc.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    link.rel = "noopener";
    doc.body.appendChild(link);
    link.click();
    link.remove();
}

function downloadMarkdown(filename, markdown, doc = document) {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const blobUrl = URL.createObjectURL(blob);

    if (typeof GM_download === "function") {
        try {
            GM_download({
                url: blobUrl,
                name: filename,
                saveAs: true,
                onload: () => URL.revokeObjectURL(blobUrl),
                onerror: () => {
                    triggerAnchorDownload(blobUrl, filename, doc);
                    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
                }
            });
            return;
        } catch (error) {
            console.warn("GM_download 不可用，回退到浏览器下载", error);
        }
    }

    triggerAnchorDownload(blobUrl, filename, doc);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}

async function exportMainPostMarkdown() {
    if (!canExportMarkdown(window.location)) {
        showStatus("当前站点暂不支持导出 Markdown", "warning");
        return;
    }

    try {
        showStatus("正在导出主帖 Markdown...", "warning");
        const result = await collectMainPostMarkdown();
        downloadMarkdown(result.filename, result.markdown);
        showStatus("主帖 Markdown 已生成", "success");
    } catch (error) {
        console.error("导出主帖 Markdown 失败：", error);
        showStatus(`导出失败：${error.message}`, "error");
    }
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

function createMainTopicTimingParams(currentTopicID, readTime = getRandomInt(config.minReadTime, config.maxReadTime)) {
    const params = new URLSearchParams();
    params.append("timings[1]", String(readTime));
    params.append("topic_time", String(readTime));
    params.append("topic_id", currentTopicID);
    return params;
}

function createTimingHeaders(csrfToken = pageContext?.csrfToken ?? getCsrfToken()) {
    return {
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
    };
}

async function sendMainTopicTiming(currentTopicID, retryCount = 3, options = {}) {
    const fetchImpl = options.fetchImpl || fetch;
    const params = createMainTopicTimingParams(currentTopicID);

    try {
        const response = await fetchImpl(`${currentProtocol}//${currentDomain}/topics/timings`, {
            headers: createTimingHeaders(options.csrfToken),
            referrer: `${currentProtocol}//${currentDomain}/`,
            body: params.toString(),
            method: "POST",
            mode: "cors",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`HTTP请求失败，状态码：${response.status}`);
        }

        return true;
    } catch (error) {
        console.error(`浏览主帖 ${currentTopicID} 失败: `, error);

        if (retryCount > 0) {
            await new Promise(r => setTimeout(r, 2000));
            return sendMainTopicTiming(currentTopicID, retryCount - 1, options);
        }

        return false;
    }
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
            headers: createTimingHeaders(pageContext?.csrfToken ?? ""),
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

// 开始浏览首页可见主帖
async function startReadingMainTopics(options = {}) {
    syncRuntimeState();

    const doc = options.doc || document;
    const locationLike = options.locationLike || window.location;
    if (!isSupportedHomePage(locationLike)) {
        showStatus("当前页面不支持浏览主帖", "warning");
        return;
    }

    const topics = collectHomeTopicItems(doc, locationLike);
    if (topics.length === 0) {
        showStatus("当前页面未找到可浏览主帖", "warning");
        return;
    }

    let readTopicIds = getReadMainTopicIds(options.storageGetter);
    const unreadTopics = filterUnreadHomeTopicItems(topics, readTopicIds);
    if (unreadTopics.length === 0) {
        showStatus("当前已加载主帖都已浏览，请向下滚动加载更多主帖后继续", "warning");
        return;
    }

    const csrfToken = getCsrfToken(doc);
    if (!csrfToken) {
        showStatus("未找到 CSRF 信息，暂时无法浏览主帖", "error");
        return;
    }

    const button = options.button || doc.querySelector('[data-flowreader-role="home-main-topics-button"]');
    if (button) {
        button.disabled = true;
    }
    setButtonLabel(button, "浏览中...");

    let successCount = 0;
    let failedCount = 0;
    let consecutiveFailureCount = 0;
    let stoppedByConsecutiveFailures = false;

    try {
        for (let index = 0; index < unreadTopics.length; index++) {
            const topic = unreadTopics[index];
            showStatus(`浏览主帖 ${index + 1} / ${unreadTopics.length}：${topic.title}`, "success");

            const success = await sendMainTopicTiming(topic.id, 3, {
                csrfToken,
                fetchImpl: options.fetchImpl
            });

            if (success) {
                successCount++;
                consecutiveFailureCount = 0;
                readTopicIds = saveReadMainTopicIds(
                    mergeReadMainTopicIds(readTopicIds, topic.id),
                    options.storageSetter
                );
                const delay = config.baseDelay + getRandomInt(0, config.randomDelayRange);
                await new Promise(r => setTimeout(r, delay));
            } else {
                failedCount++;
                consecutiveFailureCount++;
                if (shouldStopMainTopicBrowsing(consecutiveFailureCount)) {
                    stoppedByConsecutiveFailures = true;
                    break;
                }
            }
        }

        if (stoppedByConsecutiveFailures) {
            showStatus(
                `连续 ${MAIN_TOPIC_MAX_CONSECUTIVE_FAILURES} 个主帖浏览失败，已停止。成功 ${successCount}，失败 ${failedCount}，已记录 ${readTopicIds.length} 个主帖。请检查网络或登录状态后重试。`,
                "error"
            );
        } else if (failedCount > 0) {
            showStatus(`主帖浏览完成：成功 ${successCount}，失败 ${failedCount}，已记录 ${readTopicIds.length} 个主帖`, "warning");
        } else {
            showStatus(`本次主帖浏览完成，共 ${successCount} 个，已记录 ${readTopicIds.length} 个主帖`, "success");
        }
    } finally {
        if (button) {
            button.disabled = false;
            button.title = `浏览当前页面可见主帖，已记录 ${readTopicIds.length} 个主帖`;
        }
        setButtonLabel(button, getHomeBrowseButtonLabel(readTopicIds.length));
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
        buildMarkdownDocument,
        canExportMarkdown,
        collectMainPostMarkdown,
        collectHomeTopicItems,
        cleanupScriptUI,
        createMainTopicTimingParams,
        filterUnreadHomeTopicItems,
        getHomeBrowseButtonLabel,
        getRouteSignature,
        getPageContext,
        handleRouteChange,
        isSupportedHomePage,
        mergeReadMainTopicIds,
        normalizeMainTopicIdList,
        parseTopicUrl,
        pickMainPost,
        parseRepliesInfo,
        resolveSettingsMountPoint,
        sanitizeFileName,
        shouldStopMainTopicBrowsing
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
