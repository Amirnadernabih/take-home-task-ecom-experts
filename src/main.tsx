import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import App from './App';
import './styles/global.css';
import { clearPersistedConfig } from './utils/persistence';

if (import.meta.env.DEV) {
  (window as Window & { __clearWyzeBundleConfig?: () => void }).__clearWyzeBundleConfig =
    clearPersistedConfig;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
