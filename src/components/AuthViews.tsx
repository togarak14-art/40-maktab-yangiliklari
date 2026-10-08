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
  showToast,
}) => {
  const [adminLoading, setAdminLoading] = useState(false);
  const [viewerLoading, setViewerLoading] = useState(false);

  const handleDirectAdminLogin = async () => {
    setAdminLoading(true);
    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok && data.token) {
        onAdminLoginSuccess(data.token, data.identifier);
      } else {
        showToast('Xatolik yuz berdi. Qaytadan urinib ko‘ring.', 'error');
      }
    } catch {
      showToast('Xatolik yuz berdi. Qaytadan urinib ko‘ring.', 'error');
    } finally {
      setAdminLoading(false);
    }
  };

  const handleDirectViewerLogin = async () => {
    setViewerLoading(true);
    try {
      const res = await fetch('/api/auth/viewer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok && data.token) {
        onViewerLoginSuccess(data.token, data.identifier);
      } else {
        showToast('Xatolik yuz berdi. Qaytadan urinib ko‘ring.', 'error');
      }
    } catch {
      showToast('Xatolik yuz berdi. Qaytadan urinib ko‘ring.', 'error');
    } finally {
      setViewerLoading(false);
    }
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
        {/* 1. ADMIN */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#1E3A8A] flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-serif">
              ADMIN
            </h2>
            <p className="mt-2 text-slate-600 text-base">
              Yangiliklarni boshqarish
            </p>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              Maktab ma’muriyati uchun boshqaruv bo‘limi: yangi maqolalar, rasmiy e’lonlar, foto va video lavhalarni joylashtirish hamda tahrirlash.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <button
              type="button"
              disabled={adminLoading}
              onClick={handleDirectAdminLogin}
              className="w-full py-3 px-5 bg-[#1E3A8A] hover:bg-blue-900 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              {adminLoading ? 'Ochilmoqda...' : 'Admin sifatida kirish'}
            </button>
          </div>
        </div>

        {/* 2. KO‘RUVCHI */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-serif">
              KO‘RUVCHI
            </h2>
            <p className="mt-2 text-slate-600 text-base">
              Maktab yangiliklarini ko‘rish
            </p>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              O‘quvchilar, ota-onalar va mehmonlar uchun maktab yangiliklari, tadbirlar va e’lonlarni ko‘rish bo‘limi.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
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
