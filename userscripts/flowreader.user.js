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
    box-sizing: border-box !important;
    width: 100% !important;
    min-height: 38px !important;
    padding: 0 14px !important;
    border: 1px solid var(--primary-low) !important;
    border-radius: 999px !important;
    background: var(--secondary) !important;
    color: var(--primary) !important;
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

.userscript-rb .rb-topic-fab-menu {
    display: grid !important;
    gap: 8px !important;
    justify-items: end !important;
    min-width: 0 !important;
    width: max-content !important;
}

.userscript-rb .rb-topic-fab-menu .rb-fab-menu-item {
    width: max-content !important;
    min-width: 0 !important;
    padding: 0 12px !important;
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
    '[data-flowreader-role="home-main-topics-stop-button"]',
    '[data-flowreader-role="home-main-topics-reset-button"]',
    '[data-flowreader-role="topic-main-topics-stop-button"]'
];

const MAIN_TOPIC_PROGRESS_KEY = "flowreader.mainTopicReadIds";
const MAIN_TOPIC_SESSION_KEY = "flowreader.mainTopicBrowsingSession";
const MAIN_TOPIC_MAX_CONSECUTIVE_FAILURES = 3;
const MAIN_TOPIC_MAX_PROGRESS_IDS = 20000;
const MAIN_TOPIC_SESSION_TTL_MS = 60 * 60 * 1000;
const MAIN_TOPIC_TIMING_TIMEOUT_MS = 12000;
const TOPIC_UNAVAILABLE_TEXTS = [
    "抱歉，我们无法加载该话题",
    "Sorry, we couldn't load that topic"
];
const MAIN_POST_SELECTORS = [
    "#post_1",
    '[data-post-number="1"]',
    ".topic-post"
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
    const currentTopicID = getTopicID(locationLike.pathname ?? "");

    if (!csrfToken || !currentTopicID) {
        return null;
    }

    if (!parsedReplies) {
        const hasMainPost = MAIN_POST_SELECTORS.some(selector => doc.querySelector(selector));
        if (!hasMainPost) {
            return null;
        }

        return {
            currentPosition: 1,
            totalReplies: 1,
            csrfToken,
            topicID: currentTopicID
        };
    }

    return {
        ...parsedReplies,
        csrfToken,
        topicID: currentTopicID
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

// 当前 Tab 浏览会跨首页和话题页跳转，必须持久化队列才能在返回首页后继续。
function normalizeMainTopicBrowsingSession(value, now = Date.now()) {
    let parsedValue = value;
    if (typeof value === "string") {
        if (!value.trim()) {
            return null;
        }

        try {
            parsedValue = JSON.parse(value);
        } catch {
            return null;
        }
    }

    if (!parsedValue || typeof parsedValue !== "object") {
        return null;
    }

    const topics = Array.isArray(parsedValue.topics)
        ? parsedValue.topics
            .map(topic => ({
                id: String(topic?.id ?? "").trim(),
                url: String(topic?.url ?? "").trim(),
                title: String(topic?.title ?? topic?.id ?? "").trim()
            }))
            .filter(topic => /^\d+$/.test(topic.id) && topic.url)
        : [];
    if (topics.length === 0) {
        return null;
    }

    const updatedAt = Number(parsedValue.updatedAt || parsedValue.startedAt || 0);
    if (Number.isFinite(updatedAt) && updatedAt > 0 && now - updatedAt > MAIN_TOPIC_SESSION_TTL_MS) {
        return null;
    }

    const index = Math.max(0, Math.min(Number.parseInt(parsedValue.index, 10) || 0, topics.length));
    const sourceUrl = String(parsedValue.sourceUrl || "");
    const phase = ["home", "topic", "returning", "complete"].includes(parsedValue.phase)
        ? parsedValue.phase
        : "home";

    return {
        active: true,
        sourceUrl,
        topics,
        index,
        phase,
        successCount: Math.max(0, Number.parseInt(parsedValue.successCount, 10) || 0),
        failedCount: Math.max(0, Number.parseInt(parsedValue.failedCount, 10) || 0),
        consecutiveFailureCount: Math.max(0, Number.parseInt(parsedValue.consecutiveFailureCount, 10) || 0),
        startedAt: Number(parsedValue.startedAt) || now,
        updatedAt: Number.isFinite(updatedAt) && updatedAt > 0 ? updatedAt : now
    };
}

function createMainTopicBrowsingSession(topics, sourceUrl, now = Date.now()) {
    return normalizeMainTopicBrowsingSession({
        active: true,
        sourceUrl,
        topics,
        index: 0,
        phase: "home",
        successCount: 0,
        failedCount: 0,
        consecutiveFailureCount: 0,
        startedAt: now,
        updatedAt: now
    }, now);
}

function getMainTopicBrowsingSession(storageGetter = typeof GM_getValue === "function" ? GM_getValue : null, now = Date.now()) {
    if (!storageGetter) {
        return null;
    }

    return normalizeMainTopicBrowsingSession(storageGetter(MAIN_TOPIC_SESSION_KEY, ""), now);
}

function saveMainTopicBrowsingSession(session, storageSetter = typeof GM_setValue === "function" ? GM_setValue : null, now = Date.now()) {
    const normalizedSession = normalizeMainTopicBrowsingSession({
        ...session,
        updatedAt: now
    }, now);
    if (storageSetter) {
        storageSetter(MAIN_TOPIC_SESSION_KEY, normalizedSession ? JSON.stringify(normalizedSession) : "");
    }

    return normalizedSession;
}

function clearMainTopicBrowsingSession(storageSetter = typeof GM_setValue === "function" ? GM_setValue : null) {
    if (storageSetter) {
        storageSetter(MAIN_TOPIC_SESSION_KEY, "");
    }
}

function stopMainTopicBrowsingSession(options = {}) {
    const storageGetter = options.storageGetter ?? (typeof GM_getValue === "function" ? GM_getValue : null);
    const storageSetter = options.storageSetter ?? (typeof GM_setValue === "function" ? GM_setValue : null);
    const showStatusImpl = options.showStatusImpl ?? (typeof showStatus === "function" ? showStatus : null);
    const doc = options.doc ?? (typeof document !== "undefined" ? document : null);
    const now = options.now ?? Date.now();
    const session = getMainTopicBrowsingSession(storageGetter, now);

    clearMainTopicBrowsingSession(storageSetter);

    const readTopicCount = getReadMainTopicIds(storageGetter).length;
    const button = doc?.querySelector?.('[data-flowreader-role="home-main-topics-button"]');
    if (button) {
        button.title = `浏览当前页面可见主帖，已记录 ${readTopicCount} 个主帖`;
        setButtonLabel(button, getHomeBrowseButtonLabel(readTopicCount));
    }

    if (showStatusImpl) {
        showStatusImpl(
            session
                ? `已停止本轮主帖浏览，已记录 ${readTopicCount} 个主帖`
                : `当前没有正在进行的主帖浏览，已记录 ${readTopicCount} 个主帖`,
            session ? "success" : "warning"
        );
    }

    return Boolean(session);
}

function getCurrentMainTopicSessionItem(session) {
    return session?.topics?.[session.index] ?? null;
}

function isCurrentMainTopicBrowsingSessionRoute(locationLike = window.location, storageGetter = typeof GM_getValue === "function" ? GM_getValue : null, now = Date.now()) {
    const session = getMainTopicBrowsingSession(storageGetter, now);
    const topic = getCurrentMainTopicSessionItem(session);
    return Boolean(topic && String(topic.id) === getTopicID(locationLike?.pathname ?? ""));
}

function findHomeTopicLink(topic, doc = document, locationLike = window.location) {
    if (!topic?.id) {
        return null;
    }

    const baseUrl = locationLike.href || `${locationLike.origin}${locationLike.pathname}`;
    for (const link of doc.querySelectorAll('a[href*="/t/"]')) {
        const parsed = parseTopicUrl(link.getAttribute("href") || link.href, baseUrl);
        if (parsed?.id === String(topic.id)) {
            return link;
        }
    }

    return null;
}

function navigateToMainTopicFromHome(topic, options = {}) {
    const doc = options.doc || document;
    const locationLike = options.locationLike || window.location;
    const navigate = options.navigate || (url => window.location.assign(url));
    const link = findHomeTopicLink(topic, doc, locationLike);

    if (link) {
        link.scrollIntoView?.({ block: "center", inline: "nearest" });
        link.removeAttribute?.("target");
        link.click();
        return "click";
    }

    navigate(topic.url);
    return "assign";
}

function scheduleMainTopicNavigationChecks(scheduleRouteCheck = scheduleRouteChangeCheck, scheduler = setTimeout) {
    // Discourse 偶尔会复用缓存/历史状态，主动补查可避免主帖状态机漏跑。
    for (const delay of [250, 1000, 3000]) {
        scheduler(scheduleRouteCheck, delay);
    }
}

function returnToMainTopicSource(session, options = {}) {
    const navigate = options.navigate || (url => window.location.assign(url));
    const historyBack = options.historyBack || (() => window.history.back());
    if (session?.sourceUrl) {
        navigate(session.sourceUrl);
        return "assign";
    }

    if (typeof historyBack === "function") {
        historyBack();
        return "back";
    }

    return "none";
}

function isTopicUnavailablePage(doc = typeof document !== "undefined" ? document : null) {
    const pageText = doc?.body?.textContent || doc?.documentElement?.textContent || "";
    return TOPIC_UNAVAILABLE_TEXTS.some(text => pageText.includes(text));
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

    const isTopicRoute = nextRouteSignature.startsWith("topic:");
    const shouldContinueSameTopicSession = isTopicRoute && isCurrentMainTopicBrowsingSessionRoute(
        locationLike,
        options.storageGetter,
        options.now
    );
    if (state.lastRouteSignature === nextRouteSignature && !shouldContinueSameTopicSession) {
        return false;
    }

    let topicUnavailable = false;
    let topicContextUnavailable = false;
    if (isTopicRoute) {
        try {
            await (options.waitForContext ?? waitForPageContext)();
        } catch (error) {
            topicUnavailable = isTopicUnavailablePage(targetDocument);
            topicContextUnavailable = !topicUnavailable && isCurrentMainTopicBrowsingSessionRoute(
                locationLike,
                options.storageGetter,
                options.now
            );
            if (!topicUnavailable && !topicContextUnavailable) {
                throw error;
            }
        }

        const latestContext = (options.syncState ?? syncRuntimeState)();
        topicUnavailable = topicUnavailable || isTopicUnavailablePage(targetDocument);
        topicContextUnavailable = topicContextUnavailable || (!latestContext && isCurrentMainTopicBrowsingSessionRoute(
            locationLike,
            options.storageGetter,
            options.now
        ));
        if (!latestContext && !topicUnavailable && !topicContextUnavailable) {
            return false;
        }
    } else {
        (options.syncState ?? syncRuntimeState)();
    }

    cleanupUI(targetDocument);
    if (!topicUnavailable && !topicContextUnavailable) {
        (options.setupUI ?? setupUI)();
    }
    state.lastRouteSignature = nextRouteSignature;

    if (isTopicRoute && !topicUnavailable && !topicContextUnavailable && (options.config ?? config).autoStart) {
        await (options.startReading ?? startReading)();
    }

    await (options.continueMainTopics ?? continueMainTopicBrowsingSession)({
        doc: targetDocument,
        locationLike,
        storageGetter: options.storageGetter,
        storageSetter: options.storageSetter,
        fetchImpl: options.fetchImpl,
        timingTimeoutMs: options.timingTimeoutMs,
        timingRetryDelayMs: options.timingRetryDelayMs,
        AbortControllerImpl: options.AbortControllerImpl,
        delayImpl: options.delayImpl,
        navigate: options.navigate,
        historyBack: options.historyBack,
        showStatusImpl: options.showStatusImpl,
        topicUnavailable,
        topicContextUnavailable,
        now: options.now
    });

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
    const stopButton = wrapper.querySelector('[data-flowreader-action="stop-main-topic-session"]');

    trigger.addEventListener("click", startReading);
    bindFabMenuInteractions(wrapper, trigger, menu);

    exportButton?.addEventListener("click", () => {
        setFabMenuOpen(wrapper, false);
        exportMainPostMarkdown();
    });

    stopButton?.addEventListener("click", () => {
        setFabMenuOpen(wrapper, false);
        stopMainTopicBrowsingSession();
    });
}

function bindHomeMainTopicsMenu(wrapper) {
    const trigger = wrapper.querySelector('[data-flowreader-role="home-main-topics-button"]');
    const menu = wrapper.querySelector(".rb-fab-menu");
    const stopButton = wrapper.querySelector('[data-flowreader-action="stop-main-topic-session"]');
    const resetButton = wrapper.querySelector('[data-flowreader-action="reset-main-topic-progress"]');
    if (!trigger) {
        return;
    }

    trigger.addEventListener("click", () => startReadingMainTopics({
        button: trigger
    }));
    bindFabMenuInteractions(wrapper, trigger, menu);

    stopButton?.addEventListener("click", () => {
        setFabMenuOpen(wrapper, false);
        stopMainTopicBrowsingSession();
    });

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

    const stopButton = document.createElement("button");
    stopButton.className = "rb-fab-menu-item rb-home-stop-button";
    stopButton.type = "button";
    stopButton.setAttribute("role", "menuitem");
    stopButton.dataset.flowreaderRole = "home-main-topics-stop-button";
    stopButton.dataset.flowreaderAction = "stop-main-topic-session";
    stopButton.textContent = "停止本轮";

    const resetButton = document.createElement("button");
    resetButton.className = "rb-fab-menu-item rb-home-reset-button";
    resetButton.type = "button";
    resetButton.setAttribute("role", "menuitem");
    resetButton.dataset.flowreaderRole = "home-main-topics-reset-button";
    resetButton.dataset.flowreaderAction = "reset-main-topic-progress";
    resetButton.textContent = "重置进度";

    controls.appendChild(browseMainTopicsButton);
    menu.appendChild(stopButton);
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
        ? `<div id="flowreader-fab-menu" class="rb-fab-menu rb-topic-fab-menu" role="menu" aria-label="FlowReader 快捷操作">
            <button class="rb-fab-menu-item" type="button" role="menuitem" data-flowreader-role="topic-main-topics-stop-button" data-flowreader-action="stop-main-topic-session">停止本轮</button>
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

function sanitizeFileName(value, fallback = "untitled") {
    return String(value || fallback)
        .replace(/[\\/:*?"<>|]/g, "_")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 80) || fallback;
}

function buildMarkdownFilename(topic) {
    const safeTitle = sanitizeFileName(topic?.title || "untitled");
    const topicId = String(topic?.topicId || "").trim();
    return topicId ? `${safeTitle}-${topicId}.md` : `${safeTitle}.md`;
}

function yamlString(value) {
    return JSON.stringify(value == null ? "" : String(value));
}

function normalizeCaseKey(value) {
    return String(value || "").trim().toLowerCase();
}

function absoluteUrl(src, baseUrl = typeof window !== "undefined" ? window.location.href : "https://linux.do/") {
    const raw = String(src || "").trim();
    if (!raw) {
        return "";
    }

    try {
        return new URL(raw, baseUrl).toString();
    } catch {
        return raw;
    }
}

function getMarkdownHeadingPrefix(tagName) {
    const level = Math.max(1, Math.min(Number.parseInt(String(tagName || "").replace(/^h/i, ""), 10) || 3, 6));
    if (level <= 1) return "##";
    if (level === 2) return "###";
    return "####";
}

function decodeHtmlEntities(value) {
    const text = String(value || "");
    const doc = typeof document !== "undefined" ? document : null;
    if (doc?.createElement) {
        const textarea = doc.createElement("textarea");
        textarea.innerHTML = text;
        return textarea.value;
    }

    return text
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
}

function getHtmlAttribute(tag, name) {
    const escapedName = String(name || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = String(tag || "").match(new RegExp(`\\s${escapedName}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
    return match ? (match[1] ?? match[2] ?? match[3] ?? "") : "";
}

function isLikelyDiscourseUploadUrl(url, baseUrl) {
    try {
        const parsed = new URL(url, baseUrl || (typeof window !== "undefined" ? window.location.href : "https://linux.do/"));
        return /\/(?:uploads|original|optimized)\//i.test(parsed.pathname);
    } catch {
        return false;
    }
}

function isLikelyImageAssetUrl(url, baseUrl) {
    if (!url) {
        return false;
    }

    try {
        const parsed = new URL(url, baseUrl || (typeof window !== "undefined" ? window.location.href : "https://linux.do/"));
        if (/\.(png|jpe?g|gif|webp|bmp|svg|avif|heic|heif|tiff?)(\?.*)?$/i.test(parsed.pathname + parsed.search)) {
            return true;
        }
        return isLikelyDiscourseUploadUrl(parsed.toString(), baseUrl);
    } catch {
        return false;
    }
}

function parseSrcsetLargestUrl(srcset, baseUrl) {
    const items = String(srcset || "")
        .split(",")
        .map(item => item.trim())
        .filter(Boolean);
    let bestUrl = "";
    let bestScore = -1;

    for (const item of items) {
        const parts = item.split(/\s+/).filter(Boolean);
        const candidateUrl = absoluteUrl(parts[0] || "", baseUrl);
        if (!candidateUrl) continue;

        const descriptor = parts[1] || "";
        const match = descriptor.match(/^([0-9]+(?:\.[0-9]+)?)(w|x)$/i);
        let score = 0;
        if (match) {
            const numeric = Number.parseFloat(match[1]);
            score = match[2].toLowerCase() === "w" ? numeric * 1000 : numeric;
        }

        if (score >= bestScore) {
            bestScore = score;
            bestUrl = candidateUrl;
        }
    }

    return bestUrl;
}

function toUniqueUrlList(values, baseUrl) {
    const result = [];
    const seen = new Set();
    for (const value of values || []) {
        const normalized = absoluteUrl(value, baseUrl);
        if (!normalized) continue;
        const key = normalizeCaseKey(normalized);
        if (seen.has(key)) continue;
        seen.add(key);
        result.push(normalized);
    }
    return result;
}

function getDiscourseEmojiName(src) {
    const match = String(src || "").match(/\/images\/emoji\/(?:twemoji|apple|google|twitter)\/([^/.]+)\.png/i);
    return match ? match[1] : "";
}

function isDiscourseEmojiImage(src) {
    return Boolean(getDiscourseEmojiName(src));
}

function resolveImageAssetFromElement(img, baseUrl) {
    if (!img) {
        return null;
    }

    const displaySrc = absoluteUrl(img.getAttribute?.("src") || img.getAttribute?.("data-src") || "", baseUrl);
    const anchor = img.closest?.("a");
    const anchorHref = absoluteUrl(anchor?.getAttribute?.("href") || "", baseUrl);
    const downloadHref = absoluteUrl(anchor?.getAttribute?.("data-download-href") || img.getAttribute?.("data-download-href") || "", baseUrl);
    const largeSrc = absoluteUrl(img.getAttribute?.("data-large-src") || anchor?.getAttribute?.("data-large-src") || "", baseUrl);
    const srcsetLargest = parseSrcsetLargestUrl(img.getAttribute?.("srcset") || "", baseUrl);

    const orderedCandidates = [];
    if (anchorHref && isLikelyImageAssetUrl(anchorHref, baseUrl)) orderedCandidates.push(anchorHref);
    if (downloadHref && isLikelyImageAssetUrl(downloadHref, baseUrl)) orderedCandidates.push(downloadHref);
    if (largeSrc && isLikelyImageAssetUrl(largeSrc, baseUrl)) orderedCandidates.push(largeSrc);
    if (srcsetLargest) orderedCandidates.push(srcsetLargest);
    if (displaySrc) orderedCandidates.push(displaySrc);

    const uniqueCandidates = toUniqueUrlList(orderedCandidates, baseUrl);
    const preferredSrc = uniqueCandidates[0] || displaySrc;
    if (!preferredSrc) {
        return null;
    }

    return {
        displaySrc,
        preferredSrc,
        fallbackSrcs: uniqueCandidates.filter(url => normalizeCaseKey(url) !== normalizeCaseKey(preferredSrc))
    };
}

function resolveImageAssetFromImgTag(tag, baseUrl) {
    const displaySrc = absoluteUrl(getHtmlAttribute(tag, "src") || getHtmlAttribute(tag, "data-src") || "", baseUrl);
    const downloadHref = absoluteUrl(getHtmlAttribute(tag, "data-download-href") || "", baseUrl);
    const largeSrc = absoluteUrl(getHtmlAttribute(tag, "data-large-src") || "", baseUrl);
    const srcsetLargest = parseSrcsetLargestUrl(getHtmlAttribute(tag, "srcset"), baseUrl);
    const orderedCandidates = [];
    if (downloadHref && isLikelyImageAssetUrl(downloadHref, baseUrl)) orderedCandidates.push(downloadHref);
    if (largeSrc && isLikelyImageAssetUrl(largeSrc, baseUrl)) orderedCandidates.push(largeSrc);
    if (srcsetLargest) orderedCandidates.push(srcsetLargest);
    if (displaySrc) orderedCandidates.push(displaySrc);

    const uniqueCandidates = toUniqueUrlList(orderedCandidates, baseUrl);
    const preferredSrc = uniqueCandidates[0] || displaySrc;
    if (!preferredSrc) {
        return null;
    }

    return {
        displaySrc,
        preferredSrc,
        fallbackSrcs: uniqueCandidates.filter(url => normalizeCaseKey(url) !== normalizeCaseKey(preferredSrc))
    };
}

function getImageAssetAliases(asset, baseUrl) {
    return toUniqueUrlList([asset?.displaySrc, asset?.preferredSrc, ...(asset?.fallbackSrcs || [])], baseUrl);
}

function registerImageMapEntry(imgMap, asset, entry, baseUrl) {
    for (const alias of getImageAssetAliases(asset, baseUrl)) {
        imgMap[alias] = entry;
    }
}

function resolveImageMapEntry(img, imgMap, baseUrl) {
    const asset = resolveImageAssetFromElement(img, baseUrl);
    if (!asset) {
        return { asset: null, entry: null };
    }

    for (const alias of getImageAssetAliases(asset, baseUrl)) {
        if (imgMap && imgMap[alias]) {
            return { asset, entry: imgMap[alias] };
        }
    }

    return { asset, entry: null };
}

function collectImageAssetsFromHtml(cookedHtml, baseUrl, doc = typeof document !== "undefined" ? document : null) {
    const assets = [];
    const byPreferred = new Map();
    const recordAsset = asset => {
        if (!asset?.preferredSrc) return;
        const key = normalizeCaseKey(asset.preferredSrc);
        if (byPreferred.has(key)) return;
        byPreferred.set(key, asset);
        assets.push(asset);
    };

    if (doc?.createElement) {
        const container = doc.createElement("div");
        container.innerHTML = cookedHtml || "";
        container.querySelectorAll("img").forEach(img => {
            const src = img.getAttribute("src") || img.getAttribute("data-src") || "";
            if (isDiscourseEmojiImage(src)) return;
            recordAsset(resolveImageAssetFromElement(img, baseUrl));
        });
        return assets;
    }

    for (const match of String(cookedHtml || "").matchAll(/<img\b[^>]*>/gi)) {
        const tag = match[0];
        const src = getHtmlAttribute(tag, "src") || getHtmlAttribute(tag, "data-src") || "";
        if (isDiscourseEmojiImage(src)) continue;
        recordAsset(resolveImageAssetFromImgTag(tag, baseUrl));
    }

    return assets;
}

function buildRemoteImageMap(cookedHtml, baseUrl, doc) {
    const imgMap = {};
    for (const asset of collectImageAssetsFromHtml(cookedHtml, baseUrl, doc)) {
        registerImageMapEntry(imgMap, asset, {
            preferredSrc: asset.preferredSrc,
            renderedValue: asset.preferredSrc
        }, baseUrl);
    }
    return imgMap;
}

function escapeTableCell(text) {
    return String(text || "")
        .replace(/\r\n/g, "\n")
        .replace(/\n+/g, "<br>")
        .replace(/\|/g, "\\|")
        .replace(/\s+/g, " ")
        .trim();
}

function tableToMarkdown(tableEl, serialize) {
    const tableRowCells = rowEl => Array.from(rowEl.children).filter(cell => {
        const tag = cell.tagName ? cell.tagName.toLowerCase() : "";
        return tag === "td" || tag === "th";
    });
    const rows = Array.from(tableEl.querySelectorAll("tr"));
    if (!rows.length) {
        return "";
    }

    const allRows = rows.map(row => tableRowCells(row).map(cell => {
        const raw = Array.from(cell.childNodes).map(child => serialize(child, false)).join("");
        return escapeTableCell(raw);
    }));
    const headerCells = allRows[0] || [];
    const dataRows = allRows.slice(1);
    const colCount = Math.max(0, ...allRows.map(row => row.length));
    if (!colCount) {
        return "";
    }

    const padRow = cells => {
        const out = cells.slice(0, colCount);
        while (out.length < colCount) out.push("");
        return out;
    };

    const headerLine = `| ${padRow(headerCells).join(" | ")} |`;
    const sepLine = `| ${Array.from({ length: colCount }, () => "---").join(" | ")} |`;
    const bodyLines = dataRows.map(row => `| ${padRow(row).join(" | ")} |`).join("\n");
    return [headerLine, sepLine, bodyLines].filter(Boolean).join("\n");
}

function cookedToMarkdownFallback(cookedHtml, options = {}) {
    const baseUrl = options.baseUrl || (typeof window !== "undefined" ? window.location.href : "https://linux.do/");
    let text = String(cookedHtml || "")
        .replace(/<a\b[^>]*href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>\s*(<img\b[^>]*>)\s*<\/a>/gi, (_, h1, h2, h3, imgTag) => {
            const asset = resolveImageAssetFromImgTag(imgTag, baseUrl);
            const alt = getHtmlAttribute(imgTag, "alt") || "图片";
            const fallbackHref = absoluteUrl(h1 || h2 || h3 || "", baseUrl);
            const imageSrc = asset?.preferredSrc || fallbackHref;
            return imageSrc ? `\n![${alt}](${imageSrc})\n` : "";
        })
        .replace(/<pre\b[^>]*>\s*<code\b([^>]*)>([\s\S]*?)<\/code>\s*<\/pre>/gi, (_, attrs, code) => {
            const lang = (getHtmlAttribute(attrs, "class").match(/lang(?:uage)?-([a-z0-9_+-]+)/i) || [])[1] || "";
            return `\n\`\`\`${lang}\n${decodeHtmlEntities(code).replace(/\n+$/g, "")}\n\`\`\`\n\n`;
        })
        .replace(/<img\b[^>]*>/gi, tag => {
            const src = getHtmlAttribute(tag, "src") || getHtmlAttribute(tag, "data-src") || "";
            const emojiName = getDiscourseEmojiName(src);
            if (emojiName) {
                return getHtmlAttribute(tag, "alt") || getHtmlAttribute(tag, "title") || `:${emojiName}:`;
            }
            const asset = resolveImageAssetFromImgTag(tag, baseUrl);
            const alt = getHtmlAttribute(tag, "alt") || "图片";
            return asset?.preferredSrc ? `\n![${alt}](${asset.preferredSrc})\n` : "";
        })
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p\s*>/gi, "\n\n")
        .replace(/<p\b[^>]*>/gi, "")
        .replace(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi, "\n## $1\n\n")
        .replace(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi, "\n### $1\n\n")
        .replace(/<h[3-6]\b[^>]*>([\s\S]*?)<\/h[3-6]>/gi, "\n#### $1\n\n")
        .replace(/<strong\b[^>]*>([\s\S]*?)<\/strong>|<b\b[^>]*>([\s\S]*?)<\/b>/gi, (_, strong, bold) => `**${strong || bold || ""}**`)
        .replace(/<em\b[^>]*>([\s\S]*?)<\/em>|<i\b[^>]*>([\s\S]*?)<\/i>/gi, (_, em, italic) => `*${em || italic || ""}*`)
        .replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, (_, code) => `\`${decodeHtmlEntities(code).replace(/\n/g, " ")}\``)
        .replace(/<a\b[^>]*href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>([\s\S]*?)<\/a>/gi, (_, h1, h2, h3, label) => {
            const href = absoluteUrl(h1 || h2 || h3 || "", baseUrl);
            const cleanLabel = decodeHtmlEntities(String(label || "").replace(/<[^>]+>/g, "").trim());
            if (!href) return cleanLabel;
            if (!cleanLabel) return href;
            return `[${cleanLabel}](${href})`;
        })
        .replace(/<li\b[^>]*>/gi, "- ")
        .replace(/<\/li\s*>/gi, "\n")
        .replace(/<[^>]+>/g, "");

    text = decodeHtmlEntities(text);
    return normalizeMarkdownText(text);
}

