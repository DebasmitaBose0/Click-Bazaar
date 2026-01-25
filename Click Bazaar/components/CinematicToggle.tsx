import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const STORAGE_KEY = 'clickbazaar.cinematic';

const getPref = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'on') return true;
    if (raw === 'off') return false;

    // Default - respect system preference for reduced motion
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      return !prefersReduced;
    }
  } catch (e) {
    // ignore
  }
  return true;
};

const TRANSITION_KEY = 'clickbazaar.transitionVariant';

const applyToDocument = (enabled: boolean) => {
  if (typeof document === 'undefined') return;
  if (!enabled) {
    document.documentElement.classList.add('reduced-motion');
  } else {
    document.documentElement.classList.remove('reduced-motion');
  }
};

const getVariant = (): 'subtle' | 'balanced' | 'dramatic' => {
  try {
    const raw = localStorage.getItem(TRANSITION_KEY);
    if (raw === 'dramatic') return 'dramatic';
    if (raw === 'balanced') return 'balanced';
    return 'subtle';
  } catch {
    return 'subtle';
  }
};

const setVariant = (v: 'subtle' | 'balanced' | 'dramatic') => {
  try {
    localStorage.setItem(TRANSITION_KEY, v);
    window.dispatchEvent(new CustomEvent('clickbazaar:variant-change', { detail: { variant: v } }));
  } catch {
    // ignore
  }
};

const CinematicToggle: React.FC = () => {
  const [enabled, setEnabled] = useState<boolean>(getPref());
  const [variant, setLocalVariant] = useState<'subtle' | 'balanced' | 'dramatic'>(getVariant());

  useEffect(() => {
    // Apply initial
    applyToDocument(enabled);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off');
    } catch (e) {
      // ignore
    }
    applyToDocument(enabled);
  }, [enabled]);

  useEffect(() => {
    setVariant(variant);
  }, [variant]);

  return (
    <div className="flex items-center gap-3">
      <button
        aria-pressed={!enabled}
        title="Toggle cinematic motion"
        onClick={() => setEnabled((s) => !s)}
        className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 transition"
      >
        {enabled ? <Sun size={14} className="text-amber-300" /> : <Moon size={14} className="text-indigo-400" />}
        <span className="text-xs text-gray-300">{enabled ? 'Cinematic: On' : 'Cinematic: Off'}</span>
      </button>

      {/* Variant selector (preview) — shown on md+ screens */}
      <div className="hidden md:flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full p-1">
        <label className="sr-only">Transition style</label>
        {(['subtle','balanced','dramatic'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setLocalVariant(v)}
            aria-pressed={variant === v}
            className={`text-[11px] px-3 py-1 rounded-full font-semibold transition ${variant === v ? 'bg-indigo-600 text-white shadow' : 'text-gray-300 hover:bg-slate-700'}`}
            title={`Preview ${v} transition`}
          >
            {v[0].toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      <span className="text-xs text-gray-500 hidden sm:inline">Toggle cinematic motion</span>
    </div>
  );
};

export default CinematicToggle;
