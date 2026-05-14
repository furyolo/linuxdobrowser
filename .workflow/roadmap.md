# Roadmap: DrissionPage 4.2 Migration

## Requirement

将项目从 DrissionPage 4.1 系列用法升级到 DrissionPage 4.2，并保留现有 linux.do 自动浏览能力。

## Source Facts

- DrissionPage 4.2 官方文档标注为测试版，安装示例需要 `--pre`。
- 4.2 推荐使用 `Chromium()`，`MixTab` 功能合并到 `ChromiumTab`。
- `ChromiumOptions.set_browser_path()` 新增 `edge=True`，`Chromium.new_tab()` 新增 `hidden=True`。
- `click()` 行为变化：点击随机位置，`wait_stop` 默认改为 `False`。
- Phase 1 完成后，`pyproject.toml` 已声明 `drissionpage>=4.2.0b3,<4.3`，本地 `uv.lock` 已解析到 `drissionpage 4.2.0b3`。
- Phase 3 完成后，Edge 真实浏览器 smoke 通过，userscript Node 回归通过，结果为 `7 pass, 0 fail`。

## Scope

### In Scope

- 升级 Python 自动化代码中的 DrissionPage 4.2 不兼容或高风险用法。
- 消除对 DrissionPage 私有模块路径的类型依赖。
- 对 Edge 启动配置、标签页打开、页面等待和滚动逻辑做 4.2 兼容验证。
- 更新依赖声明、README、CLAUDE 和 workflow specs 中的版本/迁移说明。

### Out of Scope

- 不重写 userscript；它不依赖 DrissionPage。
- 不新增论坛域名支持。
- 不引入新的自动化框架或测试框架。
- 不改变现有浏览策略、随机延迟和并发数量，除非 4.2 兼容性验证证明必须调整。

## Progress

| Phase | Status | Goal |
|-------|--------|------|
| 1 | Completed | 依赖与 API 差异确认 |
| 2 | Completed | Python DrissionPage 调用迁移 |
| 3 | Completed | 验证与回归加固 |
| 4 | Completed | 文档、specs 和收尾 |

## Phase 1: 依赖与 API 差异确认

**Depends on**: none

**Goal**: 把“升级到 4.2”变成明确、可验证的工程约束。

**Tasks**

- 确认 `pyproject.toml` 中 DrissionPage 依赖声明是否应改为 `>=4.2.0b3` 或其它明确的 4.2 范围。
- 使用 `uv sync --pre` 或等价方式重新解析依赖，确保 `uv.lock` 与项目声明一致。
- 在本地环境执行最小导入探测，确认 4.2 中可公开使用的 Tab 类型、`ChromiumOptions` 方法和版本号。
- 记录 4.2 迁移差异清单，重点覆盖 `MixTab`、`click()`、`new_tab()`、`set_browser_path(edge=True)`。

**Success Criteria**

- `pyproject.toml` 与 `uv.lock` 对 DrissionPage 4.2 的约束一致。
- 能在项目虚拟环境中成功导入 `Chromium`、`ChromiumOptions` 并输出 DrissionPage 版本。
- 形成一份明确的代码修改清单，不再依赖猜测 API。

## Phase 2: Python DrissionPage 调用迁移

**Depends on**: Phase 1

**Goal**: 让现有 Python 自动浏览逻辑使用 4.2 兼容写法。

**Tasks**

- 在 `autobrowser.py` 移除 `DrissionPage._pages.mix_tab.MixTab` 私有导入，改用 4.2 可验证的公开类型、`Protocol` 或局部 `Any` 标注。
- 检查 `link_ele.click.middle()` 在 4.2 中是否仍返回新标签页；如行为变化，改用官方推荐的中键点击/等待新 tab 组合。
- 检查 `new_tab.wait.eles_loaded()`、`scroll.to_bottom()`、`scroll.up/down()`、`run_js()` 在 4.2 下的调用是否需要调整。
- 在 `main.py` 中评估 Edge 配置是否改为 `ChromiumOptions().set_browser_path(edge=True)`；其它浏览器继续保留显式路径。
- 检查 `use_system_user.py` 的 `use_system_user_path().save()` 是否在 4.2 下仍可用，必要时更新为新配置写法。

