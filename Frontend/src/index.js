import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from './context/ThemeContext';

const hideStartupSplash = () => {
  const splash = document.getElementById('startup-splash');
  if (!splash) {
    return;
  }

  splash.classList.add('startup-splash-hidden');
  window.setTimeout(() => {
    splash.remove();
  }, 240);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

window.requestAnimationFrame(hideStartupSplash);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
