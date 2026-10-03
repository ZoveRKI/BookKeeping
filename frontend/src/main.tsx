import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRoutes from './AppRoutes'
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import ThemeToggle from './components/atoms/ThemeToggle';
import { applyTheme, readStoredTheme } from './theme';
import './index.css';

applyTheme(readStoredTheme());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <AppRoutes />
      <ThemeToggle />
    </ApolloProvider>
  </StrictMode>,
)
