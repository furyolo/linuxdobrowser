# DrissionPage 4.2 迁移清单

## 迁移边界

- Phase 1 只产出迁移清单，不修改业务代码。
- 不打开 `linux.do` 做真实登录态浏览 smoke。
- 不修改 userscripts；userscript 不受 DrissionPage 依赖升级影响。
- 后续迁移不得引入新依赖，优先使用现有 DrissionPage、标准库和本地类型约束。

## 文件级修改清单

### `autobrowser.py`

- 移除 `from DrissionPage._pages.mix_tab import MixTab`；该私有路径在 `DrissionPage 4.2.0b3` 中已不存在。
- 将 `wait_for_new_topics()`、`is_bottom_of_page()`、`human_like_scroll()`、`process_topic()` 的 `Union[MixTab, Any]` 改为本地 `Protocol` 或局部 `Any`。
- 保留现有滚动、随机延迟、并发控制和日志策略；不要在迁移中改变浏览策略。
- 对 `link_ele.click.middle()` 做真实浏览器 smoke：确认默认 `get_tab=True` 时仍返回可操作 tab，并覆盖未打开新 tab 的异常路径。
- 验证 `new_tab.wait.eles_loaded()`、`new_tab.close()`、`new_tab.run_js()`、`new_tab.scroll.up/down()` 在 4.2 下的行为。

### `main.py`

- 评估 Edge 配置是否从显式路径 `set_browser_path(path)` 改为 `set_browser_path(edge=True)`；如果保留显式路径，需要在代码注释或文档中说明原因。
- `Chromium.new_tab()` 已支持 `hidden=False` 默认参数；现有 `browser.new_tab('https://linux.do/')` 可先保持不变，后续仅在需要后台标签时显式使用 `hidden=True`。
- 真实 smoke 放到 Phase 3：`uv run main.py --mode short --num 1`，需要用户本机浏览器路径与登录态支持。
- 不改变 `Semaphore(3)`、主题加载轮询、滚动到底部加载更多主题的行为。

### `use_system_user.py`

- `ChromiumOptions().use_system_user_path().save()` 的签名层面仍可用。
- Phase 2 如修改该文件，应只做必要注释或更明确的调用封装；不要在未确认时改变保存路径。
- Phase 3 验证前需要明确这是会写入 DrissionPage 配置的操作，避免把配置写入当作无破坏探测。

### `README.md`

- 将依赖说明从 `DrissionPage 4.1.0.2+` 更新为当前约束 `DrissionPage >=4.2.0b3,<4.3`。
- 安装说明补充 4.2 仍为 beta/pre-release，依赖解析应使用当前锁文件或允许预发布版本。
- 保留 `uv run main.py` 和 `uv run use_system_user.py` 的使用方式，补充真实浏览器 smoke 需要本机浏览器和登录态。

### `CLAUDE.md`

- 更新项目依赖说明，标记 DrissionPage 4.2 beta 风险。
- 增加维护约束：禁止业务代码导入 `DrissionPage._pages.*` 等私有模块路径。
- 在常用命令中保留 `uv run mypy .`，并记录 Phase 3 的真实 smoke 命令。
- 标注 userscript 不属于 DrissionPage 迁移面，但 Phase 3 可运行 Node 检查确认未误伤。

## 后续验证顺序

1. 先改 `autobrowser.py` 的私有类型导入，运行 `uv run mypy .`。
2. 再检查 `main.py` 的 Edge 配置和 `new_tab()` 参数，不改浏览策略。
3. 然后处理 `use_system_user.py` 文档或调用说明，避免无确认写入配置。
4. 最后更新 `README.md`、`CLAUDE.md` 和 workflow specs。
5. Phase 3 再运行真实浏览器 smoke 和 userscript Node 检查。

## 已知风险

- `click.middle()` 静态源码仍返回新 tab，但真实行为依赖浏览器事件和站点页面结构，必须 smoke。
- `wait.eles_loaded('.topic-body clearfix')` 的 selector 是否符合当前页面结构不属于 API 签名探测，需要真实页面验证。
- DrissionPage 4.2 当前为 beta，迁移后应保留可回退依赖约束和失败记录。
