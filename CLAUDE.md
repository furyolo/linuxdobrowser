# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
LinuxDoBrowser is a Python automation tool for browsing the linux.do forum using DrissionPage. It simulates human-like browsing behavior by scrolling through topics and reading content with random delays. The tool supports multiple browsers and concurrent processing.

**Note**: While git history mentions multi-domain support (linux.do and idcflare.com), the current main.py implementation only uses `https://linux.do/`. The userscript `flowreader.user.js` does support both domains.

## Key Files
- `main.py`: Entry point with argument parsing and browser orchestration. Contains main browsing loop and topic loading logic.
- `autobrowser.py`: Core browsing logic including human-like scrolling simulation, topic processing, and concurrent execution handling.
- `use_system_user.py`: Configuration script to use system user browser profiles.
- `flowreader.user.js`: Tampermonkey/Greasemonkey userscript for manual forum reading with configurable timing. Supports both linux.do and idcflare.com domains; on linux.do topic pages its floating button opens a small action menu with Markdown export for the original post.
- `pyproject.toml`: Project dependencies and metadata with uv package manager configuration. Uses Aliyun mirror for faster package downloads in China.
- `mypy.ini`: Type checking configuration with DrissionPage import handling.

## Common Commands
### Development Setup
- Install dependencies: `uv sync`
- Install dependencies with pre-release resolution if needed: `uv sync --pre`
- Run type checking: `uv run mypy .`
- Run main application: `uv run main.py`
- Configure system user profile: `uv run use_system_user.py` (writes local DrissionPage config)
- Check FlowReader userscript: `node --check userscripts/flowreader.user.js`
- Test FlowReader userscript: `node --test userscripts/tests/flowreader.user.test.js`
- Add new dependency: `uv add <package-name>`

### Browser Modes
- Short mode (default 10 topics): `uv run main.py --mode short`
- Long mode (all topics): `uv run main.py --mode long`
- Custom topic count: `uv run main.py --mode short --num 20`

### Browser Selection
- Single browser mode (interactive): `uv run main.py --browser single`
- All browsers mode (sequential): `uv run main.py --browser all`

### DrissionPage 4.2 Verification
- Current verified version: DrissionPage `4.2.0b3`
- No-side-effect checks passed: `uv lock --check` and `uv run mypy .`
- Phase 3 real browser smoke passed with Edge: `"edge" | uv run main.py --mode short --num 1 --browser single`
- Phase 3 userscript regression passed: `node --check userscripts/flowreader.user.js` and `node --test userscripts/tests/flowreader.user.test.js`.
- Main-post export validation is covered in FlowReader tests.
- `uv run use_system_user.py` writes local DrissionPage config and should only be run intentionally

## DrissionPage 4.2 Migration Notes
- 当前依赖为 DrissionPage 4.2 beta：`DrissionPage >=4.2.0b3,<4.3`，维护时需要保留 beta API 变化风险。
- 业务代码禁止导入 `DrissionPage._pages.*` 私有模块；需要类型约束时使用公开 API、本地 `Protocol` 或局部 `Any`。
- `MixTab` 功能已合并到 Chromium tab 方向，当前代码不再依赖 `MixTab` 类型。
- Edge 分支使用显式 `msedge.exe` 路径并绑定独立本地调试端口，避免连接到默认 `127.0.0.1:9222` 上已有的 Chrome。
- `Chromium.new_tab()` 已支持 `hidden` 参数，但当前主流程仍保留 `browser.new_tab('https://linux.do/')`，不改变标签页打开策略。
- Phase 3 已验证 `click.middle()` 返回的新标签页可继续执行 wait、scroll、close 和退出流程。
- userscript 不属于 DrissionPage 迁移面，但 Phase 3 已用 Node 语法和内置测试确认未误伤。

## Architecture Notes
### Core Design Patterns
- **Async Execution**: Uses asyncio throughout for concurrent topic processing
- **Browser Abstraction**: DrissionPage provides unified interface for different browser types
- **Semaphore Control**: Limits concurrent browser tabs to 3 in main.py:54
- **Topic Filtering**: Processes only topics with ≥1 replies or containing 'k' in autobrowser.py:60

### Browser Management
- Browser choices configured in main.py: Edge uses an explicit `msedge.exe` path with a dedicated debug port, while Chrome, 115浏览器, and 豆包浏览器 use explicit paths.
- Dynamic browser selection via user input in main.py:77-82
- Sequential browser execution in 'all' mode in main.py:83-86
- Browser lifecycle management: creation, usage, and cleanup in main.py:20-59

### Human-like Behavior Simulation
- **Scrolling Simulation**: Random distances (200-500px) in autobrowser.py:40
- **Timing Variations**: Random delays based on scroll distance in autobrowser.py:50
- **Behavioral Randomness**: 3% chance for upward scroll or longer pauses in autobrowser.py:43,54
- **Page Bottom Detection**: JavaScript-based detection with tolerance in autobrowser.py:36

### Topic Processing Pipeline
1. **Topic Loading**: Dynamic loading with timeout and polling in main.py:27-52
2. **Content Filtering**: Reply count and keyword filtering in autobrowser.py:60
3. **Concurrent Processing**: Semaphore-guarded async processing in autobrowser.py:58
4. **Content Reading**: Human-like scrolling with time limits in autobrowser.py:76-78

### Configuration
- **Dependency Management**: Uses Aliyun mirror (https://mirrors.aliyun.com/pypi/simple) in pyproject.toml for faster package downloads
- **Type Safety**: MyPy configuration with Python 3.13 target and DrissionPage import handling
- **Browser Profile**: System user profile configuration for persistent sessions
- **Browser Paths**: Edge, Chrome, 115浏览器, and 豆包浏览器 keep explicit Windows paths in main.py; Edge also uses a dedicated local debug port to avoid attaching to Chrome on `127.0.0.1:9222`.
- **Logging**: Structured logging with timestamps in autobrowser.py:10-16

## Userscript
`flowreader.user.js` is a browser userscript (Tampermonkey/Greasemonkey) that complements the automation tool:
- **Manual Control**: Provides UI for manually triggering forum reading with customizable timing
- **Multi-Domain**: Supports both linux.do and idcflare.com
- **Configurable**: Base delay, random delay range, request size, read time can all be adjusted
- **Auto-start Option**: Can be configured to automatically start reading on page load
