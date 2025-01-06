# BookKeeping
## Database
![alt text](image.png)
## Hint
### Rails
- Use `rails new xxxx --api`
### Rails GraphQL
- IDE Path: `localhost:3000/grqphiql` ⚠️Don't forget `i`⚠️
- `field :login, mutation: Mutations::Login`
mutation {
    login(x, x, ....) {
        xx
        xxx
        ....
    }
}
- `field :user_login, mutation: Mutations::Login`
mutation {
    userLogin(x, x, ....) {
        xx
        xxx
        ....
    }
}  
⚠️GraphQL 会自动将下划线形式的名称转换为驼峰形式）。这遵循了 GraphQL 的规范：对外暴露的字段名称通常是驼峰命名法。⚠️
### React Vite
- Add to vite.config.ts
```
server: {
    proxy: {
      "/graphql": {
        target: "http://localhost:3000/",
        changeOrigin: true
      }
    }
  }
```
### Apollo GraphQL
- change uri path from 3000 to 5173
`http://localhost:5173/graphql`
