# TASK-001 迁移 Python DrissionPage 4.2 调用

## 状态

completed

## 修改

- `autobrowser.py` 移除了 `DrissionPage._pages.mix_tab.MixTab` 私有导入。
- 新增本地 `ScrollLike` 与 `BrowserTabLike` `Protocol`，只描述当前代码实际使用的滚动、`run_js()` 和 `close()` 能力。
- `process_topic()` 的 topic 参数保留为 `Any`，避免把动态 DOM element 链误建模为 tab。
- `main.py` 中 Edge 分支改为 `ChromiumOptions().set_browser_path(edge=True)`；115 和豆包浏览器继续使用显式 `set_browser_path(path)`。
- 保留 `browser.new_tab('https://linux.do/')`、`click.middle()`、滚动、随机延迟、`Semaphore(3)` 和主题加载轮询行为。

## 验证

- 静态检查确认 `autobrowser.py` 不再包含 `DrissionPage._pages`、`from DrissionPage._` 或 `MixTab`。
- 收敛检查确认 `Protocol`、Edge `edge=True`、非 Edge 显式路径和 `browser.new_tab('https://linux.do/')` 均存在。
