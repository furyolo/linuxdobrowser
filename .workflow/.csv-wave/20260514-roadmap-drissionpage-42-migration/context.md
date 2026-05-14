# Roadmap Generation Report

## Summary

- Requirements: 将旧代码升级到 DrissionPage 4.2。
- Strategy: direct
- Analysis agents: 3 completed
- Phases generated: 4
- Milestones: 4

## Research Notes

官方 4.2 文档确认以下迁移相关事实：

- 4.2 目前处于测试阶段，安装示例使用 `pip install DrissionPage --pre --upgrade`。
- `WebPage` 删除/合并方向明确，推荐使用 `Chromium()`，`MixTab` 功能合并到 `ChromiumTab`。
- `Chromium.new_tab()` 增加 `hidden` 参数，`ChromiumOptions.set_browser_path()` 增加 `edge` 参数。
- API 和行为变化包括 `ChromiumTab`/`ChromiumFrame` 删除 `reconnect()`、`click()` 随机位置、`click()` 的 `wait_stop` 默认改为 `False`。

来源：

- https://www.drissionpage.cn/features/4.2
- https://www.drissionpage.cn/dp40docs/versions/4x/
- https://drissionpage.cn/get_start/before_start

## Codebase Findings

### Scope Analysis

影响文件集中在 Python 工具链：

- `pyproject.toml` 与 `uv.lock`：依赖声明和锁定版本不一致，lock 已出现 `drissionpage 4.2.0b3`，但项目声明仍是 `>=4.1.1.1`。
- `main.py`：使用 `Chromium`、`ChromiumOptions`、`set_browser_path()`、`new_tab()`、页面元素查找和滚动。
- `autobrowser.py`：从私有路径导入 `MixTab`，并使用 tab/element 的 `click.middle()`、`wait.eles_loaded()`、`scroll`、`run_js()`。
- `use_system_user.py`：使用 `ChromiumOptions().use_system_user_path().save()`，需要用 4.2 实测确认仍可用。
- `README.md`、`CLAUDE.md`：依赖版本、命令和迁移注意事项需要更新。

### Risk Analysis

- 私有导入风险最高：`DrissionPage._pages.mix_tab.MixTab` 在 4.2 语义下不再适合作为类型依赖。
- 点击行为需要 smoke test：当前打开话题依赖 `link_ele.click.middle()` 返回新标签页，需要确认 4.2 中仍返回可操作 tab。
- 4.2 是测试版，路线图需要把“运行验证”和“可回退记录”作为里程碑，不只做静态替换。
- 真实浏览器会话、登录态和本机路径不适合用重 Mock 覆盖，需要保留手动 smoke 验证步骤。

### Dependency Analysis

推荐顺序：

1. 统一依赖声明和官方差异清单。
2. 消除 private API 和 4.2 行为风险。
3. 增加最小验证脚本或命令清单。
4. 更新 README/CLAUDE 和 workflow specs。

## Output

Roadmap written to `.workflow/roadmap.md`.
