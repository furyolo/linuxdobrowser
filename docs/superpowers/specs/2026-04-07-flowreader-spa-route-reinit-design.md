# FlowReader SPA 路由重初始化设计

## 背景

`userscripts/flowreader.user.js` 目前只在首次加载时执行一次初始化。
在 Discourse 站内切换话题时，页面通常不会整页刷新，而是通过 SPA 路由更新内容。
这会导致旧的悬浮按钮和设置入口不再跟随新话题重新挂载。

## 目标

1. 在站内切换到新的话题页后，自动重新挂载悬浮按钮和设置入口。
2. 当 `autoStart` 为 `true` 时，新话题完成重初始化后自动继续阅读。
3. 避免同一路由或重复 DOM 变化导致重复插入多个按钮。
4. 保持现有阅读请求逻辑不变，仅增强初始化与重挂载能力。

## 非目标

1. 不修改批量阅读请求协议和参数结构。
2. 不引入外部依赖或测试框架。
3. 不处理跨域跳转或非话题页的复杂状态同步。

## 方案

采用“路由变化监听 + 等待页面上下文就绪 + 幂等重初始化”的混合方案。

### 路由监听

监听以下入口：

1. 包装 `history.pushState`
2. 包装 `history.replaceState`
3. 监听 `popstate`

当 URL 变化后，统一触发路由变更处理逻辑。

### 重初始化流程

新增统一的重初始化入口，职责如下：

1. 判断当前 `pathname` 或 `topicID` 是否与上次处理的话题不同。
2. 如果没有变化，直接跳过，避免重复挂载。
3. 如果已切换话题，则等待 `.timeline-replies` 和 `csrf-token` 可用。
4. 清理旧的设置按钮和旧的悬浮按钮。
5. 重新执行 `setupUI()`。
6. 如果 `config.autoStart === true`，则沿用已有逻辑自动开始阅读。

### 幂等约束

为脚本生成的设置按钮和悬浮按钮增加稳定标识，便于：

1. 判断节点是否已存在
2. 话题切换时精准清理旧节点
3. 防止用户在同一路由下反复触发监听时出现重复按钮

## 数据流

1. 路由变化被监听器捕获
2. 读取最新 `location.pathname`
3. 等待 `getPageContext()` 可解析出新话题上下文
4. 同步运行时状态
5. 重新挂载 UI
6. 根据配置决定是否自动开始阅读

## 错误处理

1. 如果路由变化后在超时时间内仍拿不到页面上下文，则只记录错误，不抛出未捕获异常。
2. 如果当前页面不是受支持的话题页，则跳过重初始化。
3. 如果重复触发相同话题的重初始化，则直接返回。

## 测试设计

新增最小回归测试，覆盖以下行为：

1. 新话题路由与旧话题路由不同，应该判定需要重初始化。
2. 同一路由重复触发，不应该重复执行重初始化。
3. `autoStart=true` 时，重挂载完成后应进入自动阅读路径。
4. 清理逻辑应移除旧的脚本按钮，避免残留多个实例。

## 影响范围

主要影响文件：

1. `userscripts/flowreader.user.js`
2. `userscripts/tests/flowreader.user.test.js`

## 验证

实现完成后至少执行：

1. `node --test d:/Coding/linuxdobrowser/userscripts/tests/flowreader.user.test.js`
2. `node --check d:/Coding/linuxdobrowser/userscripts/flowreader.user.js`
