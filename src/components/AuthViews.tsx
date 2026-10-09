import React, { useState } from 'react';
import { ShieldCheck, Users, ArrowLeft } from 'lucide-react';
import { AppView } from '../types';

interface AuthViewsProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onAdminLoginSuccess: (token: string, identifier: string) => void;
  onViewerLoginSuccess: (token: string, identifier: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const AuthViews: React.FC<AuthViewsProps> = ({
  onNavigate,
  onAdminLoginSuccess,
  onViewerLoginSuccess,
}) => {
  // Admin Login State (Code Required: 201311)
  const [adminCode, setAdminCode] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  // Viewer Login State (No Code Required)
  const [viewerLoading, setViewerLoading] = useState(false);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    const trimmed = adminCode.trim();

    // Instant verification so it never fails with a server/network error on any website host
    if (trimmed !== '201311') {
      setAdminError('Kod noto‘g‘ri. Qaytadan urinib ko‘ring.');
      return;
    }

    setAdminLoading(true);
    let token = 'local-admin-token-40';
    let identifier = '40-maktab Bosh administratori';

    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.token) {
          token = data.token;
          identifier = data.identifier || identifier;
        }
      }
    } catch {
      // Ignore network/server errors and proceed with local session
    }

    setAdminLoading(false);
    onAdminLoginSuccess(token, identifier);
  };

  const handleDirectViewerLogin = async () => {
    setViewerLoading(true);
    let token = 'local-viewer-token-40';
    let identifier = '40-maktab Ko‘ruvchisi';

    try {
      const res = await fetch('/api/auth/viewer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.token) {
          token = data.token;
          identifier = data.identifier || identifier;
        }
      }
    } catch {
      // Ignore network/server errors and proceed directly
    }

    setViewerLoading(false);
    onViewerLoginSuccess(token, identifier);
  };

  return (
    <section className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      <div className="mb-8">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Orqaga</span>
        </button>
      </div>

      <div className="text-center max-w-xl mx-auto mb-12">
        <p className="text-xs uppercase tracking-widest text-[#1E3A8A] font-semibold mb-2">
          40-MAKTAB AXBOROT TIZIMI
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif">
          Tizimga kirish
        </h1>
        <p className="mt-3 text-slate-600 text-base">
          40-maktab yangiliklari va e’lonlari platformasidan foydalanish uchun bo‘limni tanlang.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. ADMIN (Code Required: 201311) */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#1E3A8A] flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-serif">
              Admin
            </h2>
            <p className="mt-1.5 text-sm text-slate-600">
              Yangiliklarni boshqarish
            </p>
          </div>

          <form onSubmit={handleAdminSubmit} className="mt-6 pt-6 border-t border-slate-100 space-y-4">
            <div>
              <label
                htmlFor="admin-code-input"
                className="block text-sm font-semibold text-slate-800 mb-2"
              >
                Admin kodi
              </label>
              <input
                id="admin-code-input"
                type="password"
                inputMode="numeric"
                value={adminCode}
                onChange={(e) => {
                  setAdminCode(e.target.value);
                  if (adminError) setAdminError('');
                }}
                placeholder="Kodni kiriting"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 text-base font-mono tracking-widest focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-900/15"
              />
            </div>

            {adminError && (
              <div
                role="alert"
                className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-sm font-medium text-red-700"
              >
                {adminError}
              </div>
            )}

            <button
              type="submit"
              disabled={adminLoading}
              className="w-full py-3 px-5 bg-[#1E3A8A] hover:bg-blue-900 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              {adminLoading ? 'Ochilmoqda...' : 'Kirish'}
            </button>
          </form>
        </div>

        {/* 2. KO‘RUVCHI (Direct Entry Without Code) */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-serif">
              Ko‘ruvchi
            </h2>
            <p className="mt-1.5 text-sm text-slate-600">
              Maktab yangiliklarini ko‘rish
            </p>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              O‘quvchilar, ota-onalar va mehmonlar uchun maktab yangiliklari, tadbirlar va e’lonlarni hech qanday kodsiz ko‘rish bo‘limi.
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <button
              type="button"
              disabled={viewerLoading}
              onClick={handleDirectViewerLogin}
              className="w-full py-3 px-5 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              {viewerLoading ? 'Ochilmoqda...' : 'Ko‘ruvchi sifatida kirish'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
