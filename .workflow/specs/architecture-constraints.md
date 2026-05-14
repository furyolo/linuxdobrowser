---
title: "Architecture Constraints"
readMode: required
priority: high
category: arch
keywords:
  - architecture
  - module
  - layer
  - boundary
  - dependency
  - structure
---

# Architecture Constraints

## Module Structure

## Layer Boundaries

## Dependency Rules

## Technology Constraints

## Entries

<spec-entry category="arch" keywords="entrypoint, browser-orchestration, topic-processing" date="2026-05-14" source="main.py:8">
- `main.py` 负责 CLI 参数解析、浏览器选择、页面主题加载和任务编排。
- `autobrowser.py` 负责单个主题处理、滚动模拟、底部检测和日志记录。
- 修改时应保持入口编排与主题处理的职责边界，避免把浏览器路径配置、CLI 交互和页面阅读细节混在同一层。
</spec-entry>

<spec-entry category="arch" keywords="userscript, discourse, spa-route, idempotency" date="2026-05-14" source="docs/superpowers/specs/2026-04-07-flowreader-spa-route-reinit-design.md:1">
- FlowReader userscript 以 Discourse 话题页为运行边界，依赖 `.timeline-replies` 和 `csrf-token` 解析阅读上下文。
- SPA 路由切换处理必须保持幂等：同一路由不重复挂载 UI，新话题切换时清理旧按钮后重新初始化。
- 阅读请求协议和参数结构属于既有行为，未明确要求时不改动。
</spec-entry>