function normalizeMarkdownText(text) {
    return String(text || "")
        .replace(/\r\n/g, "\n")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/^[ \t]+\[/gm, "[")
        .trim();
}

function cookedToMarkdown(cookedHtml, options = {}) {
    const baseUrl = options.baseUrl || (typeof window !== "undefined" ? window.location.href : "https://linux.do/");
    const doc = options.doc || (typeof document !== "undefined" ? document : null);
    if (!doc?.createElement) {
        return cookedToMarkdownFallback(cookedHtml, options);
    }

    const container = doc.createElement("div");
    container.innerHTML = cookedHtml || "";
    const imgMap = options.imgMap || buildRemoteImageMap(cookedHtml, baseUrl, doc);

    function serialize(node, inPre = false) {
        if (!node) return "";
        if (node.nodeType === 3) return node.nodeValue || "";
        if (node.nodeType !== 1) return "";

        const el = node;
        const tag = el.tagName.toLowerCase();
        if (el.classList?.contains("meta")) return "";

        if (tag === "aside" && el.classList.contains("quote")) {
            const titleLink = el.querySelector(".quote-title__text-content a") || el.querySelector(".title > a");
            const title = titleLink?.textContent?.trim() || "引用";
            const href = titleLink?.getAttribute("href") || "";
            const blockquote = el.querySelector("blockquote");
            const content = blockquote ? Array.from(blockquote.childNodes).map(child => serialize(child, inPre)).join("").trim() : "";
            const header = href ? `[${title}](${absoluteUrl(href, baseUrl)})` : title;
            const lines = content.split("\n").filter(line => line.trim());
            const quoteLines = [`> 引用：${header}`, ...lines.map(line => `> ${line}`)];
            return `\n${quoteLines.join("\n")}\n\n`;
        }

        if (tag === "br") return "\n";

        if (tag === "img") {
            const src = el.getAttribute("src") || el.getAttribute("data-src") || "";
            const emojiName = getDiscourseEmojiName(src);
            if (emojiName) {
                const emojiAlt = el.getAttribute("alt") || el.getAttribute("title") || "";
                return emojiAlt && emojiAlt.length <= 4 ? emojiAlt : `:${emojiName}:`;
            }

            const { asset, entry } = resolveImageMapEntry(el, imgMap, baseUrl);
            const imageSrc = entry?.renderedValue || entry?.preferredSrc || asset?.preferredSrc || absoluteUrl(src, baseUrl);
            if (!imageSrc) return "";
            const alt = el.getAttribute("alt") || "图片";
            return `\n![${alt}](${imageSrc})\n`;
        }

        if (tag === "a") {
            const href = el.getAttribute("href") || "";
            if ((el.getAttribute("class") || "").includes("anchor") || href.startsWith("#")) {
                return Array.from(el.childNodes).map(child => serialize(child, inPre)).join("").trim();
            }
            if (el.querySelector("img")) {
                return Array.from(el.childNodes).map(child => serialize(child, inPre)).join("");
            }
            const text = Array.from(el.childNodes).map(child => serialize(child, inPre)).join("").trim();
            const link = absoluteUrl(href, baseUrl);
            if (!link) return text;
            if (!text) return link;
            if (text === link) return `<${text}>`;
            return `[${text}](${link})`;
        }

        if (tag === "pre") {
            const codeEl = el.querySelector("code");
            const langClass = codeEl?.getAttribute("class") || "";
            const lang = (langClass.match(/lang(?:uage)?-([a-z0-9_+-]+)/i) || [])[1] || "";
            const code = (codeEl ? codeEl.textContent : el.textContent) || "";
            return `\n\`\`\`${lang}\n${code.replace(/\n+$/g, "")}\n\`\`\`\n\n`;
        }

        if (tag === "code") {
            if (inPre) return el.textContent || "";
            const text = (el.textContent || "").replace(/\n/g, " ");
            return text ? `\`${text}\`` : "";
        }

        if (tag === "blockquote") {
            const inner = Array.from(el.childNodes).map(child => serialize(child, inPre)).join("");
            const lines = inner.trim().split("\n");
            return `\n${lines.map(line => `> ${line}`).join("\n")}\n\n`;
        }

        if (/^h[1-6]$/.test(tag)) {
            const inner = Array.from(el.childNodes).map(child => serialize(child, inPre)).join("").trim();
            return inner ? `\n${getMarkdownHeadingPrefix(tag)} ${inner}\n\n` : "";
        }

        if (tag === "li") {
            const inner = Array.from(el.childNodes).map(child => serialize(child, inPre)).join("").trim();
            return inner ? `- ${inner}\n` : "";
        }

        if (tag === "ul" || tag === "ol") {
            const inner = Array.from(el.childNodes).map(child => serialize(child, inPre)).join("");
            return `\n${inner}\n`;
        }

        if (tag === "p") {
            const inner = Array.from(el.childNodes).map(child => serialize(child, inPre)).join("").trim();
            return inner ? `${inner}\n\n` : "\n";
        }

        if (tag === "strong" || tag === "b") {
            const inner = Array.from(el.childNodes).map(child => serialize(child, inPre)).join("");
            return `**${inner}**`;
        }

        if (tag === "em" || tag === "i") {
            const inner = Array.from(el.childNodes).map(child => serialize(child, inPre)).join("");
            return `*${inner}*`;
        }

        if (tag === "s" || tag === "del" || tag === "strike") {
            const inner = Array.from(el.childNodes).map(child => serialize(child, inPre)).join("");
            return `~~${inner}~~`;
        }

        if (tag === "table") {
            const tableMd = tableToMarkdown(el, serialize);
            return tableMd ? `\n${tableMd}\n\n` : "";
        }

        const nextInPre = inPre || tag === "pre";
        return Array.from(el.childNodes).map(child => serialize(child, nextInPre)).join("");
    }

    return normalizeMarkdownText(Array.from(container.childNodes).map(node => serialize(node, false)).join(""));
}

