# TASK-002 执行 4.2 API 探测并产出迁移清单

## 修改

- 新增 `drissionpage-42-api-checklist.md`：记录 `DrissionPage 4.2.0b3` 的无破坏探测结果、Tab 类型决策、`MixTab` 私有导入风险、`click.middle()` 静态返回逻辑、`use_system_user_path()` 签名和回退策略。
- 新增 `drissionpage-42-migration-checklist.md`：按 `autobrowser.py`、`main.py`、`use_system_user.py`、`README.md`、`CLAUDE.md` 拆分后续迁移项。

## 探测结果

- `ChromiumOptions.set_browser_path` 签名为 `(self, path=None, edge=False)`。
- `Chromium.new_tab` 签名为 `(self, url=None, new_window=False, background=False, new_context=False, hidden=False)`。
- `DrissionPage` 顶层未公开 `ChromiumTab` 或 `MixTab`。
- `DrissionPage._pages.mix_tab.MixTab` 在 `4.2.0b3` 中导入失败，`autobrowser.py` 需要在 Phase 2 移除该私有导入。
- `Clicker.middle(get_tab=True)` 静态源码显示会等待新 tab 并返回 tab 对象，真实浏览器行为留到 Phase 2/3 验证。
- `ChromiumOptions.use_system_user_path(on_off=True)` 与 `.save(path=None)` 签名存在；本任务未执行写入配置。

## 验证

- `uv run python -c "import inspect, importlib.metadata as md; from DrissionPage import Chromium, ChromiumOptions; ..."` 通过，输出版本 `4.2.0b3`。
- import/inspect 探测公开 Tab、私有 `MixTab`、`Clicker.middle`、`run_js`、`close`、`use_system_user_path` 通过。
- 未启动浏览器，未访问 `linux.do`，未修改业务代码、依赖文件、README、CLAUDE 或 userscripts。
