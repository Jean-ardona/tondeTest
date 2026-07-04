import { useState, useEffect, type ReactNode } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import {
  Bell, AlertTriangle, Clock, Users, TrendingDown,
  BarChart2, Wifi, ChevronRight, Pause, Circle,
} from 'lucide-react';
import AdminShell from '../layouts/AdminShell';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const affluenceData = [
  { h: '07h', tickets: 12, avg7j: 10 }, { h: '08h', tickets: 34, avg7j: 29 },
  { h: '09h', tickets: 61, avg7j: 55 }, { h: '10h', tickets: 89, avg7j: 82 },
  { h: '11h', tickets: 74, avg7j: 70 }, { h: '12h', tickets: 48, avg7j: 51 },
  { h: '13h', tickets: 39, avg7j: 42 }, { h: '14h', tickets: 93, avg7j: 85 },
  { h: '15h', tickets: 81, avg7j: 79 }, { h: '16h', tickets: 67, avg7j: 63 },
  { h: '17h', tickets: 44, avg7j: 48 }, { h: '18h', tickets: 21, avg7j: 25 },
];

type AgencyStatus = 'ok' | 'warn' | 'critical';

const agencies: { id: string; name: string; lat: number; lng: number; wait: number; guichets: number; topService: string; status: AgencyStatus }[] = [
  { id: 'AG-BUJ-01', name: 'Agence Centrale — Bujumbura', lat: -3.3822, lng: 29.3622, wait: 7,  guichets: 6, topService: 'Ouverture de compte', status: 'ok' },
  { id: 'AG-BUJ-02', name: 'Agence Rohero',               lat: -3.3701, lng: 29.3594, wait: 18, guichets: 4, topService: 'Retrait caisse',        status: 'warn' },
  { id: 'AG-BUJ-03', name: 'Agence Buyenzi',              lat: -3.3950, lng: 29.3550, wait: 34, guichets: 3, topService: 'Virement bancaire',     status: 'critical' },
  { id: 'AG-GOM-01', name: 'Agence Goma Nord',             lat: -1.6590, lng: 29.2200, wait: 12, guichets: 5, topService: 'Renseignements',        status: 'warn' },
  { id: 'AG-KGL-01', name: 'Agence Kigali Centre',         lat: -1.9441, lng: 30.0619, wait: 5,  guichets: 8, topService: 'Prêts',                 status: 'ok' },
];

type Priority = 'standard' | 'priority' | 'urgent' | 'vip';
type AgentStatus = 'online' | 'pause' | 'offline';

const agentsData: { id: string; name: string; service: string; status: AgentStatus; tickets: number; guichet: string }[] = [
  { id: 'AGT-01', name: 'Isabelle M.',    service: 'Ouverture de compte', status: 'online',  tickets: 14, guichet: 'G-01' },
  { id: 'AGT-02', name: 'Rodrigue K.',    service: 'Retrait caisse',      status: 'online',  tickets: 11, guichet: 'G-02' },
  { id: 'AGT-03', name: 'Chantal N.',     service: 'Renseignements',      status: 'pause',   tickets: 9,  guichet: 'G-03' },
  { id: 'AGT-04', name: 'Eric B.',        service: 'Virements',           status: 'offline', tickets: 0,  guichet: 'G-04' },
  { id: 'AGT-05', name: 'Diane U.',       service: 'Prêts',               status: 'online',  tickets: 16, guichet: 'G-05' },
  { id: 'AGT-06', name: 'Patrick N.',     service: 'Retrait caisse',      status: 'online',  tickets: 12, guichet: 'G-06' },
  { id: 'AGT-07', name: 'Marie K.',       service: 'Ouverture de compte', status: 'pause',   tickets: 7,  guichet: 'G-07' },
  { id: 'AGT-08', name: 'Jean-Claude M.', service: 'VIP',                 status: 'online',  tickets: 8,  guichet: 'G-08' },
];

const alerts = [
  { id: 1, level: 'critical', msg: "Guichet G-04 inactif depuis plus de 8 minutes",           time: 'il y a 3 min' },
  { id: 2, level: 'critical', msg: "File 'Retrait' saturée : Temps d'attente > 45 minutes",   time: 'il y a 7 min' },
  { id: 3, level: 'warning',  msg: "Note de satisfaction < 2/5 sur 3 dernières interactions", time: 'il y a 12 min' },
  { id: 4, level: 'warning',  msg: "Agence Buyenzi — taux d'abandon à 22 %",                  time: 'il y a 18 min' },
  { id: 5, level: 'info',     msg: "3 tickets VIP en attente sans agent assigné",              time: 'il y a 21 min' },
];

