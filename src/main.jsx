import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'


// Disable all console methods (dev + prod)
if (true) { // set to true even in development for testing
  const noop = () => { };
  ['log', 'warn', 'error', 'info', 'debug', 'trace', 'group', 'groupEnd', 'table'].forEach(fn => {
    console[fn] = noop;
  });
}

createRoot(document.getElementById('root')).render(


  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
