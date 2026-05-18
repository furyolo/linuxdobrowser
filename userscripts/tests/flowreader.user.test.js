const test = require("node:test");
const assert = require("node:assert/strict");

const {
    buildMarkdownDocument,
    canExportMarkdown,
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
    getPageContext,
    resolveSettingsMountPoint,
    sanitizeFileName,
    sendMainTopicTiming,
    shouldStopMainTopicBrowsing
} = require("../flowreader.user.js");

function createFakeDocument(selectorMap, selectorAllMap = {}, textContent = "") {
    return {
        body: { textContent },
        documentElement: { textContent },
        querySelector(selector) {
            return selectorMap[selector] ?? null;
        },
        querySelectorAll(selector) {
            return selectorAllMap[selector] ?? [];
        }
    };
}

function createFakeAnchor(href, textContent = "", title = "") {
    const calls = [];
    return {
        href,
        textContent,
        calls,
        getAttribute(name) {
            if (name === "href") {
                return href;
            }
            if (name === "title") {
                return title;
            }
            return null;
        },
        removeAttribute(name) {
            calls.push(`remove:${name}`);
        },
        scrollIntoView() {
            calls.push("scroll");
        },
        click() {
            calls.push("click");
        }
    };
}

class FakeAbortController {
    constructor() {
        this.signal = {
            aborted: false,
            listeners: [],
            addEventListener(type, listener) {
                if (type === "abort") {
                    this.listeners.push(listener);
                }
            }
        };
    }

    abort() {
        this.signal.aborted = true;
        for (const listener of this.signal.listeners) {
            listener();
        }
    }
}

test("新版页面缺少 header-buttons 时，仍能回退到 timeline-controls", () => {
    const timelineControls = { className: "timeline-controls" };
    const doc = createFakeDocument({
        ".timeline-controls": timelineControls
    });

    assert.equal(resolveSettingsMountPoint(doc), timelineControls);
});

test("可以解析时间轴中的当前楼层与总楼层", () => {
    assert.deepEqual(parseRepliesInfo(" 1 / 19 "), {
        currentPosition: 1,
        totalReplies: 19
    });
});

test("可以从页面中提取阅读所需上下文", () => {
    const doc = createFakeDocument({
        ".timeline-replies": {
            textContent: " 1 / 19 "
        },
        'meta[name="csrf-token"]': {
            getAttribute(name) {
                return name === "content" ? "token-123" : null;
            }
        }
    });

    assert.deepEqual(
        getPageContext(doc, { pathname: "/t/topic/1911755/1" }),
        {
            currentPosition: 1,
            totalReplies: 19,
            csrfToken: "token-123",
            topicID: "1911755"
        }
    );
});

test("不同话题路由应生成新的签名", () => {
    assert.equal(
        getRouteSignature({ pathname: "/t/topic/1912000/1" }),
        "topic:1912000"
    );
});

test("LinuxDo 首页应生成独立的主帖浏览路由签名", () => {
    assert.equal(
        getRouteSignature({ hostname: "linux.do", pathname: "/" }),
        "home:/"
    );
    assert.equal(
        getRouteSignature({ hostname: "linux.do", pathname: "/latest" }),
        "home:/latest"
    );
    assert.equal(
        getRouteSignature({ hostname: "idcflare.com", pathname: "/" }),
        null
    );
});

test("只在 LinuxDo 首页支持浏览主帖", () => {
    assert.equal(isSupportedHomePage({ hostname: "linux.do", pathname: "/" }), true);
    assert.equal(isSupportedHomePage({ hostname: "linux.do", pathname: "/latest" }), true);
    assert.equal(isSupportedHomePage({ hostname: "linux.do", pathname: "/t/topic/1912000/1" }), false);
    assert.equal(isSupportedHomePage({ hostname: "idcflare.com", pathname: "/" }), false);
});

