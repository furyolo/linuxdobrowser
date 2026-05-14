---
title: "Coding Conventions"
readMode: required
priority: high
category: coding
keywords:
  - style
  - naming
  - import
  - pattern
  - convention
  - formatting
---

# Coding Conventions

## Formatting

## Naming

## Imports

## Patterns

## Entries

<spec-entry category="coding" keywords="python, typing, asyncio, drissionpage" date="2026-05-14" source="main.py:1">
- Python 代码使用显式类型标注，现有入口和核心函数都标注参数与返回值。
- 异步流程以 `asyncio` 为主，浏览主题处理通过 `asyncio.gather` 与 `asyncio.Semaphore` 控制并发。
- DrissionPage 对象按现有 API 直接操作页面和标签页，避免额外包装层。
</spec-entry>

<spec-entry category="coding" keywords="javascript, userscript, dom, comments" date="2026-05-14" source="userscripts/flowreader.user.js:1">
- userscript 保持单文件、原生 DOM 和 GM API 风格，脚本元信息放在 UserScript header。
- 页面状态解析、UI 挂载、设置保存、请求发送拆成独立函数，方便 Node 内置测试导出关键纯逻辑。
- 复杂或关键逻辑使用中文注释，变量名和函数名保持英文。
</spec-entry>

<spec-entry category="coding" keywords="drissionpage, private-module, protocol, typing" date="2026-05-14" source="autobrowser.py:7">
- Python 业务代码禁止导入 `DrissionPage._pages.*` 等 DrissionPage 私有模块路径。
- DrissionPage 4.2 没有稳定公开的项目所需 Tab 类型时，优先使用公开 API、本地 `Protocol` 或局部 `Any` 描述实际能力。
- 类型迁移不得改变既有浏览策略、随机延迟、滚动行为、主题加载轮询或并发数量。
</spec-entry>