const ticketsQueue: { id: string; name: string; service: string; wait: string; priority: Priority }[] = [
  { id: 'T-047', name: 'Marie Nkurunziza',    service: 'Ouverture de compte', wait: '12:04', priority: 'vip' },
  { id: 'T-048', name: 'Jean-Pierre Habimana',service: 'Retrait caisse',      wait: '08:32', priority: 'urgent' },
  { id: 'T-049', name: 'Aline Mukamana',      service: 'Renseignements',      wait: '05:10', priority: 'priority' },
  { id: 'T-050', name: 'Eric Bizimana',       service: "Dépôt d'espèces",    wait: '03:45', priority: 'standard' },
  { id: 'T-051', name: 'Diane Uwera',         service: 'Virement bancaire',   wait: '02:20', priority: 'standard' },
];

// ─────────────────────────────────────────────────────────────────────────────
// STYLE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const priorityConfig: Record<Priority, { label: string; color: string; bg: string }> = {
  standard: { label: 'Standard',    color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  priority: { label: 'Prioritaire', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  urgent:   { label: 'Urgence',     color: '#F43F5E', bg: 'rgba(244,63,94,0.12)' },
  vip:      { label: 'VIP',         color: '#06B6D4', bg: 'rgba(6,182,212,0.12)' },
};

const agentStatusConfig: Record<AgentStatus, { label: string; color: string; bg: string }> = {
  online:  { label: 'En ligne',     color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
  pause:   { label: 'En pause',     color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
  offline: { label: 'Déconnecté',   color: '#F43F5E', bg: 'rgba(244,63,94,0.15)' },
};

const mapStatusColor: Record<AgencyStatus, string> = {
  ok:       '#10B981',
  warn:     '#F59E0B',
  critical: '#F43F5E',
};

const alertColor: Record<string, string> = {
  critical: '#F43F5E',
  warning:  '#F59E0B',
  info:     '#06B6D4',
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function Card({ children, className = '', style = {} }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={{ backgroundColor: '#1A2235', borderRadius: '12px', border: '1px solid #334155', ...style }}>
      {children}
    </div>
  );
}

function Widget({ children, style = {} }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ backgroundColor: '#0F1623', borderRadius: '8px', ...style }}>
      {children}
    </div>
  );
}

function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #334155' }}>
      <h2 className="font-semibold" style={{ fontSize: '14px', color: '#e2e8f0' }}>{title}</h2>
      {action}
    </div>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const cfg = priorityConfig[priority];
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
      {cfg.label}
    </span>
  );
}

// Custom recharts tooltip
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: '#1A2235', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>
      <p style={{ color: '#64748b', marginBottom: '6px' }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color, fontWeight: 600 }}>{p.name} : <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{p.value}</span></p>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LIVE COUNTERS
// ─────────────────────────────────────────────────────────────────────────────

