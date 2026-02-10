import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { StoreProvider } from './context/StoreContext';
import { ThemeProvider } from './context/ThemeContext';

import { AuthProvider } from './context/AuthContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <StoreProvider>
          <BrowserRouter>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </BrowserRouter>
        </StoreProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);