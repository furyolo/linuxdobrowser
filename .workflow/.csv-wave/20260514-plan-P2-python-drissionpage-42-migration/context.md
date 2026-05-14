# Phase 2 计划上下文：Python DrissionPage 4.2 调用迁移

## 概览

- Phase：Phase 2，Python DrissionPage 调用迁移。
- 计划目录：`.workflow/scratch/20260514-plan-P2-python-drissionpage-42-migration/`。
- 任务数量：3 个任务，3 个顺序 wave。
- 信心分：0.86；主要不确定性来自 DrissionPage 4.2 beta 与真实浏览器事件行为。

## 探索摘要

### Code Migration

`autobrowser.py` 是最高优先级迁移点：移除 `DrissionPage._pages.mix_tab.MixTab` 私有导入，改用本地 `Protocol` 或局部 `Any` 描述 tab-like 能力。`click.middle()`、`wait.eles_loaded()`、`run_js()`、`scroll.up/down()`、`close()` 保持调用形态，真实 tab 行为留到 Phase 3 smoke。

`main.py` 仅 Edge 分支计划使用 `set_browser_path(edge=True)`；115 和豆包浏览器继续保留显式路径。`browser.new_tab('https://linux.do/')` 不新增 `hidden=True`。

### Verification

Phase 2 只做无真实浏览器副作用验证：`uv lock --check`、DrissionPage import/signature probe、`uv run mypy .`、静态检查业务代码不再引用 `DrissionPage._pages` 或 `MixTab`。

`uv run main.py --mode short --num 1`、`uv run use_system_user.py` 和 userscript Node 回归都不在 Phase 2 执行。真实浏览器 smoke 与 userscript 未误伤检查留到 Phase 3。

### Documentation And Specs

README、CLAUDE 和 specs 需要同步 4.2 beta、`DrissionPage >=4.2.0b3,<4.3`、禁止业务代码导入 `DrissionPage._pages.*`、Phase 2/Phase 3 验证分层，以及 userscript 不属于本阶段迁移面。

### Risk

4.2 当前仍是 beta，API 可能继续变化；`click.middle()` 静态源码显示仍返回新 tab，但真实行为依赖浏览器事件；`use_system_user_path().save()` 会写本机配置；Edge `edge=True` 可能改变本机浏览器解析行为。计划已将这些风险放入执行边界和 Phase 3 验证。

## 执行计划

1. `TASK-001`：迁移 Python DrissionPage 4.2 调用。
2. `TASK-002`：执行 Phase 2 无真实浏览器验证并记录 `phase2-verification-notes.md`。
3. `TASK-003`：同步 README、CLAUDE 和 workflow specs。

## 下一步

运行：`$maestro-execute 20260514-plan-P2-python-drissionpage-42-migration`

## 参考

- https://www.drissionpage.cn/features/4.2
- https://www.drissionpage.cn/dp40docs/versions/4x/
- `.workflow/scratch/20260514-plan-P1-drissionpage-42-dependency-api/drissionpage-42-api-checklist.md`
- `.workflow/scratch/20260514-plan-P1-drissionpage-42-dependency-api/drissionpage-42-migration-checklist.md`