function normalizeMarkdownTags(tags) {
    const result = [];
    const seen = new Set();
    for (const tag of [...(Array.isArray(tags) ? tags : []), "linuxdo"]) {
        const normalized = String(typeof tag === "object" && tag ? tag.name || tag.slug || "" : tag || "").trim();
        if (!normalized) continue;
        const key = normalizeCaseKey(normalized);
        if (seen.has(key)) continue;
        seen.add(key);
        result.push(normalized);
    }
    return result;
}

function normalizeInteger(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.trunc(number) : fallback;
}

function normalizePositiveInteger(value, fallback = 1) {
    return Math.max(1, normalizeInteger(value, fallback));
}

function buildTopicInfoSection(details, exportedAt) {
    const tags = normalizeMarkdownTags(details.tags);
    const floors = normalizePositiveInteger(details.floors, 1);
    const lines = [
        `**原始链接**: [${details.url || ""}](${details.url || ""})`,
        `**主题 ID**: ${details.topicId || ""}`,
        `**楼主**: @${details.author || "未知"}`,
        `**分类**: ${details.category || "无"}`,
        `**标签**: ${tags.join(", ")}`,
        `**导出时间**: ${exportedAt.toLocaleString("zh-CN")}`,
        `**楼层数**: ${floors}`
    ];

    return `## 帖子信息\n\n${lines.map(line => `- ${line}`).join("\n")}\n\n`;
}