test("可以解析 LinuxDo 话题链接中的 topic id", () => {
    assert.deepEqual(
        parseTopicUrl("/t/topic/1912000/1", "https://linux.do/latest"),
        {
            id: "1912000",
            url: "https://linux.do/t/topic/1912000/1"
        }
    );
    assert.equal(parseTopicUrl("/t/topic/not-a-number/1", "https://linux.do/latest"), null);
    assert.equal(parseTopicUrl("https://example.com/t/topic/1912000/1", "https://linux.do/"), null);
});

test("首页路由初始化不应等待话题时间轴，也不应自动浏览跟帖", async () => {
    const calls = [];
    const runtimeState = {
        lastRouteSignature: null
    };

    const handled = await handleRouteChange(runtimeState, {
        locationLike: { hostname: "linux.do", pathname: "/" },
        waitForContext: async () => calls.push("wait"),
        syncState: () => calls.push("sync"),
        cleanupUI: () => calls.push("cleanup"),
        setupUI: () => calls.push("setup"),
        startReading: async () => calls.push("start"),
        config: { autoStart: true }
    });

    assert.equal(handled, true);
    assert.equal(runtimeState.lastRouteSignature, "home:/");
    assert.deepEqual(calls, ["sync", "cleanup", "setup"]);
});

test("首页主帖收集应按页面顺序去重并跳过无效链接", () => {
    const links = [
        createFakeAnchor("/t/topic/1912000/1", "第一个主题"),
        createFakeAnchor("/t/topic/1912000/2", "重复主题"),
        createFakeAnchor("https://linux.do/t/topic/1912001/1", "第二个主题"),
        createFakeAnchor("https://example.com/t/topic/1912002/1", "外站主题"),
        createFakeAnchor("/not-topic", "无效链接")
    ];
    const doc = createFakeDocument({}, {
        'a[href*="/t/"]': links
    });

    assert.deepEqual(
        collectHomeTopicItems(doc, {
            href: "https://linux.do/latest",
            origin: "https://linux.do",
            pathname: "/latest"
        }),
        [
            {
                id: "1912000",
                url: "https://linux.do/t/topic/1912000/1",
                title: "第一个主题"
            },
            {
                id: "1912001",
                url: "https://linux.do/t/topic/1912001/1",
                title: "第二个主题"
            }
        ]
    );
});

test("首页主帖进度应清理无效值并保持顺序去重", () => {
    assert.deepEqual(
        normalizeMainTopicIdList('["1912000","bad","1912001","1912000"]'),
        ["1912000", "1912001"]
    );
    assert.deepEqual(
        mergeReadMainTopicIds(["1912000"], "1912001"),
        ["1912000", "1912001"]
    );
});

test("首页主帖进度应按上限保留最近记录", () => {
    assert.deepEqual(
        normalizeMainTopicIdList(["1912000", "1912001", "1912002"], 2),
        ["1912001", "1912002"]
    );
    assert.deepEqual(
        mergeReadMainTopicIds(["1912000", "1912001"], "1912002", 2),
        ["1912001", "1912002"]
    );
});

test("继续浏览主帖时应跳过已浏览 ID", () => {
    const topics = [
        { id: "1912000", title: "已浏览" },
        { id: "1912001", title: "新主题" }
    ];

    assert.deepEqual(
        filterUnreadHomeTopicItems(topics, ["1912000"]),
        [{ id: "1912001", title: "新主题" }]
    );
});

test("首页主帖按钮文案应随进度切换", () => {
    assert.equal(getHomeBrowseButtonLabel(0), "FlowReader 浏览主帖");
    assert.equal(getHomeBrowseButtonLabel(3), "FlowReader 继续浏览主帖");
});

test("首页主帖连续失败达到阈值后应停止本轮浏览", () => {
    assert.equal(shouldStopMainTopicBrowsing(2), false);
    assert.equal(shouldStopMainTopicBrowsing(3), true);
    assert.equal(shouldStopMainTopicBrowsing(2, 2), true);
});

