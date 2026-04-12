import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './styles/globals.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Elemento #root no encontrado en el DOM');

createRoot(rootElement).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
