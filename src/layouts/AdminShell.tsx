import { useState, ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ListOrdered,
  MapPin,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

type Language = 'FR' | 'EN' | 'RN' | 'SW';

interface AdminShellProps {
  children: ReactNode;
  orgName?: string;
  headerExtra?: ReactNode;
}

// ── Nav items ────────────────────────────────────────────────────────────────

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, labelFR: 'Aperçu',         labelEN: 'Overview',   labelRN: 'Incamake',   labelSW: 'Muhtasari' },
  { to: '/queue',     icon: ListOrdered,    labelFR: 'Files d\'attente', labelEN: 'Queues',     labelRN: 'Imirongo',   labelSW: 'Foleni' },
  { to: '/locations', icon: MapPin,         labelFR: 'Agences',          labelEN: 'Locations',  labelRN: 'Amashami',   labelSW: 'Matawi' },
  { to: '/agents',    icon: Users,          labelFR: 'Agents',           labelEN: 'Agents',     labelRN: 'Abakozi',    labelSW: 'Mawakala' },
  { to: '/analytics', icon: BarChart3,      labelFR: 'Statistiques',     labelEN: 'Analytics',  labelRN: 'Imibare',    labelSW: 'Takwimu' },
  { to: '/settings',  icon: Settings,       labelFR: 'Paramètres',       labelEN: 'Settings',   labelRN: 'Igenamiterere', labelSW: 'Mipangilio' },
];

const langLabel: Record<Language, Record<string, string>> = {
  FR: Object.fromEntries(navItems.map((n) => [n.to, n.labelFR])),
  EN: Object.fromEntries(navItems.map((n) => [n.to, n.labelEN])),
  RN: Object.fromEntries(navItems.map((n) => [n.to, n.labelRN])),
  SW: Object.fromEntries(navItems.map((n) => [n.to, n.labelSW])),
};

const LANGS: Language[] = ['FR', 'EN', 'RN', 'SW'];
const langFlags: Record<Language, string> = { FR: '🇫🇷', EN: '🇬🇧', RN: '🇧🇮', SW: '🇹🇿' };

// ── Shell ────────────────────────────────────────────────────────────────────