test("主帖浏览请求参数只标记一楼主帖", () => {
    const params = createMainTopicTimingParams("1912000", 1200);

    assert.equal(params.get("topic_id"), "1912000");
    assert.equal(params.get("timings[1]"), "1200");
    assert.equal(params.get("topic_time"), "1200");
    assert.equal([...params.keys()].includes("timings[2]"), false);
});

test("主帖浏览 timing 请求超时后应返回失败", async () => {
    const originalConsoleError = console.error;
    console.error = () => {};
    try {
        const result = await sendMainTopicTiming("1912000", 0, {
            csrfToken: "csrf-123",
            timeoutMs: 1,
            AbortControllerImpl: FakeAbortController,
            fetchImpl: async (url, options) => new Promise((resolve, reject) => {
                options.signal.addEventListener("abort", () => reject(new Error("AbortError")));
            })
        });

        assert.equal(result, false);
    } finally {
        console.error = originalConsoleError;
    }
});

test("主帖浏览会话应保存当前 Tab 导航队列", () => {
    const session = createMainTopicBrowsingSession([
        { id: "1912000", url: "https://linux.do/t/topic/1912000/1", title: "第一个主题" },
        { id: "bad", url: "https://linux.do/t/topic/bad/1", title: "无效主题" },
        { id: "1912001", url: "", title: "缺少链接" }
    ], "https://linux.do/latest", 1000);

    assert.deepEqual(session.topics, [
        { id: "1912000", url: "https://linux.do/t/topic/1912000/1", title: "第一个主题" }
    ]);
    assert.equal(session.index, 0);
    assert.equal(session.phase, "home");
    assert.deepEqual(getCurrentMainTopicSessionItem(session), session.topics[0]);
});

test("过期主帖浏览会话应被丢弃", () => {
    assert.equal(
        normalizeMainTopicBrowsingSession({
            topics: [{ id: "1912000", url: "https://linux.do/t/topic/1912000/1" }],
            updatedAt: 1000
        }, 1000 + 61 * 60 * 1000),
        null
    );
});

test("当前 Tab 浏览应优先点击首页中匹配的主帖链接", () => {
    const first = createFakeAnchor("/t/topic/1912000/1", "第一个主题");
    const second = createFakeAnchor("/t/topic/1912001/1", "第二个主题");
    const doc = createFakeDocument({}, {
        'a[href*="/t/"]': [first, second]
    });
    const locationLike = {
        href: "https://linux.do/latest",
        origin: "https://linux.do",
        pathname: "/latest"
    };

    assert.equal(findHomeTopicLink({ id: "1912001" }, doc, locationLike), second);
    assert.equal(
        navigateToMainTopicFromHome({ id: "1912001", url: "https://linux.do/t/topic/1912001/1" }, {
            doc,
            locationLike,
            navigate: () => assert.fail("已有链接时不应直接跳转")
        }),
        "click"
    );
    assert.deepEqual(second.calls, ["scroll", "remove:target", "click"]);
});

test("找不到首页链接时应回退为当前 Tab 直接跳转", () => {
    const navigated = [];
    const doc = createFakeDocument({}, {
        'a[href*="/t/"]': []
    });

    assert.equal(
        navigateToMainTopicFromHome({ id: "1912001", url: "https://linux.do/t/topic/1912001/1" }, {
            doc,
            locationLike: {
                href: "https://linux.do/latest",
                origin: "https://linux.do",
                pathname: "/latest"
            },
            navigate: url => navigated.push(url)
        }),
        "assign"
    );
    assert.deepEqual(navigated, ["https://linux.do/t/topic/1912001/1"]);
});

