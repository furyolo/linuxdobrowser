# TASK-001 执行 Python 基线与真实浏览器 smoke

## 状态

completed

## 验证

- `uv lock --check` 通过。
- DrissionPage import/signature probe 通过，版本为 `4.2.0b3`。
- `uv run mypy .` 通过。
- `"edge" | uv run main.py --mode short --num 1 --browser single` 通过，exit code `0`。

## 观察

- Edge 通过 `set_browser_path(edge=True)` 启动。
- linux.do 主题列表可访问。
- `click.middle()` 成功打开主题新标签页。
- `wait.eles_loaded()`、滚动/read 路径、tab close 和 `browser.quit` 未暴露异常。
- 未执行 `uv run use_system_user.py`。
