import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
    link: new HttpLink({
        uri: 'http://localhost:3000/graphql',
        headers: {
            "Content-Type": "application/json",  // 确保请求体为 JSON 格式
            "Accept": "application/json"          // 可选：接受 JSON 格式的响应
        }
    }),
    cache: new InMemoryCache(),
});

export default client;
