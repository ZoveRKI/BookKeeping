import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRoutes from './AppRoutes'
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <AppRoutes />
    </ApolloProvider>
  </StrictMode>,
)