**Success Criteria**

- Python 代码不再导入 DrissionPage 私有模块。
- `uv run mypy .` 通过，或仅保留当前 DrissionPage 类型缺失的已知忽略规则。
- 真实浏览器 smoke 已明确登记到 Phase 3，Phase 2 不宣称登录态浏览链路已通过。

## Phase 3: 验证与回归加固

**Depends on**: Phase 2

**Goal**: 用最小但真实的验证覆盖 4.2 行为变化。

**Tasks**

- 增加或整理一条无破坏的 smoke 验证命令，覆盖 `ChromiumOptions` 创建、浏览器启动、`new_tab()`、页面访问和关闭。
- 执行 `uv run mypy .`，确认 Python 静态检查没有新增错误。
- 执行 `uv run main.py --mode short --num 1` 做真实浏览器 smoke test，并记录是否需要登录态或本机浏览器路径。
- 保留 userscript 现有验证：`node --check userscripts/flowreader.user.js` 与 `node --test userscripts/tests/flowreader.user.test.js`，确认迁移没有误伤无关脚本。

**Success Criteria**

- Python smoke test 能在 DrissionPage 4.2 环境下完成最小浏览链路。
- Node userscript 检查继续通过。
- 若 4.2 beta 存在阻塞缺陷，记录具体版本、复现步骤和回退策略。

## Phase 4: 文档、specs 和收尾

**Depends on**: Phase 3

**Goal**: 让后续维护者能知道项目已迁移到 4.2，以及哪些行为被验证过。

**Tasks**

- 更新 `README.md` 的依赖版本与安装说明，标明 4.2 测试版需要允许 pre-release。
- 更新 `CLAUDE.md` 中 DrissionPage 相关架构说明、常用命令和迁移风险。
- 在 `.workflow/specs/quality-rules.md` 或 `coding-conventions.md` 中追加 4.2 迁移约定：禁止依赖 DrissionPage 私有模块路径。
- 更新 `.workflow/state.json` 的 `last_updated` 和关键决策，标记 roadmap 已生成。

**Success Criteria**

- README 和 CLAUDE 中不再出现过时的 DrissionPage 4.1 依赖表述。
- workflow specs 记录了 DrissionPage 4.2 的维护约束。
- `git status` 中迁移相关文件清晰，未混入无关改动。

## Milestones

### M1: 依赖锁定完成

- DrissionPage 4.2 依赖声明和锁文件一致。
- 官方迁移差异被记录到会话上下文。

### M2: 代码兼容完成

- `main.py`、`autobrowser.py`、`use_system_user.py` 完成 4.2 适配。
- 不再使用 DrissionPage 私有类型路径。

### M3: 验证通过

- Python 静态检查通过。
- 最小真实浏览器 smoke test 通过。
- userscript 原有检查通过。

### M4: 文档收口

- README、CLAUDE、workflow specs 更新完成。
- 已知 beta 风险和回退策略记录完毕。

## Verification Commands

```powershell
uv sync --pre
uv run python -c "from DrissionPage import Chromium, ChromiumOptions; print('drissionpage-import-ok')"
uv run mypy .
uv run main.py --mode short --num 1
node --check userscripts/flowreader.user.js
node --test userscripts/tests/flowreader.user.test.js
```

Phase 4 收尾轻量审计已通过：`uv lock --check`、`uv run mypy .`、`node --check userscripts/flowreader.user.js`、`node --test userscripts/tests/flowreader.user.test.js`。真实浏览器 smoke 不在 Phase 4 重复执行，引用 Phase 3 已通过报告。

## References

- https://www.drissionpage.cn/features/4.2
- https://www.drissionpage.cn/dp40docs/versions/4x/
- https://drissionpage.cn/get_start/before_start
