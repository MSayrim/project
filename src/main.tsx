import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { PriceProvider } from './contexts/PriceContext';
import './i18n';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PriceProvider>
      <App />
    </PriceProvider>
  </StrictMode>
);