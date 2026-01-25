import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AppProvider } from "./shared";

const root = document.getElementById("root");

if (!root) {
  throw new Error("❌ Root element (#root) not found in index.html");
}

// Dev-only: global error overlay for uncaught errors / promise rejections
if (typeof window !== 'undefined') {
  const showOverlay = (msg: string) => {
    try {
      let el = document.getElementById('dev-error-overlay');
      if (!el) {
        el = document.createElement('div');
        el.id = 'dev-error-overlay';
        document.body.appendChild(el);
      }
      el.innerHTML = `
        <div style="position:fixed;inset:0;background:rgba(0,0,0,0.6);color:#fff;z-index:99999;display:flex;align-items:flex-start;justify-content:center;padding:24px;">
          <div style="max-width:900px;background:#fff;color:#111;border-radius:12px;padding:18px;box-shadow:0 10px 40px rgba(2,6,23,0.4);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;overflow:auto;max-height:80vh;">
            <strong style="display:block;margin-bottom:8px;color:#b91c1c">Unhandled error — check stack below</strong>
            <pre style="white-space:pre-wrap;color:#111">${msg}</pre>
            <div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end">
              <button onclick="location.reload()" style="padding:8px 12px;border-radius:8px;background:#111;color:#fff;border:none">Reload</button>
            </div>
          </div>
        </div>`;
    } catch (e) {
      // ignore
    }
  };

  window.addEventListener('error', (ev) => {
    try { showOverlay(String(ev.error?.stack || ev.message || ev.filename || ev.type)); } catch (e) {}
    // eslint-disable-next-line no-console
    console.error(ev.error || ev.message || ev);
  });

  window.addEventListener('unhandledrejection', (ev) => {
    try { showOverlay(String(ev.reason?.stack || ev.reason || 'Unhandled promise rejection')); } catch (e) {}
    // eslint-disable-next-line no-console
    console.error('UnhandledRejection', ev.reason);
  });
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
