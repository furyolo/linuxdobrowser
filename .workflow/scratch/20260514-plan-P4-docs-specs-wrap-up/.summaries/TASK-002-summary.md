# TASK-002 固化 specs 与迁移知识

## 状态

completed

## 修改

- `.workflow/specs/quality-rules.md` 增加 Phase 4 后轻量审计规则和真实浏览器 smoke 触发边界。
- `.workflow/specs/learnings.md` 记录 DrissionPage `4.2.0b3`、Phase 3 Edge smoke、userscript `7 pass, 0 fail` 和 beta 风险。
- `.workflow/specs/debug-notes.md` 记录真实浏览器失败的诊断分层，以及 `use_system_user.py` 写配置边界。

## 验证

新增内容均使用闭合 `<spec-entry ...>...</spec-entry>` 格式。
