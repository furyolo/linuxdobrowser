# Phase 3 计划上下文：验证与回归加固

## 概览

- Phase：Phase 3，验证与回归加固。
- 计划目录：`.workflow/scratch/20260514-plan-P3-verification-regression-hardening/`。
- 任务数量：3 个任务，3 个 wave。
- 信心分：0.82；主要不确定性来自真实浏览器、linux.do 登录态和当前页面结构。

## 探索摘要

### Python Smoke

Phase 2 已完成无副作用验证，但真实浏览器链路尚未执行。Phase 3 需要复跑 `uv lock --check`、DrissionPage import/signature probe 和 `uv run mypy .`，再执行真实浏览器 smoke。

当前 `main.py` 的 `--browser single` 会交互选择浏览器，可用以下命令选择 Edge：

```powershell
echo edge | uv run main.py --mode short --num 1 --browser single
```

该命令会启动真实浏览器、访问 linux.do，并依赖本机 Edge、登录态和站点结构。

### Userscript Regression

userscript 不依赖 DrissionPage，但 Phase 3 需要运行现有 Node 检查确认未误伤：

```powershell
node --check userscripts/flowreader.user.js
node --test userscripts/tests/flowreader.user.test.js
```

### Risk Boundary

- `uv run use_system_user.py` 会写本机 DrissionPage 配置，不在计划中自动执行。
- DrissionPage 4.2 当前仍是 beta，真实 smoke 需要记录版本和失败栈。
- 报告必须区分通过、环境阻塞、站点结构变化和代码回归。

## 执行计划

1. `TASK-001`：执行 Python 基线与真实浏览器 smoke。
2. `TASK-002`：执行 userscript Node 回归。
3. `TASK-003`：汇总 Phase 3 验证报告，仅在全部通过时更新 roadmap Phase 3 状态。

## 下一步

运行：`$maestro-execute 20260514-plan-P3-verification-regression-hardening`

## 参考

- https://www.drissionpage.cn/features/4.2
- `.workflow/.csv-wave/20260514-execute-P2-python-drissionpage-42-migration/context.md`
- `.workflow/scratch/20260514-plan-P2-python-drissionpage-42-migration/phase2-verification-notes.md`