test("话题页会话应记录主帖并返回来源页继续", async () => {
    const store = new Map();
    const storageGetter = (key, defaultValue) => store.has(key) ? store.get(key) : defaultValue;
    const storageSetter = (key, value) => store.set(key, value);
    storageSetter("flowreader.mainTopicBrowsingSession", JSON.stringify({
        active: true,
        sourceUrl: "https://linux.do/latest",
        topics: [{ id: "1912000", url: "https://linux.do/t/topic/1912000/1", title: "第一个主题" }],
        index: 0,
        phase: "topic",
        successCount: 0,
        failedCount: 0,
        consecutiveFailureCount: 0,
        startedAt: 1000,
        updatedAt: 1000
    }));

    const historyCalls = [];
    const fetchCalls = [];
    const doc = createFakeDocument({
        'meta[name="csrf-token"]': {
            getAttribute(name) {
                return name === "content" ? "csrf-123" : null;
            }
        }
    });

    const handled = await continueMainTopicBrowsingSession({
        doc,
        locationLike: {
            hostname: "linux.do",
            pathname: "/t/topic/1912000/1"
        },
        storageGetter,
        storageSetter,
        fetchImpl: async (url, options) => {
            fetchCalls.push({ url, options });
            return { ok: true };
        },
        delayImpl: async () => {},
        historyBack: () => historyCalls.push("back"),
        now: 2000
    });

    assert.equal(handled, true);
    assert.deepEqual(historyCalls, ["back"]);
    assert.equal(fetchCalls.length, 1);
    assert.match(storageGetter("flowreader.mainTopicReadIds", ""), /1912000/);
    assert.equal(
        normalizeMainTopicBrowsingSession(storageGetter("flowreader.mainTopicBrowsingSession", ""), 2000).phase,
        "complete"
    );
});

test("不可用话题页应被识别并跳过返回主页", async () => {
    const store = new Map();
    const storageGetter = (key, defaultValue) => store.has(key) ? store.get(key) : defaultValue;
    const storageSetter = (key, value) => store.set(key, value);
    storageSetter("flowreader.mainTopicBrowsingSession", JSON.stringify({
        active: true,
        sourceUrl: "https://linux.do/latest",
        topics: [{ id: "1912000", url: "https://linux.do/t/topic/1912000/1", title: "失效主题" }],
        index: 0,
        phase: "topic",
        successCount: 0,
        failedCount: 0,
        consecutiveFailureCount: 0,
        startedAt: 1000,
        updatedAt: 1000
    }));

    const doc = createFakeDocument({}, {}, "抱歉，我们无法加载该话题，可能是由于连接问题。请重试。");
    const statuses = [];
    const historyCalls = [];
    const fetchCalls = [];
    const delays = [];

    assert.equal(isTopicUnavailablePage(doc), true);
    const handled = await continueMainTopicBrowsingSession({
        doc,
        locationLike: {
            hostname: "linux.do",
            pathname: "/t/topic/1912000/1"
        },
        storageGetter,
        storageSetter,
        fetchImpl: async () => {
            fetchCalls.push("fetch");
            return { ok: true };
        },
        delayImpl: async delay => delays.push(delay),
        historyBack: () => historyCalls.push("back"),
        showStatusImpl: (message, type) => statuses.push({ message, type }),
        now: 2000
    });

    const session = normalizeMainTopicBrowsingSession(
        storageGetter("flowreader.mainTopicBrowsingSession", ""),
        2000
    );
    assert.equal(handled, true);
    assert.deepEqual(fetchCalls, []);
    assert.deepEqual(delays, [0]);
    assert.deepEqual(historyCalls, ["back"]);
    assert.equal(session.failedCount, 1);
    assert.equal(session.phase, "complete");
    assert.equal(storageGetter("flowreader.mainTopicReadIds", "[]"), "[]");
    assert.equal(statuses[0].type, "warning");
    assert.match(statuses[0].message, /已跳过并返回主页/);
});

