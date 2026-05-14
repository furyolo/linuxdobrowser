# TASK-003 同步 4.2 迁移文档与 specs

## 状态

completed

## 修改

- `README.md` 更新依赖为 `DrissionPage >=4.2.0b3,<4.3`，补充 beta/pre-release、真实浏览器登录态和 `use_system_user.py` 写配置说明。
- `CLAUDE.md` 增加 DrissionPage 4.2 beta 维护规则、禁止私有模块导入、Phase 2/Phase 3 验证边界和 userscript 回归边界。
- `.workflow/specs/coding-conventions.md` 增加 `<spec-entry>`，固化 DrissionPage 私有模块、`Protocol`/`Any` 和浏览策略不变规则。
- `.workflow/specs/quality-rules.md` 增加 `<spec-entry>`，固化 Phase 2 无副作用验证和 Phase 3 真实浏览器/userscript 验证分层。

## 验证

- README、CLAUDE 和 specs 的收敛检查通过。
- 文档未宣称 Phase 3 真实浏览器 smoke 或 userscript Node 回归已通过。
