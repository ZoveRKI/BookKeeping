# BookKeeping Backend

Rails API 与 GraphQL 服务。开发环境配置和 Docker 启动方式见[项目说明](../ReadMe.md)。

## 工具与依赖

- 根目录 `mise.toml` 管理 Ruby `4.0` 和 Bundler `4.0`，允许同一 minor 系列更新补丁。
- `.ruby-version` 为编辑器等工具保留 Ruby `4.0` 配置；两个 Dockerfile 使用同样的默认系列，并支持 `RUBY_VERSION`、`BUNDLER_VERSION` 构建参数。
- `Gemfile` 声明依赖范围，`Gemfile.lock` 固定完整依赖树和校验和。不要手工编辑锁定版本。
- 本次验证环境（2026-10-03）：Ruby 4.0.7、Bundler 4.0.22、Rails 8.1.4、GraphQL 2.6.11、Puma 8.0.2。
- `marcel` 保留 1.2.1，因为 Rails 8.1.4 的 Active Storage 要求 `~> 1.0`；其余依赖已通过 `bundle outdated` 核对。

## 检查

RuboCop 继承 Rails Omakase 规则，并额外检查 2 个空格缩进、缩进一致性及多行参数、数组和 Hash 的对齐。规则集中在 `.rubocop.yml`。

在本目录执行以下命令，分别检查代码风格与静态安全问题，不连接数据库：

```sh
bundle exec rubocop
bundle exec brakeman --no-pager
```

只修正缩进、空格和对齐等排版问题时，可以执行 `bundle exec rubocop --fix-layout`。该命令会修改源文件，执行后检查 Git diff。

## VS Code

从 VS Code 的「文件 → 从文件打开工作区」打开根目录的 `BookKeeping.code-workspace`。它将 `backend` 注册为独立的工作区文件夹，使 Ruby LSP 能直接找到后端的 `Gemfile` 和 `.rubocop.yml`。

工作区已指定 Ruby LSP 使用 mise 选择 Ruby，并通过 RuboCop 提供诊断和保存时格式化；Ruby 使用 2 个空格缩进。

应用和编辑器统一使用 `backend/Gemfile` 中的 RuboCop 依赖。Ruby LSP 扩展会自动管理自身需要的辅助依赖，无需另外维护根目录的工具 `Gemfile`。

本机编辑器需要本机 Ruby 和后端 gems，Docker 内的依赖不会自动提供给本机编辑器。在本目录执行 `mise x -- bundle check` 检查依赖；缺少依赖时执行 `mise x -- bundle install`。安装后，通过 `mise x -- bundle exec rubocop` 检查后端代码。这些命令不会启动 Rails 或迁移数据库。

Windows 使用 Scoop 安装 mise 时，可在本目录通过下面的 PowerShell 命令检查依赖，避免 Scoop shim 的参数转发问题。需要安装时，将最后的 `check` 改为 `install`；如果 `graphiql-rails` 报创建符号链接的权限错误，可在管理员终端完成安装。

```powershell
$miseExe = Join-Path $env:USERPROFILE 'scoop/apps/mise/current/bin/mise.exe'
& $miseExe x -- bundle check
```

打开工作区后，在「输出 → Ruby LSP」确认后端使用了 RuboCop。若刚安装了依赖，执行命令面板中的 `Ruby LSP: Restart` 重新检测。

## 测试

运行测试前，应配置独立、可丢弃的 MySQL 测试数据库，并设置 `RAILS_ENV=test`、`DB_HOST`、`DB_PORT`、`DB_USERNAME`、`DB_PASSWORD` 和 `DB_TEST_NAME`。确认连接目标后执行：

```sh
bundle exec rails db:schema:load
bundle exec rails zeitwerk:check
bundle exec rails test
```

`db:schema:load` 会重建目标库的表，只能用于该测试数据库。不要指向现有账本。开发和生产 Docker 入口会执行 `db:prepare`；临时检查容器应使用 `--entrypoint` 显式覆盖入口。

升级验证已在临时 MySQL 8.4 和 26.7 上通过：各 2 个测试、9 个断言，并检查了 HTTP 健康端点、GraphQL 登录和 Cookie 会话。现有真实数据库未迁移；数据库版本调整需单独备份、迁移和验证。

## 升级兼容性

- Rails 默认配置已提升至 8.1；后续生成 `schema.rb` 时列会按名称排序。
- Bundler 4 的冻结安装要求锁文件保持 LF，已通过 `.gitattributes` 固定。
- Puma 8 在具备 IPv6 接口的环境中默认优先监听 IPv6；开发容器仍显式绑定 `0.0.0.0`。部署时应验证代理与监听地址。
- 本项目没有配置图片变体处理。生产资源构建会提示缺少可选的 `image_processing` gem，不影响当前账本 API；以后使用 Active Storage 图片变体时再配置。
