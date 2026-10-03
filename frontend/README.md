# BookKeeping Frontend

React 19 + TypeScript 7 + Vite 8 前端，使用 pnpm 管理依赖，Oxlint 检查代码，Oxfmt 统一格式。

## 工具版本

宿主机的 Node.js 和 pnpm 由根目录 `mise.toml` 管理，只固定主版本和次版本：

- Node.js 26.10
- pnpm 12.8

Docker 使用相同版本系列，可通过 `NODE_VERSION`、`PNPM_VERSION` 构建参数调整；升级系列时需要同步根目录的 mise 配置和 Docker 默认值。`package.json` 中的 `engines` 用于检查兼容范围，不再通过 Corepack 的 `packageManager` 字段固定 pnpm 补丁版本。

依赖包在 `package.json` 中声明版本范围，精确解析版本保存在 `pnpm-lock.yaml`。修改依赖时同时提交这两个文件，不生成 `package-lock.json`。pnpm 12 的安装配置放在 `pnpm-workspace.yaml`，其中只允许 `@swc/core` 执行安装脚本。

## 本地开发

以下命令在项目根目录运行。`mise install node pnpm` 安装前端所需工具；`mise exec node pnpm` 明确使用项目声明的 Node.js 和 pnpm，`--dir frontend` 将 pnpm 的工作目录设为前端。

```powershell
mise trust
mise install node pnpm
mise exec node pnpm -- pnpm --dir frontend install --frozen-lockfile
mise exec node pnpm -- pnpm --dir frontend dev
```

`--frozen-lockfile` 按锁文件安装，不会自动变更依赖版本。开发服务器默认将 `/graphql` 转发至 `http://localhost:3000`，可使用 `VITE_BACKEND_URL` 环境变量调整。

## 检查与格式化

在项目根目录运行：

```powershell
mise exec node pnpm -- pnpm --dir frontend lint
mise exec node pnpm -- pnpm --dir frontend fmt:check
mise exec node pnpm -- pnpm --dir frontend typecheck
mise exec node pnpm -- pnpm --dir frontend build
```

- `lint`：执行 Oxlint，检查错误、Hooks 调用顺序、Effect 依赖和 Fast Refresh 导出；有警告也返回失败。
- `fmt:check`：只检查格式。需要统一格式时运行 `mise exec node pnpm -- pnpm --dir frontend fmt`，该命令会修改前端文件。
- `typecheck`：通过 TypeScript 7 的 `tsc -b` 执行类型检查。
- `build`：先做类型检查，再由 Vite 生成 `dist/`。

项目暂未采用 React Compiler，因此没有启用新增的 `react/purity` 和 `react/set-state-in-effect` 编译器检查；原有 Hooks 与 Fast Refresh 检查保留。Oxfmt 忽略构建产物与 pnpm 自动生成的锁文件。

## Docker 开发

根目录的 Docker Compose 提供前后端开发环境。容器使用独立的 `node_modules` 卷，启动时校验清单、锁文件和 pnpm 配置；任一发生变化时重新执行冻结锁安装。

已启动开发环境后，在项目根目录运行以下命令，分别添加依赖、添加开发依赖、构建和检查：

```powershell
docker compose exec frontend pnpm add <package-name>
docker compose exec frontend pnpm add -D <package-name>
docker compose exec frontend pnpm build
docker compose exec frontend pnpm lint
docker compose exec frontend pnpm fmt:check
```

## GraphQL 类型

Apollo Client 4 的 React API 从 `@apollo/client/react` 导入，并显式依赖 `rxjs`。`src/graphql/queries.ts` 和 `mutations.ts` 使用 `TypedDocumentNode` 描述响应及变量，类型与 Rails GraphQL 字段的可空性保持一致；变更后端字段时需同步这些类型。
