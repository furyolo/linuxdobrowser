# Phase 4 计划上下文：文档、specs 和收尾

## 概览

- Phase：Phase 4，文档、specs 和收尾。
- 计划目录：`.workflow/scratch/20260514-plan-P4-docs-specs-wrap-up/`。
- 任务数量：3 个任务，3 个顺序 wave。
- 信心分：0.90；主要风险是文档与 workflow 状态同步面较多，需要避免覆盖历史 artifact。

## 探索摘要

### Final Documentation

README 和 CLAUDE 已经包含 DrissionPage 4.2 beta、依赖范围和维护边界，但 Phase 3 已经通过真实 Edge smoke 与 userscript 回归，因此 Phase 4 需要把“待验证/Phase 3 边界”升级为已验证事实。`.workflow/project.md` 仍停留在 initialization 状态，也需要更新最终项目状态和 Last updated。

### Specs And Knowledge

现有 `coding-conventions.md` 与 `quality-rules.md` 已记录私有模块禁用和 Phase 2/3 验证分层。Phase 4 需要补充最终验证结果、4.2.0b3 beta 版本敏感性、`use_system_user.py` 写本机配置的安全边界，以及失败诊断时区分代码回归、浏览器 profile、登录态、网络和站点结构变化。

### Final Audit

Phase 4 不重复真实浏览器 smoke，只运行轻量验证：

```powershell
uv lock --check
uv run mypy .
node --check userscripts/flowreader.user.js
node --test userscripts/tests/flowreader.user.test.js
```

同时做 stale text 审计和 `git status --short` 记录。

## 执行计划

1. `TASK-001`：同步最终用户与维护文档。
2. `TASK-002`：固化 specs 与迁移知识。
3. `TASK-003`：执行最终审计与状态收口。

## 下一步

运行：`$maestro-execute 20260514-plan-P4-docs-specs-wrap-up`

## 参考

- https://www.drissionpage.cn/features/4.2
- `.workflow/.csv-wave/20260514-execute-P3-verification-regression-hardening/context.md`
- `.workflow/scratch/20260514-plan-P3-verification-regression-hardening/phase3-verification-report.md`
