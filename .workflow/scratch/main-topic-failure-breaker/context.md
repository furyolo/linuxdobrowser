# 快速分析

任务：为 LinuxDo 首页“浏览主帖”增加连续失败熔断。

链路：
- 入口：`startReadingMainTopics(options = {})`
- 核心：遍历 `unreadTopics`，逐个调用 `sendMainTopicTiming(topic.id, 3, ...)`
- 外部依赖：`/topics/timings` 请求；单个主帖内部已有 3 次重试
- 进度：成功后立即通过 `saveReadMainTopicIds` 保存；失败不保存
- 测试：现有 tests 覆盖主帖收集、进度、按钮文案、请求参数

实现选择：增加主帖循环层面的连续失败计数。单个主帖耗尽自身重试并返回 `false` 后，计入 1 次连续失败；连续 3 个主帖最终失败则停止本轮浏览。成功会重置连续失败计数。
