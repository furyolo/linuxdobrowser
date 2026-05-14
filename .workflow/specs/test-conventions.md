---
title: "Test Conventions"
readMode: required
priority: high
category: test
keywords:
  - test
  - coverage
  - mock
  - fixture
  - assertion
  - framework
---

# Test Conventions

## Framework

## Directory Structure

## Naming Conventions

## Patterns

## Entries

<spec-entry category="test" keywords="node-test, userscript, regression" date="2026-05-14" source="userscripts/tests/flowreader.user.test.js:1">
- userscript 测试使用 Node 内置 `node:test` 和 `node:assert/strict`。
- 测试文件放在 `userscripts/tests/`，命名沿用 `*.user.test.js`。
- 优先测试可导出的纯逻辑和边界行为，例如路由签名、页面上下文解析、UI 清理和幂等重初始化。
</spec-entry>
