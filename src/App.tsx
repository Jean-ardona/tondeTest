import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import './css/style.css';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Queue from './pages/Queue';

// Placeholder pages pour les routes à venir
import AdminShell from './layouts/AdminShell';

function Placeholder({ title }: { title: string }) {
  return (
    <AdminShell>
      <div className="p-8">
        <div
          className="flex items-center justify-center h-64 rounded-xl"
          style={{ backgroundColor: '#1A2235', border: '1px dashed #334155' }}
        >
          <p style={{ fontSize: '16px', color: '#475569', fontFamily: 'Inter, sans-serif' }}>
            {title} — page en construction
          </p>
        </div>
      </div>
    </AdminShell>
  );
}

function App() {
  const location = useLocation();

  useEffect(() => {
    const html = document.querySelector('html');
    if (html) html.style.scrollBehavior = 'auto';
    window.scroll({ top: 0 });
    if (html) html.style.scrollBehavior = '';
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/login"     element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/queue"     element={<Queue />} />
      <Route path="/locations" element={<Placeholder title="Agences / Lieux" />} />
      <Route path="/agents"    element={<Placeholder title="Agents" />} />
      <Route path="/analytics" element={<Placeholder title="Statistiques" />} />
      <Route path="/settings"  element={<Placeholder title="Paramètres" />} />
      <Route path="/"          element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
