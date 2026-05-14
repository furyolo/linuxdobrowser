# DrissionPage 4.2 API 探测清单

## 探测边界

- 本清单只记录无破坏 import、签名和源码级 inspect 结果。
- 未启动真实浏览器，未打开 `linux.do`，未执行登录态 smoke。
- 未调用 `ChromiumOptions().use_system_user_path().save()`，避免写入本机浏览器配置。
- userscript 不依赖 DrissionPage，本任务未修改 userscripts。

## 本地环境事实

- DrissionPage version: `4.2.0b3`
- 依赖约束来自 TASK-001：`drissionpage>=4.2.0b3,<4.3`
- `ChromiumOptions.set_browser_path` 签名：`(self, path=None, edge=False)`
- `Chromium.new_tab` 签名：`(self, url=None, new_window=False, background=False, new_context=False, hidden=False)`
- `ChromiumOptions.use_system_user_path` 签名：`(self, on_off=True)`
- `ChromiumOptions.save` 签名：`(self, path=None)`

## Tab 类型决策

- Tab type decision: 后续业务代码不应继续导入 DrissionPage 私有 Tab 类型。
- `from DrissionPage import ChromiumTab` 探测结果：顶层未公开导出。
- `from DrissionPage import MixTab` 探测结果：顶层未公开导出。
- `DrissionPage._pages.chromium_tab.ChromiumTab` 当前存在，但仍是私有模块路径，不建议作为业务类型依赖。
- 后续迁移建议：`autobrowser.py` 中 tab-like 参数使用本地 `Protocol` 描述所需能力，或在局部保留 `Any`，避免绑定 DrissionPage 私有路径。

## MixTab 私有导入

- MixTab private import: `DrissionPage._pages.mix_tab.MixTab` 在 `4.2.0b3` 中导入失败，异常为 `ModuleNotFoundError`。
- 当前 `autobrowser.py` 仍有 `from DrissionPage._pages.mix_tab import MixTab`，这是 Phase 2 的最高优先级迁移点。
- Phase 1 不修改业务代码，只登记迁移项。

## click.middle 返回行为

- click.middle return: `DrissionPage._units.clicker.Clicker.middle` 签名为 `(self, get_tab=True)`。
- 静态源码探测显示：默认 `get_tab=True` 时会等待新 tab id，并返回 `self._ele.tab.browser._get_tab(tid)`；未拿到新 tab 时抛出 `RuntimeError`。
- 风险：该行为依赖真实浏览器事件，Phase 1 只能确认静态逻辑，Phase 2/3 必须用真实浏览器 smoke 验证 `link_ele.click.middle()` 是否仍返回可操作 tab。

## 其它后续验证项

- `ChromiumTab.run_js` 签名：`(self, script, *args, as_expr=False, timeout=None)`。
- `ChromiumTab.close` 签名：`(self, others=False, session=False)`。
- `ChromiumTab` 类上可见 `scroll` 与 `wait` 属性，但 `wait.eles_loaded()`、`scroll.to_bottom()`、`scroll.up()`、`scroll.down()` 仍需在真实 tab 上验证。
- `click.__call__` 签名为 `(self, by_js=False, timeout=1.5, wait_stop=False)`，`wait_stop=False` 与计划中的 4.2 行为变化一致，后续如调用普通 `click()` 需单独评估等待策略。

## use_system_user_path

- use_system_user_path: `ChromiumOptions` 上存在并可调用，签名为 `(self, on_off=True)`。
- 当前 `use_system_user.py` 的链式写法 `ChromiumOptions().use_system_user_path().save()` 在签名层面仍成立。
- 由于 `save()` 会写入配置，本阶段未执行该脚本；后续 Phase 2/3 如需确认写入效果，应在用户确认后单独验证。

## 回退策略

- Rollback strategy: 若 `4.2.0b3` 后续真实浏览器 smoke 出现阻塞缺陷，优先回退本次迁移分支中的业务代码改动，再将依赖约束退回迁移前版本范围并重算 `uv.lock`。
- 当前 Phase 1 未修改业务代码，回退面仅为清单文件和 TASK-001 的依赖约束改动。
- 在回退前保留失败命令、DrissionPage 版本、异常栈和是否涉及真实浏览器会话，避免把 beta 缺陷误判为项目逻辑问题。

## 探测命令记录

```powershell
uv run python -c "import inspect, importlib.metadata as md; from DrissionPage import Chromium, ChromiumOptions; print('DrissionPage version:', md.version('DrissionPage')); print('set_browser_path:', inspect.signature(ChromiumOptions.set_browser_path)); print('new_tab:', inspect.signature(Chromium.new_tab)); assert 'edge' in str(inspect.signature(ChromiumOptions.set_browser_path)); assert 'hidden' in str(inspect.signature(Chromium.new_tab)); assert callable(getattr(ChromiumOptions(), 'use_system_user_path'))"
```

## 参考

- DrissionPage 4.2 计划引用：https://www.drissionpage.cn/features/4.2
- DrissionPage 4.x 版本文档：https://www.drissionpage.cn/dp40docs/versions/4x/
