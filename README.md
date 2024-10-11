# LinuxDoBrowser

LinuxDoBrowser 是一个自动化浏览 linux.do 论坛的 Python 工具。

## 功能特点

- 支持多种浏览器选择 (Chrome, 115浏览器, Edge, 豆包浏览器)
- 自动加载更多主题
- 模拟人类浏览行为,包括滚动和停顿
- 异步处理多个主题,提高效率

## 安装

本项目使用 Poetry 进行依赖管理。请确保您已安装 Poetry,然后按照以下步骤进行安装:

1. 进入项目目录:
   ```bash
   cd linuxdobrowser
   ```

2. 安装依赖:
   ```bash
   poetry install
   ```

## 使用方法

1. 运行主程序:
   ```bash
   poetry run python main.py
   ```

2. 根据提示选择要使用的浏览器。

3. 程序将自动打开 linux.do 网站,加载主题并模拟浏览行为。

## 配置

如果您希望使用系统用户配置文件运行浏览器,可以执行以下命令:
```bash
poetry run python use_system_user.py
```

## 依赖

- Python 3.12+
- DrissionPage 4.1.0.2+

## 贡献

欢迎提交 Pull Requests 来改进这个项目。对于重大更改,请先开 issue 讨论您想要改变的内容。

## 许可证

[MIT](https://choosealicense.com/licenses/mit/)