function buildMarkdownDocument(details) {
    const body = typeof details.body === "string"
        ? details.body
        : typeof details.raw === "string"
            ? details.raw
            : "";
    const exportedAt = details.exportedAt instanceof Date ? details.exportedAt : new Date(details.exportedAt || Date.now());
    const tags = normalizeMarkdownTags(details.tags);
    const tagLines = tags.length ? tags.map(tag => `  - ${yamlString(tag)}`) : ["  - \"linuxdo\""];
    const floors = normalizePositiveInteger(details.floors, 1);
    const metadata = [
        "---",
        `source: ${yamlString(details.url)}`,
        `topic_id: ${yamlString(details.topicId)}`,
        `post_id: ${yamlString(details.postId)}`,
        `title: ${yamlString(details.title)}`,
        `author: ${yamlString(details.author)}`,
        `category: ${yamlString(details.category)}`,
        "tags:",
        ...tagLines,
        `created_at: ${yamlString(details.createdAt)}`,
        `export_time: ${yamlString(exportedAt.toISOString())}`,
        `floors: ${floors}`,
        "exported_from: \"flowreader\"",
        "---",
        ""
    ].join("\n");
    const title = String(details.title || "无标题").trim() || "无标题";
    const content = `# ${title}\n\n${buildTopicInfoSection({ ...details, floors }, exportedAt)}${body}${body.endsWith("\n") ? "" : "\n"}`;

    return `${metadata}${content}`;
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
    if (!postData || (typeof postData.cooked !== "string" && typeof postData.raw !== "string")) {
        postData = await fetchJson(buildPostApiUrl(locationLike.origin, mainPostInfo.id), fetchImpl, context);
    }

    if (typeof postData?.cooked !== "string" && typeof postData?.raw !== "string") {
        throw new Error("主帖 API 响应中缺少 cooked HTML 或 raw Markdown 内容");
    }

    const doc = options.doc || (typeof document !== "undefined" ? document : null);
    const sourceUrl = normalizeSourceUrl(locationLike);
    const title = topicData.title || postData.topic_slug || `linuxdo-${currentTopicID}`;
    const body = typeof postData.cooked === "string"
        ? cookedToMarkdown(postData.cooked, { baseUrl: sourceUrl, doc })
        : postData.raw;
    const filename = buildMarkdownFilename({ title, topicId: currentTopicID });
    const topicFloors = normalizePositiveInteger(topicData.posts_count || topicData.highest_post_number, 1);
    const markdown = buildMarkdownDocument({
        body,
        raw: postData.raw,
        url: sourceUrl,
        topicId: currentTopicID,
        postId: postData.id || mainPostInfo.id,
        title,
        author: topicData?.details?.created_by?.username || postData.username,
        category: topicData.category || doc?.querySelector?.(".badge-category__name")?.textContent?.trim() || "",
        tags: topicData.tags,
        floors: topicFloors,
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
    const timeoutMs = options.timeoutMs ?? MAIN_TOPIC_TIMING_TIMEOUT_MS;
    const AbortControllerImpl = options.AbortControllerImpl || (
        typeof AbortController !== "undefined" ? AbortController : null
    );
    const controller = AbortControllerImpl && Number.isFinite(timeoutMs) && timeoutMs > 0
        ? new AbortControllerImpl()
        : null;
    const timeoutId = controller
        ? setTimeout(() => controller.abort(), timeoutMs)
        : null;

    try {
        const response = await fetchImpl(`${currentProtocol}//${currentDomain}/topics/timings`, {
            headers: createTimingHeaders(options.csrfToken),
            referrer: `${currentProtocol}//${currentDomain}/`,
            body: params.toString(),
            method: "POST",
            mode: "cors",
            credentials: "include",
            ...(controller ? { signal: controller.signal } : {})
        });

        if (!response.ok) {
            throw new Error(`HTTP请求失败，状态码：${response.status}`);
        }

        return true;
    } catch (error) {
        console.error(`浏览主帖 ${currentTopicID} 失败: `, error);

        if (retryCount > 0) {
            await new Promise(r => setTimeout(r, options.retryDelayMs ?? 2000));
            return sendMainTopicTiming(currentTopicID, retryCount - 1, options);
        }

        return false;
    } finally {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
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

// 路由切换后推进主帖浏览状态机：来源页进入话题页，话题页记录主帖后返回来源页。
async function continueMainTopicBrowsingSession(options = {}) {
    const now = options.now || Date.now();
    let session = getMainTopicBrowsingSession(options.storageGetter, now);
    if (!session) {
        return false;
    }

    const doc = options.doc || document;
    const locationLike = options.locationLike || window.location;
    const showStatusImpl = options.showStatusImpl || showStatus;
    const storageSetter = options.storageSetter;
    const delayImpl = options.delayImpl || (ms => new Promise(resolve => setTimeout(resolve, ms)));

    if (isSupportedHomePage(locationLike)) {
        if (session.phase === "topic") {
            const readTopicCount = getReadMainTopicIds(options.storageGetter).length;
            showStatusImpl(
                `检测到已手动返回首页，已停止本轮主帖浏览，已记录 ${readTopicCount} 个主帖`,
                "warning"
            );
            clearMainTopicBrowsingSession(storageSetter);
            return true;
        }

        if (session.phase === "complete" || session.index >= session.topics.length) {
            showStatusImpl(
                `主帖浏览完成：成功 ${session.successCount}，失败 ${session.failedCount}，已记录 ${getReadMainTopicIds(options.storageGetter).length} 个主帖`,
                session.failedCount > 0 ? "warning" : "success"
            );
            clearMainTopicBrowsingSession(storageSetter);
            return true;
        }

        const topic = getCurrentMainTopicSessionItem(session);
        if (!topic) {
            clearMainTopicBrowsingSession(storageSetter);
            return false;
        }

        session = saveMainTopicBrowsingSession({
            ...session,
            phase: "topic"
        }, storageSetter, now);
        showStatusImpl(`进入主帖 ${session.index + 1} / ${session.topics.length}：${topic.title}`, "success");
        navigateToMainTopicFromHome(topic, {
            doc,
            locationLike,
            navigate: options.navigate
        });
        return true;
    }

    if (!canExportMarkdown(locationLike)) {
        return false;
    }

    const topic = getCurrentMainTopicSessionItem(session);
    const currentTopicID = getTopicID(locationLike.pathname ?? "");
    if (!topic || String(topic.id) !== currentTopicID) {
        return false;
    }

    const topicUnavailable = Boolean(options.topicUnavailable || isTopicUnavailablePage(doc));
    const topicContextUnavailable = Boolean(options.topicContextUnavailable);
    const csrfToken = getCsrfToken(doc);
    if (topicUnavailable) {
        showStatusImpl(`主帖可能已被删除或屏蔽，已跳过并返回主页：${topic.title}`, "warning");
    } else if (topicContextUnavailable) {
        showStatusImpl(`主帖加载超时，已跳过并返回主页：${topic.title}`, "warning");
    }

    const success = !topicUnavailable && !topicContextUnavailable && csrfToken
        ? await sendMainTopicTiming(currentTopicID, 3, {
            csrfToken,
            fetchImpl: options.fetchImpl,
            timeoutMs: options.timingTimeoutMs,
            retryDelayMs: options.timingRetryDelayMs,
            AbortControllerImpl: options.AbortControllerImpl
        })
        : false;
    let readTopicIds = getReadMainTopicIds(options.storageGetter);

    if (success) {
        readTopicIds = saveReadMainTopicIds(
            mergeReadMainTopicIds(readTopicIds, currentTopicID),
            storageSetter
        );
        session = {
            ...session,
            index: session.index + 1,
            phase: session.index + 1 >= session.topics.length ? "complete" : "returning",
            successCount: session.successCount + 1,
            consecutiveFailureCount: 0
        };
    } else {
        session = {
            ...session,
            index: session.index + 1,
            phase: session.index + 1 >= session.topics.length ? "complete" : "returning",
            failedCount: session.failedCount + 1,
            consecutiveFailureCount: session.consecutiveFailureCount + 1
        };
    }

    if (shouldStopMainTopicBrowsing(session.consecutiveFailureCount)) {
        showStatusImpl(
            `连续 ${MAIN_TOPIC_MAX_CONSECUTIVE_FAILURES} 个主帖浏览失败，已停止。成功 ${session.successCount}，失败 ${session.failedCount}，已记录 ${readTopicIds.length} 个主帖。请检查网络或登录状态后重试。`,
            "error"
        );
        clearMainTopicBrowsingSession(storageSetter);
        returnToMainTopicSource(session, {
            navigate: options.navigate,
            historyBack: options.historyBack
        });
        return true;
    }

    saveMainTopicBrowsingSession(session, storageSetter, now);
    const delay = topicUnavailable || topicContextUnavailable ? 0 : config.baseDelay + getRandomInt(0, config.randomDelayRange);
    await delayImpl(delay);
    returnToMainTopicSource(session, {
        navigate: options.navigate,
        historyBack: options.historyBack
    });
    return true;
}

// 开始浏览首页可见主帖
async function startReadingMainTopics(options = {}) {
    (options.syncState ?? syncRuntimeState)();

    const doc = options.doc || document;
    const locationLike = options.locationLike || window.location;
    const showStatusImpl = options.showStatusImpl || showStatus;
    if (!isSupportedHomePage(locationLike)) {
        showStatusImpl("当前页面不支持浏览主帖", "warning");
        return;
    }

    const topics = collectHomeTopicItems(doc, locationLike);
    if (topics.length === 0) {
        showStatusImpl("当前页面未找到可浏览主帖", "warning");
        return;
    }

    let readTopicIds = getReadMainTopicIds(options.storageGetter);
    const unreadTopics = filterUnreadHomeTopicItems(topics, readTopicIds);
    if (unreadTopics.length === 0) {
        showStatusImpl("当前已加载主帖都已浏览，请向下滚动加载更多主帖后继续", "warning");
        return;
    }

    const button = options.button || doc.querySelector('[data-flowreader-role="home-main-topics-button"]');
    if (button) {
        button.disabled = true;
    }
    setButtonLabel(button, "进入主帖...");

    try {
        const session = createMainTopicBrowsingSession(
            unreadTopics,
            locationLike.href || `${locationLike.origin}${locationLike.pathname}`,
            options.now || Date.now()
        );
        if (!session) {
            showStatusImpl("主帖浏览会话创建失败，请刷新页面后重试", "error");
            return;
        }

        saveMainTopicBrowsingSession(session, options.storageSetter, options.now || Date.now());
        showStatusImpl(`进入主帖 1 / ${unreadTopics.length}：${unreadTopics[0].title}`, "success");
        navigateToMainTopicFromHome(unreadTopics[0], {
            doc,
            locationLike,
            navigate: options.navigate
        });
        scheduleMainTopicNavigationChecks(options.scheduleRouteCheck, options.scheduler);
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
        cookedToMarkdown,
        canExportMarkdown,
        collectImageAssetsFromHtml,
        continueMainTopicBrowsingSession,
        collectMainPostMarkdown,
        collectHomeTopicItems,
        cleanupScriptUI,
        createMainTopicBrowsingSession,
        createMainTopicTimingParams,
        findHomeTopicLink,
        filterUnreadHomeTopicItems,
        getCurrentMainTopicSessionItem,
        getHomeBrowseButtonLabel,
        getRouteSignature,
        getPageContext,
        handleRouteChange,
        isCurrentMainTopicBrowsingSessionRoute,
        isTopicUnavailablePage,
        isSupportedHomePage,
        mergeReadMainTopicIds,
        navigateToMainTopicFromHome,
        normalizeMainTopicIdList,
        normalizeMainTopicBrowsingSession,
        parseTopicUrl,
        pickMainPost,
        parseRepliesInfo,
        returnToMainTopicSource,
        resolveSettingsMountPoint,
        sanitizeFileName,
        sendMainTopicTiming,
        startReadingMainTopics,
        stopMainTopicBrowsingSession,
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
