import { useEffect, useState } from 'react';
import Hero from './components/Hero';
import MagneticCursor from './components/MagneticCursor';
import WorkSection from './components/WorkSection';

const THEME_STORAGE_KEY = 'portfolio-theme';

function ThemeToggle({ theme, onToggle }) {
  const isMidnight = theme === 'midnight';

  return (
    <button
      type="button"
      onClick={onToggle}
      className="theme-toggle premium-action"
      aria-label={isMidnight ? 'Switch to light mode' : 'Switch to midnight accent mode'}
      aria-pressed={isMidnight}
      title={isMidnight ? 'Light mode' : 'Midnight accent'}
    >
      <span className="theme-toggle__icon theme-toggle__sun" aria-hidden="true">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
        </svg>
      </span>
      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__thumb" />
      </span>
      <span className="theme-toggle__icon theme-toggle__moon" aria-hidden="true">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.5 14.4A8.7 8.7 0 0 1 9.6 3.5a.7.7 0 0 0-.8-.9A10 10 0 1 0 21.4 15.2a.7.7 0 0 0-.9-.8Z" />
        </svg>
      </span>
    </button>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return window.localStorage.getItem(THEME_STORAGE_KEY) === 'midnight' ? 'midnight' : 'light';
  });

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  return (
    <div className={`custom-cursor-area theme-${theme}`}>
      <MagneticCursor />
      <header className="fixed top-0 inset-x-0 z-50 pt-6 pb-3 text-center text-[15px] text-neutral-900 font-semibold tracking-tight pointer-events-none">
        <span className="pointer-events-auto bg-white/60 backdrop-blur-md px-3 py-1 rounded-full">
          Phani Varun
        </span>
      </header>
      <ThemeToggle
        theme={theme}
        onToggle={() => setTheme((current) => (current === 'midnight' ? 'light' : 'midnight'))}
      />
      <Hero />
      <WorkSection />
    </div>
  );
}
