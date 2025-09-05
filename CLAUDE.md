# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
LinuxDoBrowser is a Python automation tool for browsing the linux.do forum using DrissionPage. It simulates human-like browsing behavior by scrolling through topics and reading content with random delays.

## Key Files
- `main.py`: Entry point with argument parsing and browser orchestration
- `autobrowser.py`: Core browsing logic including scrolling and topic processing
- `use_system_user.py`: Configuration script to use system user browser profiles
- `pyproject.toml`: Project dependencies and metadata
- `README.md`: Documentation with usage instructions

## Common Commands
Build/Install dependencies: uv sync
Run main application: uv run main.py
Run with system user profile: uv run use_system_user.py
Short mode (10 topics): uv run main.py --mode short
Long mode (all topics): uv run main.py --mode long
Single browser mode: uv run main.py --browser single
All browsers mode: uv run main.py --browser all

## Architecture Notes
- Uses asyncio for concurrent topic processing
- DrissionPage for browser automation and control
- Semaphore limits concurrent browser tabs (set to 3) in main.py:35
- Browser paths configured in main.py:50-55 (Edge, 115浏览器, 豆包浏览器)
- Two browsing modes: short (10 topics) and long (all topics)
- Topic filtering: processes only topics with ≥1 replies or containing 'k' in autobrowser.py:52
- Human-like scrolling simulation in autobrowser.py:30-47 with random distances and delays
- Dependency management uses Tsinghua mirror source configured in pyproject.toml:12