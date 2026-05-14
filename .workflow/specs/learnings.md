---
title: "Learnings"
readMode: optional
priority: medium
category: learning
keywords:
  - bug
  - lesson
  - gotcha
  - learning
---

# Learnings

Add entries with: `/spec-add learning <description>`

## Entries

<spec-entry category="learning" keywords="init, spec-format, workflow" date="2026-05-14" source=".workflow/project.md:1">
后续沉淀到 `.workflow/specs/` 的经验、约定和风险记录统一使用 `<spec-entry>` 闭合标签，并带上 `category`、`keywords`、`date`、`source`，方便追踪来源和按类别读取。
</spec-entry>

<spec-entry category="learning" keywords="drissionpage, 4.2.0b3, phase-3, edge, beta, userscript" date="2026-05-14" source=".workflow/scratch/20260514-plan-P3-verification-regression-hardening/phase3-verification-report.md:1">
DrissionPage 4.2 迁移在本地 `4.2.0b3` 上完成闭环：Edge 真实浏览器 smoke 通过，userscript Node 回归为 `7 pass, 0 fail`。由于官方 4.2 仍按 beta/pre-release 维护，后续升级到新的 4.2 beta 或正式版时，应重新确认 `set_browser_path(edge=True)`、`click.middle()` 新标签页、wait/scroll/close 链路和类型边界。
</spec-entry>
