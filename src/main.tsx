/// <reference types="vite-plugin-pwa/react" />
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './styles/tokens.css';
import './styles/global.css';
import './styles/dark.css';
import './styles/print.css';
import './styles/components.css';

import { AppContextProvider } from './AppContext';
import App from './App';
import { UpdateToast } from './components/UpdateToast';

const container = document.getElementById('root');
if (!container) {
  throw new Error('#root element not found');
}

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <App />
        <UpdateToast />
      </AppContextProvider>
    </BrowserRouter>
  </StrictMode>,
);
