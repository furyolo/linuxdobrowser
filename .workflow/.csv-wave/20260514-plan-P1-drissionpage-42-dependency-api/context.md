# Plan Generation Report

## Summary

- Phase: Roadmap Phase 1，依赖与 API 差异确认
- Session: `20260514-plan-P1-drissionpage-42-dependency-api`
- Strategy: direct
- Exploration agents: 4 completed
- Generated tasks: 2
- Plan output: `.workflow/scratch/20260514-plan-P1-drissionpage-42-dependency-api/plan.json`

## Exploration Findings

### Architecture

Phase 1 只钉实迁移约束，不进入业务代码迁移。触点是 `pyproject.toml`、`uv.lock`、`main.py`、`autobrowser.py`、`use_system_user.py`、`README.md`、`CLAUDE.md`。`userscripts/` 不依赖 DrissionPage，不纳入本阶段。

### Implementation

当前最高风险点是 `autobrowser.py` 中的私有导入 `DrissionPage._pages.mix_tab.MixTab`。Phase 1 需要探测公开 Tab 类型、`ChromiumOptions.set_browser_path(edge=True)`、`Chromium.new_tab(hidden=...)`、`click.middle()` 返回值、`wait/scroll/run_js/close` 和 `use_system_user_path()`。

### Dependency

`pyproject.toml` 仍声明 `drissionpage>=4.1.1.1`，而 `uv.lock` 已锁 `drissionpage 4.2.0b3`。执行计划推荐把直接依赖改为 `drissionpage>=4.2.0b3,<4.3`，然后重新计算 lock 并验证 root metadata。

### Risk

DrissionPage 4.2 仍是 beta，需要记录实际版本和回退策略。真实浏览器 smoke 涉及本机路径和登录态，Phase 1 只做无破坏导入/配置/签名探测；真实 linux.do 链路留到 Phase 2/3。

## Plan

- `TASK-001`: 固化 DrissionPage 4.2 beta 依赖约束。
- `TASK-002`: 执行 4.2 API 探测并产出迁移清单。

## Quality Check

- Task count within guardrail: 2 tasks for a medium dependency/API preparation phase.
- Dependencies clear: `TASK-002` depends on `TASK-001`.
- Each task has `read_first` and grep/command-verifiable convergence criteria.
- Scope excludes business code migration and real browser login-state smoke.

## References

- https://www.drissionpage.cn/features/4.2
- https://www.drissionpage.cn/dp40docs/versions/4x/
- https://drissionpage.cn/get_start/before_start