test("话题上下文加载超时应跳过当前主帖并返回主页", async () => {
    const store = new Map();
    const storageGetter = (key, defaultValue) => store.has(key) ? store.get(key) : defaultValue;
    const storageSetter = (key, value) => store.set(key, value);
    storageSetter("flowreader.mainTopicBrowsingSession", JSON.stringify({
        active: true,
        sourceUrl: "https://linux.do/latest",
        topics: [{ id: "1912000", url: "https://linux.do/t/topic/1912000/1", title: "慢加载主题" }],
        index: 0,
        phase: "topic",
        successCount: 0,
        failedCount: 0,
        consecutiveFailureCount: 0,
        startedAt: 1000,
        updatedAt: 1000
    }));

    const statuses = [];
    const historyCalls = [];
    const fetchCalls = [];
    const handled = await continueMainTopicBrowsingSession({
        doc: createFakeDocument({}, {}),
        locationLike: {
            hostname: "linux.do",
            pathname: "/t/topic/1912000/1"
        },
        storageGetter,
        storageSetter,
        topicContextUnavailable: true,
        fetchImpl: async () => {
            fetchCalls.push("fetch");
            return { ok: true };
        },
        delayImpl: async delay => assert.equal(delay, 0),
        historyBack: () => historyCalls.push("back"),
        showStatusImpl: (message, type) => statuses.push({ message, type }),
        now: 2000
    });

    const session = normalizeMainTopicBrowsingSession(
        storageGetter("flowreader.mainTopicBrowsingSession", ""),
        2000
    );
    assert.equal(handled, true);
    assert.deepEqual(fetchCalls, []);
    assert.deepEqual(historyCalls, ["back"]);
    assert.equal(session.failedCount, 1);
    assert.equal(session.phase, "complete");
    assert.equal(statuses[0].type, "warning");
    assert.match(statuses[0].message, /加载超时/);
});

test("来源页完成态会清空主帖浏览会话", async () => {
    const store = new Map();
    const storageGetter = (key, defaultValue) => store.has(key) ? store.get(key) : defaultValue;
    const storageSetter = (key, value) => store.set(key, value);
    const statuses = [];
    storageSetter("flowreader.mainTopicBrowsingSession", JSON.stringify({
        active: true,
        sourceUrl: "https://linux.do/latest",
        topics: [{ id: "1912000", url: "https://linux.do/t/topic/1912000/1", title: "第一个主题" }],
        index: 1,
        phase: "complete",
        successCount: 1,
        failedCount: 0,
        consecutiveFailureCount: 0,
        startedAt: 1000,
        updatedAt: 1000
    }));
    storageSetter("flowreader.mainTopicReadIds", JSON.stringify(["1912000"]));

    const handled = await continueMainTopicBrowsingSession({
        doc: createFakeDocument({}, { 'a[href*="/t/"]': [] }),
        locationLike: { hostname: "linux.do", pathname: "/latest" },
        storageGetter,
        storageSetter,
        showStatusImpl: (message, type) => statuses.push({ message, type }),
        now: 2000
    });

    assert.equal(handled, true);
    assert.deepEqual(statuses, [{
        message: "主帖浏览完成：成功 1，失败 0，已记录 1 个主帖",
        type: "success"
    }]);
    assert.equal(storageGetter("flowreader.mainTopicBrowsingSession", "missing"), "");
});

test("返回来源页应优先使用浏览器历史", () => {
    const calls = [];
    assert.equal(
        returnToMainTopicSource({ sourceUrl: "https://linux.do/latest" }, {
            historyBack: () => calls.push("back"),
            navigate: url => calls.push(url)
        }),
        "back"
    );
    assert.deepEqual(calls, ["back"]);
});

test("只有 Linux.do 话题页显示 Markdown 导出动作", () => {
    assert.equal(
        canExportMarkdown({ hostname: "linux.do", pathname: "/t/topic/1912000/1" }),
        true
    );
    assert.equal(
        canExportMarkdown({ hostname: "idcflare.com", pathname: "/t/topic/1912000/1" }),
        false
    );
    assert.equal(
        canExportMarkdown({ hostname: "linux.do", pathname: "/latest" }),
        false
    );
});

