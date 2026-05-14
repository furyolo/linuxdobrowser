# TASK-001 固化 DrissionPage 4.2 beta 依赖约束

## 修改

- `pyproject.toml`：保留 dependencies 多行数组格式，将直接依赖改为 `drissionpage>=4.2.0b3,<4.3`。
- `uv.lock`：通过 `uv lock --upgrade-package drissionpage --prerelease if-necessary-or-explicit` 重算，root metadata 的 `requires-dist` 已同步为 `>=4.2.0b3,<4.3`，DrissionPage 包版本保持 `4.2.0b3`。

## 验证

- `Select-String -Path pyproject.toml -Pattern '"drissionpage>=4\.2\.0b3,<4\.3"'`
- `Select-String -Path uv.lock -Pattern 'name = "drissionpage"'`
- `Select-String -Path uv.lock -Pattern 'version = "4\.2\.0b3"'`
- `Select-String -Path uv.lock -Pattern 'specifier = ">=4\.2\.0b3,<4\.3"'`
- `uv lock --check`

## 备注

- 未新增依赖，保留 Aliyun index 和 `mypy>=1.17.0` dev 依赖。
- `uv lock` 期间出现上游包无效版本声明的规范化 warning：`>=3.6,` 被修正为 `>=3.6`，解析和 `uv lock --check` 均通过。
- `uv.lock` 当前在 Git 中为 ignored 文件，但本地文件内容已按任务要求更新。
