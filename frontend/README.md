# BookKeeping Frontend

React + TypeScript + Vite 前端，使用 pnpm 管理依赖。开发环境由根目录的
Docker Compose 统一启动，无需在宿主机安装 Node.js 或 pnpm。

```powershell
# 在项目根目录启动
docker compose up --build

# 添加依赖
docker compose exec frontend pnpm add <package-name>

# 添加开发依赖
docker compose exec frontend pnpm add -D <package-name>

# 运行构建
docker compose exec frontend pnpm build

# 运行 lint
docker compose exec frontend pnpm lint
```

pnpm 版本固定在 `package.json` 的 `packageManager` 字段中。提交依赖变更时，
需要同时提交 `package.json` 和 `pnpm-lock.yaml`，不要生成或提交
`package-lock.json`。
