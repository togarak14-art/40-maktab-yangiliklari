import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AppView, NewsCategory } from '../types';

interface NavbarProps {
  currentView: AppView;
  activeCategory: NewsCategory | 'Barchasi';
  userRole: 'admin' | 'viewer' | null;
  onNavigate: (view: AppView, category?: NewsCategory | 'Barchasi') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  activeCategory,
  userRole,
  onNavigate,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: AppView, category?: NewsCategory | 'Barchasi') => {
    setMobileMenuOpen(false);
    onNavigate(view, category);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#bosh-sahifa"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home', 'Barchasi');
          }}
          className="text-xl font-bold tracking-tight text-[#0F172A] font-serif whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#1E3A8A]"
        >
          40-MAKTAB
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => handleNavClick('home', 'Barchasi')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              currentView === 'home' && activeCategory === 'Barchasi'
                ? 'text-[#1E3A8A] border-[#1E3A8A] font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Bosh sahifa
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('viewer_home', 'Barchasi')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              currentView === 'viewer_home' && activeCategory === 'Barchasi'
                ? 'text-[#1E3A8A] border-[#1E3A8A] font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Yangiliklar
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('viewer_home', 'Tadbirlar')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              currentView === 'viewer_home' && activeCategory === 'Tadbirlar'
                ? 'text-[#1E3A8A] border-[#1E3A8A] font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Tadbirlar
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('viewer_home', 'E’lonlar')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              currentView === 'viewer_home' && activeCategory === 'E’lonlar'
                ? 'text-[#1E3A8A] border-[#1E3A8A] font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            E’lonlar
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('about')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              currentView === 'about'
                ? 'text-[#1E3A8A] border-[#1E3A8A] font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Biz haqimizda
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="hidden md:flex items-center gap-3">
          {userRole === 'admin' ? (
            <>
              <button
                type="button"
                onClick={() => handleNavClick('admin_dashboard')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-blue-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Admin paneli
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Chiqish
              </button>
            </>
          ) : userRole === 'viewer' ? (
            <>
              <button
                type="button"
                onClick={() => handleNavClick('viewer_home', 'Barchasi')}
                className="px-4 py-2 text-xs font-semibold text-[#1E3A8A] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                40-MAKTAB YANGILIKLARI
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Chiqish
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => handleNavClick('auth_choice')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-blue-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Kirish
            </button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menyuni ochish"
            className="p-2.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-2 shadow-lg">
          <button
            type="button"
            onClick={() => handleNavClick('home', 'Barchasi')}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            Bosh sahifa
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('viewer_home', 'Barchasi')}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            Yangiliklar
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('viewer_home', 'Tadbirlar')}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            Tadbirlar
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('viewer_home', 'E’lonlar')}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            E’lonlar
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('about')}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            Biz haqimizda
          </button>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {userRole === 'admin' ? (
              <>
                <button
                  type="button"
                  onClick={() => handleNavClick('admin_dashboard')}
                  className="w-full py-2.5 px-4 text-center text-sm font-semibold text-white bg-[#1E3A8A] rounded-lg"
                >
                  Admin paneli
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full py-2.5 px-4 text-center text-sm font-medium text-slate-700 bg-slate-100 rounded-lg"
                >
                  Chiqish
                </button>
              </>
            ) : userRole === 'viewer' ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full py-2.5 px-4 text-center text-sm font-medium text-slate-700 bg-slate-100 rounded-lg"
              >
                Chiqish
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleNavClick('auth_choice')}
                className="w-full py-2.5 px-4 text-center text-sm font-semibold text-white bg-[#1E3A8A] rounded-lg"
              >
                Kirish
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