export default function AdminShell({ children, orgName = 'Banque de la République — Agence Centrale', headerExtra }: AdminShellProps) {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Language>('FR');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const handleLogout = () => navigate('/login');

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#0A0E1A', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ══════════════════════════════════════════
          SIDEBAR
      ══════════════════════════════════════════ */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 flex flex-col w-60 transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          backgroundColor: '#0A0E1A',
          borderRight: '1px solid #334155',
          minHeight: '100vh',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid #1e293b' }}>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: '#6C47FF' }}
          >
            <svg width="18" height="18" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path d="M11 2L20 7V15L11 20L2 15V7L11 2Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
              <path d="M11 2V20M2 7L20 15M20 7L2 15" stroke="white" strokeWidth="1.5" strokeOpacity="0.35" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-widest" style={{ color: '#ffffff' }}>TONDE</span>

          {/* Close on mobile */}
          <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Fermer le menu">
            <X size={18} color="#64748b" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="flex flex-col gap-1">
            {navItems.map(({ to, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                  style={({ isActive }) => isActive ? { backgroundColor: '#6C47FF', color: '#ffffff' } : {}}
                >
                  <Icon size={17} strokeWidth={1.75} />
                  <span>{langLabel[lang][to]}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="px-3 pb-5" style={{ borderTop: '1px solid #1e293b', paddingTop: '16px' }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
            style={{ color: '#64748b' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#F43F5E'; e.currentTarget.style.backgroundColor = 'rgba(244,63,94,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <LogOut size={17} strokeWidth={1.75} />
            <span>{lang === 'FR' ? 'Déconnexion' : lang === 'EN' ? 'Sign out' : lang === 'RN' ? 'Gusohoka' : 'Toka'}</span>
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════
          MAIN COLUMN
      ══════════════════════════════════════════ */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* ── HEADER ── */}
        <header
          className="flex items-center gap-4 px-5 shrink-0"
          style={{
            height: '60px',
            backgroundColor: '#0F1628',
            borderBottom: '1px solid #334155',
          }}
        >
          {/* Mobile burger */}
          <button className="lg:hidden shrink-0" onClick={() => setSidebarOpen(true)} aria-label="Ouvrir le menu">
            <Menu size={20} color="#94a3b8" />
          </button>

          {/* Org name */}
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="truncate text-sm font-medium"
              style={{ color: '#94a3b8' }}
              title={orgName}
            >
              {orgName}
            </span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Extra slot (WS status, notifications) */}
          {headerExtra && <div className="flex items-center gap-3">{headerExtra}</div>}

          {/* WebSocket LIVE badge */}
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-full shrink-0"
            style={{ backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                display: 'inline-block',
                animation: 'pulse-live 2s ease-in-out infinite',
              }}
              aria-hidden="true"
            />
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#10B981', letterSpacing: '0.05em' }}>LIVE</span>
          </div>

          {/* Lang selector */}
          <div className="relative shrink-0">
            <button
              onClick={() => { setLangOpen(!langOpen); setProfileOpen(false); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
              style={{ backgroundColor: '#1A2235', border: '1px solid #334155', color: '#94a3b8' }}
              aria-haspopup="true"
              aria-expanded={langOpen}
            >
              <span aria-hidden="true">{langFlags[lang]}</span>
              <span>{lang}</span>
              <ChevronDown size={12} />
            </button>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                <div
                  className="absolute right-0 top-full mt-1 rounded-lg overflow-hidden z-20"
                  style={{ backgroundColor: '#1A2235', border: '1px solid #334155', minWidth: '90px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
                >
                  {LANGS.map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setLangOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium transition-colors duration-100"
                      style={{ color: l === lang ? '#6C47FF' : '#94a3b8', backgroundColor: l === lang ? 'rgba(108,71,255,0.1)' : 'transparent' }}
                      onMouseEnter={(e) => { if (l !== lang) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                      onMouseLeave={(e) => { if (l !== lang) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <span>{langFlags[l]}</span>
                      <span>{l}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Profile */}
          <div className="relative shrink-0">
            <button
              onClick={() => { setProfileOpen(!profileOpen); setLangOpen(false); }}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-all duration-150"
              style={{ border: '1px solid transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#334155'; }}
              onMouseLeave={(e) => { if (!profileOpen) e.currentTarget.style.borderColor = 'transparent'; }}
              aria-haspopup="true"
              aria-expanded={profileOpen}
            >
              {/* Avatar */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: '#6C47FF', color: '#ffffff' }}
                aria-hidden="true"
              >
                A
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#e2e8f0', lineHeight: 1.2 }}>Admin</span>
                <span style={{ fontSize: '10px', color: '#64748b', lineHeight: 1.2 }}>Super Admin</span>
              </div>
              <ChevronDown size={12} color="#64748b" />
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                <div
                  className="absolute right-0 top-full mt-1 rounded-lg overflow-hidden z-20"
                  style={{ backgroundColor: '#1A2235', border: '1px solid #334155', minWidth: '180px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
                >
                  <div className="px-4 py-3" style={{ borderBottom: '1px solid #334155' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>Administrateur</p>
                    <p style={{ fontSize: '11px', color: '#64748b' }}>admin@tonde.app</p>
                  </div>
                  <div className="py-1">
                    <NavLink
                      to="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-100"
                      style={{ color: '#94a3b8' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                    >
                      <Settings size={14} />
                      <span>{lang === 'FR' ? 'Paramètres' : lang === 'EN' ? 'Settings' : lang === 'RN' ? 'Igenamiterere' : 'Mipangilio'}</span>
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm transition-colors duration-100"
                      style={{ color: '#F43F5E' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(244,63,94,0.08)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <LogOut size={14} />
                      <span>{lang === 'FR' ? 'Déconnexion' : lang === 'EN' ? 'Sign out' : lang === 'RN' ? 'Gusohoka' : 'Toka'}</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ backgroundColor: '#0A0E1A' }}
        >
          {children}
        </main>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes pulse-live {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}
