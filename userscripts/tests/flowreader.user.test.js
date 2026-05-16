const test = require("node:test");
const assert = require("node:assert/strict");

const {
    buildMarkdownDocument,
    canExportMarkdown,
    collectMainPostMarkdown,
    cleanupScriptUI,
    getRouteSignature,
    handleRouteChange,
    pickMainPost,
    parseRepliesInfo,
    getPageContext,
    resolveSettingsMountPoint,
    sanitizeFileName
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
