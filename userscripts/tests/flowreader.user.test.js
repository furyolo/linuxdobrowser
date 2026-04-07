const test = require("node:test");
const assert = require("node:assert/strict");

const {
    cleanupScriptUI,
    getRouteSignature,
    handleRouteChange,
    parseRepliesInfo,
    getPageContext,
    resolveSettingsMountPoint
} = require("../flowreader.user.js");

function createFakeDocument(selectorMap, selectorAllMap = {}) {
    return {
        querySelector(selector) {
            return selectorMap[selector] ?? null;
        },
        querySelectorAll(selector) {
            return selectorAllMap[selector] ?? [];
        }
    };
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
