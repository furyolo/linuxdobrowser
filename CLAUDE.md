# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
LinuxDoBrowser is a Python automation tool for browsing the linux.do forum using DrissionPage. It simulates human-like browsing behavior by scrolling through topics and reading content with random delays. The tool supports multiple browsers and concurrent processing.

**Note**: While git history mentions multi-domain support (linux.do and idcflare.com), the current main.py implementation only uses `https://linux.do/`. The userscript `flowreader.user.js` does support both domains.

## Key Files
- `main.py`: Entry point with argument parsing and browser orchestration. Contains main browsing loop and topic loading logic.
- `autobrowser.py`: Core browsing logic including human-like scrolling simulation, topic processing, and concurrent execution handling.
- `use_system_user.py`: Configuration script to use system user browser profiles.
- `flowreader.user.js`: Tampermonkey/Greasemonkey userscript for manual forum reading with configurable timing. Supports both linux.do and idcflare.com domains.
- `pyproject.toml`: Project dependencies and metadata with uv package manager configuration. Uses Aliyun mirror for faster package downloads in China.
- `mypy.ini`: Type checking configuration with DrissionPage import handling.

## Common Commands
### Development Setup
- Install dependencies: `uv sync`
- Run type checking: `uv run mypy .`
- Run main application: `uv run main.py`
- Configure system user profile: `uv run use_system_user.py`
- Add new dependency: `uv add <package-name>`

### Browser Modes
- Short mode (default 10 topics): `uv run main.py --mode short`
- Long mode (all topics): `uv run main.py --mode long`
- Custom topic count: `uv run main.py --mode short --num 20`

### Browser Selection
- Single browser mode (interactive): `uv run main.py --browser single`
- All browsers mode (sequential): `uv run main.py --browser all`

## Architecture Notes
### Core Design Patterns
- **Async Execution**: Uses asyncio throughout for concurrent topic processing
- **Browser Abstraction**: DrissionPage provides unified interface for different browser types
- **Semaphore Control**: Limits concurrent browser tabs to 3 in main.py:54
- **Topic Filtering**: Processes only topics with ≥1 replies or containing 'k' in autobrowser.py:60

### Browser Management
- Browser paths configured in main.py:70-75 (Edge, 115浏览器, 豆包浏览器)
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
- **Browser Paths**: Hardcoded Windows paths for Edge, 115浏览器, 豆包浏览器 in main.py:70-75
- **Logging**: Structured logging with timestamps in autobrowser.py:10-16

## Userscript
`flowreader.user.js` is a browser userscript (Tampermonkey/Greasemonkey) that complements the automation tool:
- **Manual Control**: Provides UI for manually triggering forum reading with customizable timing
- **Multi-Domain**: Supports both linux.do and idcflare.com
- **Configurable**: Base delay, random delay range, request size, read time can all be adjusted
- **Auto-start Option**: Can be configured to automatically start reading on page load