import React from 'react';

type State = { error: Error | null };

export class DevErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: any) {
    // keep a visible trace in dev
    // eslint-disable-next-line no-console
    console.error('Captured render error:', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children as React.ReactElement;

    const err = this.state.error;
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center p-6 bg-black/60 text-white">
        <div className="w-full max-w-3xl bg-white/95 text-slate-900 rounded-xl shadow-2xl p-6 border border-slate-200">
          <h2 className="text-xl font-bold">Application error — see details below</h2>
          <p className="text-sm text-slate-600 mt-2">The app encountered an error while rendering. This overlay appears to help debugging in development.</p>

          <div className="mt-4 bg-slate-50 rounded-md p-4 overflow-auto max-h-[60vh] text-sm font-mono text-pink-700">
            <pre>{err.stack || err.message}</pre>
          </div>

          <div className="mt-4 flex gap-3">
            <button className="px-4 py-2 rounded bg-indigo-600 text-white" onClick={() => location.reload()}>Reload</button>
            <button className="px-4 py-2 rounded bg-gray-100" onClick={() => { navigator.clipboard?.writeText(String(err.stack || err.message)); }}>Copy error</button>
          </div>

          <div className="mt-4 text-xs text-slate-500">If this happens in production, please open an issue with the stack trace above.</div>
        </div>
      </div>
    );
  }
}

export default DevErrorBoundary;
