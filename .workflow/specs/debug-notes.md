---
title: "Debug Notes"
readMode: optional
priority: medium
category: debug
keywords:
  - debug
  - issue
  - workaround
  - root-cause
  - gotcha
---

# Debug Notes

## Entries

<spec-entry category="debug" keywords="drissionpage, use_system_user, profile, 登录态, 站点结构" date="2026-05-14" source=".workflow/scratch/20260514-plan-P3-verification-regression-hardening/phase3-verification-report.md:1">
DrissionPage 4.2 迁移后的真实浏览器问题需要先分层诊断：代码回归、浏览器 profile、linux.do 登录态、网络状态、站点结构变化和 DrissionPage beta 行为变化要分别排查。`uv run use_system_user.py` 会写入本机 DrissionPage 配置，排查 profile 问题时不能把它当作无副作用 smoke 自动运行。
</spec-entry>

<spec-entry category="debug" keywords="userscript,route-signature,state-machine,main-topic-session,stuck-topic" date="2026-05-20" source="userscripts/flowreader.user.js:892">
FlowReader 主帖自动浏览如果偶发停在某个 Topic 页，应检查路由去重逻辑是否早于会话状态机执行。已确认案例：用户先手动浏览 `topic:A`，再从首页启动主帖自动浏览；当队列再次进入 `topic:A` 时，`lastRouteSignature === topic:A` 会导致 `handleRouteChange()` 直接短路，跳过 `continueMainTopicBrowsingSession()`，表现为不发 timing、不保存进度、不返回首页。修复原则：普通重复路由仍可跳过，但若当前 Topic 命中正在进行的主帖浏览会话当前项，必须允许状态机继续执行。对应回归测试见 `userscripts/tests/flowreader.user.test.js:145`。
</spec-entry>