function LiveCounters() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(id);
  }, []);

  const waitingCount = 142 + (tick % 3) - 1;
  const abandonRate  = 17.4;
  const tmt          = '12m 34s';
  const productivity = 4.2;

  const kpis = [
    {
      label: 'Tickets en attente',
      value: String(waitingCount),
      icon: Users,
      color: '#6C47FF',
      bg: 'rgba(108,71,255,0.12)',
      mono: true,
      sub: '+3 depuis 5 min',
      subColor: '#F59E0B',
    },
    {
      label: 'Temps moyen de traitement',
      value: tmt,
      icon: Clock,
      color: '#10B981',
      bg: 'rgba(16,185,129,0.12)',
      mono: true,
      sub: '-1m vs hier',
      subColor: '#10B981',
    },
    {
      label: "Taux d'abandon (No-show)",
      value: `${abandonRate} %`,
      icon: TrendingDown,
      color: abandonRate > 15 ? '#F43F5E' : '#10B981',
      bg: abandonRate > 15 ? 'rgba(244,63,94,0.12)' : 'rgba(16,185,129,0.12)',
      mono: false,
      sub: abandonRate > 15 ? '⚠ Seuil dépassé (> 15 %)' : 'Dans les normes',
      subColor: abandonRate > 15 ? '#F43F5E' : '#10B981',
    },
    {
      label: 'Productivité horaire',
      value: `${productivity}`,
      icon: BarChart2,
      color: '#06B6D4',
      bg: 'rgba(6,182,212,0.12)',
      mono: true,
      sub: 'tickets / agent / h',
      subColor: '#64748b',
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {kpis.map((k) => {
        const Icon = k.icon;
        return (
          <Widget key={k.label} style={{ padding: '20px' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: k.bg }}>
                <Icon size={18} color={k.color} strokeWidth={1.75} />
              </div>
              <span style={{ fontSize: '10px', fontWeight: 600, color: k.subColor, textAlign: 'right', maxWidth: '110px', lineHeight: 1.3 }}>
                {k.sub}
              </span>
            </div>
            <p
              className="font-bold"
              style={{
                fontSize: '26px',
                color: k.color,
                lineHeight: 1,
                marginBottom: '6px',
                fontFamily: k.mono ? 'JetBrains Mono, monospace' : 'Inter, sans-serif',
              }}
            >
              {k.value}
            </p>
            <p style={{ fontSize: '12px', color: '#64748b' }}>{k.label}</p>
          </Widget>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAP
// ─────────────────────────────────────────────────────────────────────────────

function AgencyMap() {
  return (
    <Card>
      <SectionHeader title="Carte de santé des agences" />
      <div style={{ height: '320px', borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
        <MapContainer
          center={[-2.5, 29.5]}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap &copy; CARTO'
          />
          {agencies.map((ag) => (
            <CircleMarker
              key={ag.id}
              center={[ag.lat, ag.lng]}
              radius={ag.wait > 30 ? 14 : ag.wait > 10 ? 11 : 9}
              pathOptions={{
                color: mapStatusColor[ag.status],
                fillColor: mapStatusColor[ag.status],
                fillOpacity: 0.85,
                weight: 2,
              }}
            >
              <LeafletTooltip permanent={false} direction="top">
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', lineHeight: 1.5 }}>
                  <p style={{ fontWeight: 700, marginBottom: '2px' }}>{ag.name}</p>
                  <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#64748b' }}>{ag.id}</p>
                  <p>⏱ Attente : <strong>{ag.wait} min</strong></p>
                  <p>🪟 Guichets ouverts : <strong>{ag.guichets}</strong></p>
                  <p>🔥 Service surchargé : <strong>{ag.topService}</strong></p>
                </div>
              </LeafletTooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 py-3" style={{ borderTop: '1px solid #334155' }}>
        {[
          { color: '#10B981', label: '< 10 min' },
          { color: '#F59E0B', label: '10 – 30 min' },
          { color: '#F43F5E', label: '> 30 min (alerte)' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-2">
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: l.color, display: 'inline-block' }} />
            <span style={{ fontSize: '11px', color: '#64748b' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AFFLUENCE CHART
// ─────────────────────────────────────────────────────────────────────────────

function AffluenceChart() {
  return (
    <Card>
      <SectionHeader
        title="Courbe d'affluence — aujourd'hui vs moy. 7 jours"
        action={
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span style={{ width: '10px', height: '2px', backgroundColor: '#6C47FF', display: 'inline-block', borderRadius: '1px' }} />
              <span style={{ fontSize: '11px', color: '#64748b' }}>Aujourd'hui</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span style={{ width: '10px', height: '2px', backgroundColor: '#334155', display: 'inline-block', borderRadius: '1px', borderTop: '1px dashed #334155' }} />
              <span style={{ fontSize: '11px', color: '#64748b' }}>Moy. 7j</span>
            </div>
          </div>
        }
      />
      <div style={{ padding: '16px 8px 8px' }}>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={affluenceData} margin={{ top: 5, right: 16, bottom: 0, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="h" tick={{ fontSize: 11, fill: '#475569', fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#475569', fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} />
            <RechartsTooltip content={<ChartTooltip />} />
            <ReferenceLine x="10h" stroke="#6C47FF" strokeDasharray="4 4" strokeOpacity={0.4} label={{ value: 'Pic matin', fill: '#6C47FF', fontSize: 10, dy: -6 }} />
            <ReferenceLine x="14h" stroke="#F59E0B" strokeDasharray="4 4" strokeOpacity={0.4} label={{ value: 'Pic après-midi', fill: '#F59E0B', fontSize: 10, dy: -6 }} />
            <Line type="monotone" dataKey="tickets" name="Aujourd'hui" stroke="#6C47FF" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#6C47FF' }} />
            <Line type="monotone" dataKey="avg7j" name="Moy. 7 jours" stroke="#334155" strokeWidth={1.5} strokeDasharray="5 3" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ALERTS
// ─────────────────────────────────────────────────────────────────────────────

function AlertsPanel({ onCountChange }: { onCountChange?: (n: number) => void }) {
  const [dismissed, setDismissed] = useState<number[]>([]);
  const visible = alerts.filter((a) => !dismissed.includes(a.id));

  useEffect(() => { onCountChange?.(visible.filter((a) => a.level === 'critical').length); }, [visible, onCountChange]);

  return (
    <Card>
      <SectionHeader
        title="Alertes & Anomalies"
        action={
          visible.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: 'rgba(244,63,94,0.15)', color: '#F43F5E' }}>
              {visible.length}
            </span>
          )
        }
      />
      <div className="p-4 space-y-2">
        {visible.length === 0 && (
          <Widget style={{ padding: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: '#475569' }}>✓ Aucune alerte active</p>
          </Widget>
        )}
        {visible.map((alert) => (
          <Widget key={alert.id} style={{ padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <AlertTriangle size={15} color={alertColor[alert.level]} style={{ marginTop: '1px', flexShrink: 0 }} />
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.4 }}>{alert.msg}</p>
              <p style={{ fontSize: '11px', color: '#475569', marginTop: '3px' }}>{alert.time}</p>
            </div>
            <button
              onClick={() => setDismissed((d) => [...d, alert.id])}
              aria-label="Ignorer l'alerte"
              style={{ fontSize: '16px', color: '#475569', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1, flexShrink: 0 }}
            >
              ×
            </button>
          </Widget>
        ))}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AGENTS
// ─────────────────────────────────────────────────────────────────────────────

function AgentsPanel() {
  return (
    <Card>
      <SectionHeader title="État des guichets & agents" />
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {agentsData.map((agent) => {
          const cfg = agentStatusConfig[agent.status];
          return (
            <Widget key={agent.id} style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Status icon */}
              {agent.status === 'online'  && <Circle  size={9} fill="#10B981" color="#10B981" style={{ flexShrink: 0 }} />}
              {agent.status === 'pause'   && <Pause   size={12} color="#F59E0B" style={{ flexShrink: 0 }} />}
              {agent.status === 'offline' && <Circle  size={9} fill="#F43F5E" color="#F43F5E" style={{ flexShrink: 0 }} />}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium truncate" style={{ fontSize: '13px', color: '#e2e8f0' }}>{agent.name}</p>
                  <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: '#475569', flexShrink: 0 }}>{agent.guichet}</span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p className="truncate" style={{ fontSize: '11px', color: '#64748b' }}>{agent.service}</p>
                  <span
                    className="shrink-0 text-xs font-semibold px-1.5 py-0.5 rounded-md"
                    style={{ backgroundColor: cfg.bg, color: cfg.color, fontSize: '10px' }}
                  >
                    {cfg.label}
                  </span>
                </div>
              </div>

              {agent.status !== 'offline' && (
                <div className="shrink-0 text-right">
                  <p className="font-bold" style={{ fontSize: '14px', color: '#6C47FF', fontFamily: 'JetBrains Mono, monospace' }}>{agent.tickets}</p>
                  <p style={{ fontSize: '9px', color: '#475569' }}>tickets</p>
                </div>
              )}
            </Widget>
          );
        })}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// QUEUE TABLE
// ─────────────────────────────────────────────────────────────────────────────

function QueueTable() {
  return (
    <Card>
      <SectionHeader
        title="File d'attente active"
        action={
          <button className="flex items-center gap-1 text-xs font-medium" style={{ color: '#6C47FF' }}>
            Gérer <ChevronRight size={13} />
          </button>
        }
      />
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid #1e293b' }}>
              {['Ticket', 'Client', 'Service', 'Attente', 'Priorité'].map((h) => (
                <th key={h} className="text-left px-5 py-3" style={{ fontSize: '10px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ticketsQueue.map((t, i) => {
              const waitMins = parseInt(t.wait.split(':')[0]);
              return (
                <tr key={t.id} style={{ borderBottom: i < ticketsQueue.length - 1 ? '1px solid #1e293b' : 'none' }}>
                  <td className="px-5 py-3">
                    <span style={{ color: '#6C47FF', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 600 }}>{t.id}</span>
                  </td>
                  <td className="px-5 py-3" style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: 500 }}>{t.name}</td>
                  <td className="px-5 py-3" style={{ fontSize: '13px', color: '#64748b' }}>{t.service}</td>
                  <td className="px-5 py-3">
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: waitMins > 10 ? '#F43F5E' : '#94a3b8', fontWeight: waitMins > 10 ? 600 : 400 }}>
                      {t.wait}
                    </span>
                  </td>
                  <td className="px-5 py-3"><PriorityBadge priority={t.priority} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HEADER EXTENSION (notifications badge)
// ─────────────────────────────────────────────────────────────────────────────

function NotificationsBell({ count }: { count: number }) {
  return (
    <div className="relative">
      <button
        aria-label={`${count} alertes critiques non lues`}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
      >
        <Bell size={18} />
      </button>
      {count > 0 && (
        <span
          className="absolute flex items-center justify-center"
          style={{
            top: '-4px', right: '-4px',
            width: '16px', height: '16px',
            borderRadius: '50%',
            backgroundColor: '#F43F5E',
            fontSize: '9px',
            fontWeight: 700,
            color: '#fff',
            border: '2px solid #0F1628',
          }}
          aria-hidden="true"
        >
          {count}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WEBSOCKET STATUS (affichage dans la page pour démo)
// ─────────────────────────────────────────────────────────────────────────────

function WsStatus() {
  const [connected, setConnected] = useState(true);
  useEffect(() => {
    // Simule une reconnexion après 3s si déconnecté
    if (!connected) {
      const t = setTimeout(() => setConnected(true), 3000);
      return () => clearTimeout(t);
    }
  }, [connected]);

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full"
      style={{
        backgroundColor: connected ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
        border: `1px solid ${connected ? 'rgba(16,185,129,0.25)' : 'rgba(244,63,94,0.25)'}`,
        cursor: 'pointer',
      }}
      onClick={() => connected && setConnected(false)}
      title="Cliquer pour simuler une déconnexion"
    >
      {connected
        ? <><Wifi size={13} color="#10B981" /><span style={{ fontSize: '11px', fontWeight: 700, color: '#10B981', letterSpacing: '0.05em' }}>LIVE</span></>
        : <><Wifi size={13} color="#F43F5E" /><span style={{ fontSize: '11px', fontWeight: 700, color: '#F43F5E', letterSpacing: '0.05em' }}>RECONNEXION...</span></>
      }
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [criticalCount, setCriticalCount] = useState(2);
  const now = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <AdminShell
      orgName="Banque de la République — Siège"
      headerExtra={
        <div className="flex items-center gap-3">
          <WsStatus />
          <NotificationsBell count={criticalCount} />
        </div>
      }
    >
      <div style={{ padding: '24px', fontFamily: 'Inter, sans-serif' }}>

        {/* Page title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-bold" style={{ fontSize: '20px', color: '#f1f5f9' }}>Aperçu — Cockpit de pilotage</h1>
            <p style={{ fontSize: '13px', color: '#475569', marginTop: '2px', textTransform: 'capitalize' }}>{now}</p>
          </div>
        </div>

        {/* Section 1 — Live counters */}
        <LiveCounters />

        {/* Section 2 — Map + Chart */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
          <AgencyMap />
          <AffluenceChart />
        </div>

        {/* Section 3 — Alerts + Queue */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
          <AlertsPanel onCountChange={setCriticalCount} />
          <QueueTable />
        </div>

        {/* Section 4 — Agents */}
        <div className="mt-6">
          <AgentsPanel />
        </div>

      </div>

      <style>{`
        @keyframes pulse-live {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.35; transform: scale(1.4); }
        }
        .leaflet-container { background: #0A0E1A !important; }
      `}</style>
    </AdminShell>
  );
}
