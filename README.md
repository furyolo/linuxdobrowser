# LinuxDoBrowser

LinuxDoBrowser 是一个自动化浏览 linux.do 论坛的 Python 工具。

## 功能特点

- 支持多种浏览器选择 (Chrome, Edge, 115浏览器, 豆包浏览器)
- 自动加载更多主题
- 模拟人类浏览行为,包括滚动和停顿
- 异步处理多个主题,提高效率

## 安装

本项目使用 uv 进行依赖管理。请确保您已安装 uv,然后按照以下步骤进行安装:

1. 进入项目目录:
   ```bash
   cd linuxdobrowser
   ```

2. 安装依赖:
   ```bash
   uv sync
   ```
   DrissionPage 4.2 当前使用 beta/pre-release 版本，本项目依赖约束为 `DrissionPage >=4.2.0b3,<4.3`。如果重新解析依赖时未自动选择预发布版本，可使用：
   ```bash
   uv sync --pre
   ```

## 使用方法

1. 运行主程序:
   ```bash
   uv run main.py
   ```

2. 根据提示选择要使用的浏览器或浏览模式。

3. 程序将自动打开 linux.do 网站,加载主题并模拟浏览行为。

真实浏览器运行需要本机浏览器可用，并且浏览器配置中具备访问 linux.do 所需的登录态。Edge 使用项目内显式 `msedge.exe` 路径和独立调试端口，避免连接到默认端口上已有的 Chrome；Chrome、115 浏览器和豆包浏览器使用项目内显式路径。

## 配置

如果您希望使用系统用户配置文件运行浏览器,可以执行以下命令:
```bash
uv run use_system_user.py
```
该命令会调用 DrissionPage 的 `use_system_user_path().save()`，会写入本机 DrissionPage 配置。

## 依赖

- Python 3.13+
- DrissionPage >=4.2.0b3,<4.3

## DrissionPage 4.2 迁移状态

- 当前本地验证版本：DrissionPage `4.2.0b3`。
- Edge 真实浏览器 smoke 已通过：`"edge" | uv run main.py --mode short --num 1 --browser single`。
- userscript 回归已通过：`node --check userscripts/flowreader.user.js` 和 `node --test userscripts/tests/flowreader.user.test.js`。
- DrissionPage 4.2 仍按 beta/pre-release 风险维护；后续依赖重解析或浏览链路变更后，应重新运行轻量检查，必要时再执行真实浏览器 smoke。

## UserScripts

`userscripts/` 目录包含可安装到 Tampermonkey/Greasemonkey 的辅助脚本：

- `flowreader.user.js`：论坛手动阅读辅助；在 Linux.do 首页提供“浏览主帖”悬浮按钮，可一键浏览当前页面可见主帖并跳过已浏览主帖，悬停或聚焦后可展开“重置进度”快捷操作；在话题详情页提供“浏览跟帖”浮动按钮，悬停或聚焦后可展开“导出 Markdown”快捷操作。
- `summarizeForumThread.user.js`：Linux.do 帖子总结辅助。

安装 `flowreader.user.js` 后，打开 `https://linux.do/` 或 `https://linux.do/latest` 可点击右侧“浏览主帖”悬浮按钮浏览当前页面可见主帖；向下滚动加载更多主帖后再次点击，会从未浏览的主帖继续。主帖浏览进度最多保留最近 `20000` 个 topic id，悬停或键盘聚焦“浏览主帖”按钮即可看到“重置进度”并清空已浏览记录。打开 `https://linux.do/t/topic/...` 形式的话题详情页，可使用右侧 FlowReader 浮动按钮浏览跟帖。悬停或键盘聚焦右侧按钮即可看到“导出 Markdown”；脚本只导出 `post_number = 1` 的主帖，不包含跟帖，文件正文使用 Discourse API 返回的 `cooked` HTML 转为纯净 Markdown，并保留主帖图片链接、来源、标题、作者、分类、标签和时间等元数据。

UserScript 验证命令：

```bash
node --check userscripts/flowreader.user.js
node --test userscripts/tests/flowreader.user.test.js
```

## 命令行参数

- `-m` 或 `--mode`: 浏览模式，选择 `short` (浏览10个主题) 或 `long` (浏览所有主题)，默认为 `short`。
- `-b` 或 `--browser`: 浏览器模式，选择 `single` (单个浏览器) 或 `all` (所有浏览器)，默认为 `single`。在 `all` 模式下，程序将顺序遍历所有浏览器，每个浏览器完成后关闭并启动下一个浏览器。
- `-n` 或 `--num`: 指定在short模式下浏览的主题数量，默认为10。

## 贡献

欢迎提交 Pull Requests 来改进这个项目。对于重大更改,请先开 issue 讨论您想要改变的内容。

## 许可证

[MIT](https://choosealicense.com/licenses/mit/)
