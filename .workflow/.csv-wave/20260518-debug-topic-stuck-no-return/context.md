# Debug 记录：进入主题后偶尔不返回主页

## 症状

首页一键浏览主帖时，偶尔进入某个主题后长时间停留在主题页，不返回首页继续队列。

## 已确认根因

1. `handleRouteChange()` 在话题路由先等待 `waitForPageContext()`。如果页面没有及时出现 `.timeline-replies` / CSRF，且页面也没有出现“无法加载该话题”文案，旧逻辑会抛错，`continueMainTopicBrowsingSession()` 不会执行，主帖会话无法返回来源页。
2. `sendMainTopicTiming()` 直接等待 `/topics/timings` 的 `fetch`。旧逻辑没有 `AbortController` 或其它超时边界，网络请求如果一直 pending，后续保存会话与 `returnToMainTopicSource()` 都不会执行。

## 修复

- 增加 `MAIN_TOPIC_TIMING_TIMEOUT_MS = 12000`，主帖 timing 请求超过 12 秒会 abort，并按失败处理。
- 增加 `isCurrentMainTopicBrowsingSessionRoute()`，只在当前一键浏览主帖会话匹配当前话题 ID 时启用“话题上下文加载超时”兜底。
- `handleRouteChange()` 识别 `topicContextUnavailable` 后跳过话题 UI 初始化和自动跟帖阅读，直接推进主帖会话兜底。
- `continueMainTopicBrowsingSession()` 遇到 `topicUnavailable` 或 `topicContextUnavailable` 时，不发送 timing，不保存已读，计为失败，立刻返回来源页。

## 验证

- `node --check userscripts/flowreader.user.js`
- `node --test userscripts/tests/flowreader.user.test.js`：35 pass，0 fail
- `git diff --check`：无空白错误，仅保留 CRLF 提示

## 置信度

高。两个已确认根因都有文件链路证据，新增测试覆盖 timing 请求超时、话题上下文加载超时、不可用话题、正常话题返回路径。