test("切到新话题时应执行重初始化并在自动运行开启时继续阅读", async () => {
    const calls = [];
    const runtimeState = {
        lastRouteSignature: "topic:1911755"
    };

    const handled = await handleRouteChange(runtimeState, {
        locationLike: { pathname: "/t/topic/1912000/1" },
        waitForContext: async () => ({}),
        syncState: () => ({}),
        cleanupUI: () => calls.push("cleanup"),
        setupUI: () => calls.push("setup"),
        startReading: async () => calls.push("start"),
        config: { autoStart: true }
    });

    assert.equal(handled, true);
    assert.equal(runtimeState.lastRouteSignature, "topic:1912000");
    assert.deepEqual(calls, ["cleanup", "setup", "start"]);
});

test("路由切到不可用话题时应跳过 UI 初始化并推进主帖兜底", async () => {
    const calls = [];
    const runtimeState = {
        lastRouteSignature: "home:/latest"
    };
    const doc = createFakeDocument({}, {}, "抱歉，我们无法加载该话题，可能是由于连接问题。请重试。");

    const handled = await handleRouteChange(runtimeState, {
        doc,
        locationLike: { hostname: "linux.do", pathname: "/t/topic/1912000/1" },
        waitForContext: async () => {
            throw new Error("未找到时间轴或 CSRF 信息");
        },
        syncState: () => {
            calls.push("sync");
            return null;
        },
        cleanupUI: () => calls.push("cleanup"),
        setupUI: () => calls.push("setup"),
        startReading: async () => calls.push("start"),
        continueMainTopics: async options => calls.push(`fallback:${options.topicUnavailable}`),
        config: { autoStart: true }
    });

    assert.equal(handled, true);
    assert.equal(runtimeState.lastRouteSignature, "topic:1912000");
    assert.deepEqual(calls, ["sync", "cleanup", "fallback:true"]);
});

test("路由切到慢加载话题时应在主帖会话内推进超时兜底", async () => {
    const calls = [];
    const store = new Map();
    const storageGetter = (key, defaultValue) => store.has(key) ? store.get(key) : defaultValue;
    const storageSetter = (key, value) => store.set(key, value);
    storageSetter("flowreader.mainTopicBrowsingSession", JSON.stringify({
        active: true,
        sourceUrl: "https://linux.do/latest",
        topics: [{ id: "1912000", url: "https://linux.do/t/topic/1912000/1", title: "慢加载主题" }],
        index: 0,
        phase: "topic",
        successCount: 0,
        failedCount: 0,
        consecutiveFailureCount: 0,
        startedAt: 1000,
        updatedAt: 1000
    }));
    const runtimeState = {
        lastRouteSignature: "home:/latest"
    };
    const locationLike = { hostname: "linux.do", pathname: "/t/topic/1912000/1" };

    assert.equal(isCurrentMainTopicBrowsingSessionRoute(locationLike, storageGetter, 2000), true);
    const handled = await handleRouteChange(runtimeState, {
        doc: createFakeDocument({}, {}),
        locationLike,
        storageGetter,
        waitForContext: async () => {
            throw new Error("未找到时间轴或 CSRF 信息");
        },
        syncState: () => {
            calls.push("sync");
            return null;
        },
        cleanupUI: () => calls.push("cleanup"),
        setupUI: () => calls.push("setup"),
        startReading: async () => calls.push("start"),
        continueMainTopics: async options => calls.push(`fallback:${options.topicUnavailable}:${options.topicContextUnavailable}`),
        config: { autoStart: true },
        now: 2000
    });

    assert.equal(handled, true);
    assert.equal(runtimeState.lastRouteSignature, "topic:1912000");
    assert.deepEqual(calls, ["sync", "cleanup", "fallback:false:true"]);
});

