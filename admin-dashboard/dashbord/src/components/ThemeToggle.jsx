export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ display: isDark ? 'block' : 'none' }}>
        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
        <path stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.55 1.55M18.25 18.25l1.55 1.55M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.55-1.55M18.25 5.75l1.55-1.55" />
      </svg>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ display: isDark ? 'none' : 'block' }}>
        <path stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a7 7 0 0 0 10.7 10.7Z" />
      </svg>
    </button>
  )
}
