# Project: linuxdobrowser

## What This Is

LinuxDoBrowser 是面向 linux.do 论坛的浏览自动化与辅助阅读项目。主程序使用 Python、asyncio 和 DrissionPage 打开浏览器、加载主题并模拟人工阅读；`userscripts/` 下的脚本为 Discourse 话题页提供页面内阅读计时、设置和自动运行能力。

## Core Value

在保留真实浏览器会话和站点交互约束的前提下，稳定、可控地完成论坛主题浏览与阅读辅助。

## Requirements

### Validated

- [x] 支持通过 `uv run main.py` 启动 linux.do 浏览自动化。
- [x] 支持 `short`、`long` 浏览模式和自定义 short 模式主题数量。
- [x] 支持 Edge 独立调试端口启动，以及 Chrome、115 浏览器、豆包浏览器等本地浏览器路径选择。
- [x] userscript 支持 linux.do 与 idcflare.com 话题页的页面内阅读辅助。
- [x] FlowReader 具备针对 SPA 路由重初始化的回归测试。
- [x] DrissionPage 4.2 迁移已在 `4.2.0b3` 本地版本上完成 Phase 3 验证，Edge 真实浏览器 smoke 通过。
- [x] userscript DrissionPage 迁移未误伤回归通过，Node 测试结果为 `7 pass, 0 fail`。

### Active

- [ ] 维护 Python 自动化入口、浏览器编排和主题处理逻辑的稳定性。
- [ ] 维护 userscript 在 Discourse 话题页上的幂等 UI 挂载、设置保存和阅读请求逻辑。
- [ ] 保持最小依赖策略，优先使用现有 DrissionPage、Node 内置测试和标准库能力。

### Out of Scope

- 扩展到未明确支持的新论坛域名 -- 当前 Python 主程序只面向 `https://linux.do/`，userscript 仅记录已匹配的站点。
- 引入新的 UI 框架或测试框架 -- 现有脚本规模适合原生 DOM、Node 内置测试和最小工具链。
- 改造为后台服务或数据库驱动系统 -- 当前项目没有持久化服务端状态和数据库需求。

## Context

仓库在初始化前已有 Python CLI、DrissionPage 自动化逻辑、Tampermonkey/Greasemonkey userscript、Node 内置测试和一份 FlowReader SPA 路由重初始化设计文档。`CLAUDE.md` 记录了主要文件、命令、架构模式和 userscript 作用域，是当前初始化的重要参考。

## Constraints

- **依赖**: 不擅自引入新依赖 -- 项目依赖面很小，新增依赖会抬高本地使用和脚本分发成本。
- **运行环境**: Python 要求 `>=3.13`，依赖通过 `uv` 管理 -- 由 `pyproject.toml` 和 `uv.lock` 固化。
- **浏览器环境**: Python 主程序使用本机浏览器路径和真实浏览器会话 -- 需要避免破坏现有用户配置与登录态。
- **站点交互**: 自动化逻辑需要保留随机延迟、滚动和并发限制 -- 这是模拟人工浏览和降低风险的核心行为。

## Tech Stack

- **Language**: Python 3.13+；JavaScript userscript
- **Framework**: DrissionPage；Node.js 内置 `node:test`
- **Database**: 无
- **Package Manager**: uv

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 使用 DrissionPage 驱动浏览器自动化 | 已有实现依赖统一浏览器操作 API，适合当前自动浏览场景 | Accepted |
| 使用 `uv` 管理 Python 依赖 | `pyproject.toml`、`uv.lock` 和 README 已围绕 uv 建立 | Accepted |
| userscript 保持原生 DOM 与 GM API 实现 | 避免给可复制安装的 userscript 引入构建链和运行时依赖 | Accepted |
| FlowReader 测试使用 Node 内置测试 | 已有测试文件可直接用 `node --test` 运行，成本低 | Accepted |
| DrissionPage 4.2 迁移锁定在 `>=4.2.0b3,<4.3` | 官方 4.2 仍是 beta/pre-release，本地已验证版本为 `4.2.0b3` | Accepted |
| `uv run use_system_user.py` 不纳入自动验证 | 该脚本会写入本机 DrissionPage 配置，需要用户明确意图 | Accepted |

## Stakeholders

- 项目维护者
- 需要在 linux.do 论坛进行自动化浏览或辅助阅读的本地用户

---
*Last updated: 2026-05-14 after DrissionPage 4.2 Phase 4 wrap-up*