test("同一话题重复触发时不应重复重初始化", async () => {
    const calls = [];
    const runtimeState = {
        lastRouteSignature: "topic:1912000"
    };

    const handled = await handleRouteChange(runtimeState, {
        locationLike: { pathname: "/t/topic/1912000/5" },
        waitForContext: async () => ({}),
        syncState: () => ({}),
        cleanupUI: () => calls.push("cleanup"),
        setupUI: () => calls.push("setup"),
        startReading: async () => calls.push("start"),
        config: { autoStart: true }
    });

    assert.equal(handled, false);
    assert.deepEqual(calls, []);
});

test("清理逻辑应移除旧的脚本按钮", () => {
    const removed = [];
    const settingsButton = {
        remove() {
            removed.push("settings");
        }
    };
    const floatWrapper = {
        remove() {
            removed.push("float");
        }
    };
    const doc = createFakeDocument(
        {},
        {
            '[data-flowreader-role="settings-button"]': [settingsButton],
            '[data-flowreader-role="float-button-wrapper"]': [floatWrapper]
        }
    );

    cleanupScriptUI(doc);

    assert.deepEqual(removed, ["settings", "float"]);
});

test("Markdown 导出应优先选择 post_number 为 1 的主帖", () => {
    const topicData = {
        post_stream: {
            posts: [
                { id: 20, post_number: 2 },
                { id: 10, post_number: 1 }
            ]
        }
    };

    assert.deepEqual(pickMainPost(topicData), {
        id: 10,
        post: { id: 10, post_number: 1 }
    });
});

test("Markdown 导出应保留 raw 正文内容", () => {
    const raw = "# 标题\n\n- A\n- B\n";
    const markdown = buildMarkdownDocument({
        raw,
        url: "https://linux.do/t/topic/1",
        topicId: "1",
        postId: "10",
        title: "测试",
        author: "author",
        createdAt: "2026-05-16T12:00:00Z"
    });

    assert.ok(markdown.startsWith("---\n"));
    assert.ok(markdown.endsWith(raw));
});

test("Markdown 导出文件名应移除 Windows 非法字符", () => {
    assert.equal(
        sanitizeFileName('linuxdo-1-a/b:c*d?"e<f>g|'),
        "linuxdo-1-a-b-c-d--e-f-g-"
    );
});

test("topic 响应无 raw 时，FlowReader 会回退请求单帖 API", async () => {
    const calls = [];
    const requestOptions = [];
    const fetchImpl = async (url, options) => {
        calls.push(url);
        requestOptions.push(options);

        if (url.endsWith("/t/2005411.json")) {
            return {
                ok: true,
                json: async () => ({
                    title: "导出测试",
                    post_stream: {
                        posts: [{ id: 99, post_number: 1, username: "op" }]
                    }
                })
            };
        }

        return {
            ok: true,
            json: async () => ({
                id: 99,
                raw: "原始 **Markdown**",
                username: "op",
                created_at: "2026-05-16T12:00:00Z"
            })
        };
    };

    const result = await collectMainPostMarkdown({
        fetchImpl,
        context: {
            csrfToken: "csrf-123"
        },
        locationLike: {
            hostname: "linux.do",
            origin: "https://linux.do",
            pathname: "/t/topic/2005411/1",
            href: "https://linux.do/t/topic/2005411/1"
        }
    });

    assert.deepEqual(calls, [
        "https://linux.do/t/2005411.json",
        "https://linux.do/posts/99.json"
    ]);
    assert.equal(result.filename, "linuxdo-2005411-导出测试.md");
    assert.match(result.markdown, /原始 \*\*Markdown\*\*/);
    assert.equal(requestOptions[0].credentials, "include");
    assert.equal(requestOptions[0].headers["X-CSRF-Token"], "csrf-123");
    assert.equal(requestOptions[0].headers["X-Requested-With"], "XMLHttpRequest");
});
