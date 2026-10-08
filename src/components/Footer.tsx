import React from 'react';
import { AppView, SchoolSettings } from '../types';

interface FooterProps {
  settings: SchoolSettings;
  onNavigate: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  return (
    <footer className="bg-[#0F172A] text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white font-serif tracking-tight">
              {settings.schoolName || '40-MAKTAB'}
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-sm">
              {settings.subtitle || '40-maktab yangiliklari va e’lonlari'} — o‘quvchilar, ota-onalar va ustozlar uchun rasmiy axborot portali.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide mb-3">
              Sahifalar
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Biz haqimizda
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Bog‘lanish
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('viewer_home')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Yangiliklar
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide mb-3">
              Bog‘lanish ma’lumotlari
            </h4>
            <div className="space-y-1.5 text-sm text-slate-400">
              <p>{settings.address}</p>
              <p className="tabular-nums">{settings.phone}</p>
              <p>{settings.email}</p>
              <p className="text-xs text-slate-500 pt-1">{settings.workingHours}</p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">© 40-MAKTAB</span>
            <span aria-hidden="true">·</span>
            <span>Barcha huquqlar himoyalangan.</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Biz haqimizda
            </button>
            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Bog‘lanish
            </button>
            <button
              type="button"
              onClick={() => onNavigate('viewer_home')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Yangiliklar
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
