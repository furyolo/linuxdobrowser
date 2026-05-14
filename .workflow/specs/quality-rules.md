---
title: "Quality Rules"
readMode: required
priority: medium
category: review
keywords:
  - quality
  - lint
  - rule
  - enforcement
---

# Quality Rules

## Entries

<spec-entry category="quality" keywords="mypy, node-check, minimal-dependencies" date="2026-05-14" source="mypy.ini:1">
- Python 改动后优先运行 `uv run mypy .` 验证类型约束。
- userscript 改动后优先运行 `node --check userscripts/flowreader.user.js` 验证语法。
- 依赖新增必须有明确必要性；当前项目以 uv、DrissionPage、Node 内置测试和原生浏览器能力为主。
</spec-entry>

<spec-entry category="quality" keywords="drissionpage, phase-2, phase-3, smoke, userscript" date="2026-05-14" source=".workflow/scratch/20260514-plan-P2-python-drissionpage-42-migration/phase2-verification-notes.md:1">
- DrissionPage 迁移的 Phase 2 验证只运行无真实浏览器副作用命令：`uv lock --check`、导入/签名探测和 `uv run mypy .`。
- 真实浏览器 smoke、`uv run main.py --mode short --num 1`、`uv run use_system_user.py` 和 userscript Node 回归留到 Phase 3。
- 文档与执行记录不得提前宣称 Phase 3 的真实浏览器或 userscript 验证结果。
</spec-entry>

<spec-entry category="quality" keywords="drissionpage, 4.2.0b3, phase-4, smoke, userscript" date="2026-05-14" source=".workflow/scratch/20260514-plan-P3-verification-regression-hardening/phase3-verification-report.md:1">
- DrissionPage 4.2 迁移收尾后的轻量审计命令为 `uv lock --check`、`uv run mypy .`、`node --check userscripts/flowreader.user.js` 和 `node --test userscripts/tests/flowreader.user.test.js`。
- 当前已验证版本为 `4.2.0b3`；真实浏览器 smoke 已在 Phase 3 通过，后续只有修改浏览器启动、标签页打开、登录态依赖或 DrissionPage 版本范围时才需要重复真实浏览器 smoke。
- `uv run use_system_user.py` 会写入本机 DrissionPage 配置，不作为默认验证命令自动运行。
</spec-entry>
