# Phase 3 Userscript Regression Notes

## Result

passed

## Commands

```powershell
node --check userscripts/flowreader.user.js
```

Result: passed, exit code `0`.

```powershell
node --test userscripts/tests/flowreader.user.test.js
```

Result: passed, exit code `0`.

Output summary:

```text
✔ 新版页面缺少 header-buttons 时，仍能回退到 timeline-controls
✔ 可以解析时间轴中的当前楼层与总楼层
✔ 可以从页面中提取阅读所需上下文
✔ 不同话题路由应生成新的签名
✔ 切到新话题时应执行重初始化并在自动运行开启时继续阅读
✔ 同一话题重复触发时不应重复重初始化
✔ 清理逻辑应移除旧的脚本按钮
ℹ tests 7
ℹ pass 7
ℹ fail 0
```

## Scope Note

userscript 不依赖 DrissionPage。本任务只确认 DrissionPage 4.2 迁移没有误伤既有 userscript 语法和 Node 内置测试。
