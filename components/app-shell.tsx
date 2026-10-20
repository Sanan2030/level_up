'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowUpRight,
  BookOpen,
  ChartNoAxesCombined,
  ChevronDown,
  Compass,
  GraduationCap,
  LayoutDashboard,
  Layers3,
  ListChecks,
  Menu,
  Search,
  Settings2,
  Sparkles,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { copy } from '@/lib/i18n';
import { getTrack, tracks } from '@/lib/tracks';
import type { Locale } from '@/lib/types';
import { useProgress } from './providers';
import { ThemeToggle } from './theme-toggle';

export function AppShell({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  const path = usePathname();
  const t = copy[locale];
  const { progress, update, error } = useProgress();
  const [menu, setMenu] = useState(false);
  const [trackMenu, setTrackMenu] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenu(false);
        setTrackMenu(false);
      }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);
  const track = getTrack(progress.activeTrack);
  const items = [
    ['', t.dashboard, LayoutDashboard],
    ['roadmap', t.roadmap, Compass],
    ['lessons', t.lessons, BookOpen],
    ['practice', t.practice, GraduationCap],
    ['competencies', t.competencies, ListChecks],
    ['glossary', t.glossary, Layers3],
  ] as const;
  const alternate = path.replace(/^\/(az|en)(?=\/|$)/, locale === 'az' ? '/en' : '/az');
  return (
    <div className="app-shell">
      {menu && (
        <button
          className="sidebar-backdrop"
          aria-label={locale === 'az' ? 'Menyunu bağla' : 'Close navigation'}
          onClick={() => setMenu(false)}
        />
      )}
      <aside className={`sidebar ${menu ? 'sidebar-open' : ''}`}>
        <button
          type="button"
          className="icon-button sidebar-close"
          aria-label={locale === 'az' ? 'Menyunu bağla' : 'Close navigation'}
          onClick={() => setMenu(false)}
        >
          <X size={18} />
        </button>
        <Link href={`/${locale}`} className="brand" aria-label="levelup. — Home">
          <span className="brand-mark">
            <ChartNoAxesCombined size={23} strokeWidth={2.5} />
          </span>
          <span>
            level<span className="brand-accent">up</span>
            <span className="brand-dot">.</span>
          </span>
        </Link>
        <p className="sidebar-tagline">
          {locale === 'az'
            ? 'Növbəti səviyyən buradan başlayır.'
            : 'Your next chapter starts here.'}
        </p>
        <div className="track-switcher">
          <button
            type="button"
            className="track-trigger"
            onClick={() => setTrackMenu((v) => !v)}
            aria-expanded={trackMenu}
          >
            <span className="track-mini-icon">
              <BriefcaseIcon />
            </span>
            <span>
              <small>{locale === 'az' ? 'AKTİV İSTİQAMƏT' : 'CURRENT TRACK'}</small>
              <strong>{track.name[locale]}</strong>
            </span>
            <ChevronDown size={15} />
          </button>
          {trackMenu && (
            <div className="track-options">
              {tracks.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    update((p) => ({ ...p, activeTrack: item.id }));
                    setTrackMenu(false);
                  }}
                  aria-pressed={item.id === track.id}
                >
                  {item.name[locale]}
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="nav-label">{t.learning}</p>
        <nav aria-label={locale === 'az' ? 'Əsas naviqasiya' : 'Main navigation'}>
          {items.map(([href, label, Icon]) => {
            const url = `/${locale}${href ? '/' + href : ''}`;
            const active = href ? path.startsWith(url) : path === url;
            return (
              <Link
                key={href}
                href={url}
                aria-current={active ? 'page' : undefined}
                className={`nav-item ${active ? 'active' : ''}`}
                onClick={() => setMenu(false)}
              >
                <Icon size={19} />
                <span>{label}</span>
                {active && <span className="active-dot" />}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <Sparkles size={20} />
            <strong>
              {locale === 'az' ? 'Kiçik addım. Böyük fərq.' : 'Small steps. Big possibilities.'}
            </strong>
            <p>
              {locale === 'az'
                ? 'Hər gün bir az öyrən. Gələcəyinə bir addım yaxınlaş.'
                : 'A little learning each day brings your next role closer.'}
            </p>
            <Link href={`/${locale}/onboarding`}>
              {locale === 'az' ? 'Planını fərdiləşdir' : 'Make it your own'}
              <ArrowUpRight size={15} />
            </Link>
          </div>
          <Link href={`/${locale}/settings`} className="nav-item" onClick={() => setMenu(false)}>
            <Settings2 size={18} />
            {t.settings}
          </Link>
          <div className="sidebar-footer">
            <span className="user-avatar">S</span>
            <span>
              <strong>{locale === 'az' ? 'Sənin öyrənmə məkanın' : 'Your learning space'}</strong>
              <small>{locale === 'az' ? 'Öz tempinlə irəli' : 'Progress at your own pace'}</small>
            </span>
          </div>
        </div>
      </aside>
      <div className="main-column">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-menu"
              onClick={() => setMenu((v) => !v)}
              aria-label={locale === 'az' ? 'Menyu' : 'Open navigation'}
            >
              {menu ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className="breadcrumb">
              {locale === 'az' ? 'Şəxsi inkişaf' : 'Personal growth'}
              <span>/</span>
              <strong>
                {items.find(([href]) =>
                  href ? path.startsWith(`/${locale}/${href}`) : path === `/${locale}`,
                )?.[1] ?? 'Level Up'}
              </strong>
            </span>
          </div>
          <div className="topbar-actions">
            <Link href={`/${locale}/lessons`} className="search-shortcut">
              <Search size={17} />
              <span>{locale === 'az' ? 'Öyrənməyə başla…' : 'Find your next lesson…'}</span>
              <kbd>⌕</kbd>
            </Link>
            <Link
              className="locale-toggle"
              href={alternate}
              hrefLang={locale === 'az' ? 'en' : 'az'}
              aria-label={locale === 'az' ? 'AZ — Switch to English' : 'EN — Azərbaycan dilinə keç'}
            >
              {locale.toUpperCase()}
              <ChevronDown size={12} />
            </Link>
            <ThemeToggle locale={locale} />
            <span className="topbar-divider" />
            <span className="user-avatar small">S</span>
          </div>
        </header>
        {error && (
          <div className="storage-warning" role="alert">
            {locale === 'az'
              ? 'Brauzer yaddaşı əlçatan deyil. Dəyişikliklər bu sessiyada saxlanır; Tənzimləmələr bölməsindən ixrac et.'
              : 'Browser storage is unavailable or contains invalid data. Changes stay in this session; export a backup in Settings.'}
          </div>
        )}
        <main id="main-content" className="main-content">
          {children}
        </main>
        <footer className="app-footer">
          <span>© {new Date().getFullYear()} Level Up</span>
          <span>
            {locale === 'az'
              ? 'Maraqdan bacarığa. Addım-addım.'
              : 'From curiosity to capability. One step at a time.'}
          </span>
          <span className="footer-status">
            <span />
            {locale === 'az'
              ? 'İrəliləyişin bu brauzerdədir'
              : 'Your progress stays in this browser'}
          </span>
        </footer>
      </div>
    </div>
  );
}
function BriefcaseIcon() {
  return <BookOpen size={18} />;
}
