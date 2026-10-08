import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X, WifiOff } from 'lucide-react';
import {
  NewsItem,
  NewsCategory,
  SchoolSettings,
  AppView,
  ToastNotification,
} from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PublicViews } from './components/PublicViews';
import { AuthViews } from './components/AuthViews';
import { AdminDashboard } from './components/AdminDashboard';

const DEFAULT_SETTINGS: SchoolSettings = {
  schoolName: '40-MAKTAB',
  subtitle: '40-maktab yangiliklari va e’lonlari',
  address: 'Andijon viloyati, Oltinkoʻl tumani, Koʻtarma chek koʻchasi',
  phone: '+998 93 547 14 20',
  email: 'info@40-maktab.uz',
  workingHours: 'Dushanba – Shanba: 08:00 – 18:00',
  directorName: 'Rustamova Dilnoza Karimovna',
  studentCount: 1420,
  teacherCount: 86,
  foundedYear: 1984,
};

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [activeCategory, setActiveCategory] = useState<NewsCategory | 'Barchasi'>('Barchasi');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [settings, setSettings] = useState<SchoolSettings>(DEFAULT_SETTINGS);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  // Auth Session State
  const [authToken, setAuthToken] = useState<string>(() => {
    return localStorage.getItem('maktab40_token') || '';
  });
  const [userRole, setUserRole] = useState<'admin' | 'viewer' | null>(null);

  // Toast Notifications State
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'success') => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  // Monitor Internet Connectivity
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => {
      setIsOffline(true);
      showToast('Internet aloqasi mavjud emas.', 'error');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToast]);

  // Fetch News & School Settings
  const fetchNewsAndSettings = useCallback(async (tokenOverride?: string) => {
    const tokenToUse = tokenOverride !== undefined ? tokenOverride : authToken;
    try {
      const headers: Record<string, string> = {};
      if (tokenToUse) {
        headers.Authorization = `Bearer ${tokenToUse}`;
      }
      const res = await fetch('/api/news', { headers });
      if (res.ok) {
        const data = await res.json();
        setNews(data.news || []);
        if (data.settings) {
          setSettings(data.settings);
        }
      }
    } catch {
      // Handled gracefully
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // Verify stored token on boot
  useEffect(() => {
    async function initApp() {
      if (authToken) {
        try {
          const res = await fetch('/api/auth/session', {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          if (res.ok) {
            const data = await res.json();
            if (data.authenticated) {
              setUserRole(data.role);
            } else {
              localStorage.removeItem('maktab40_token');
              setAuthToken('');
              setUserRole(null);
            }
          }
        } catch {
          // ignore
        }
      }
      await fetchNewsAndSettings();
    }
    initApp();
  }, [authToken, fetchNewsAndSettings]);

  const handleNavigate = (
    view: AppView,
    category?: NewsCategory | 'Barchasi'
  ) => {
    if (category) {
      setActiveCategory(category);
    }
    if (view === 'admin_dashboard' && userRole !== 'admin') {
      setCurrentView('admin_login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenNewsDetail = async (item: NewsItem) => {
    setSelectedNews(item);
    setCurrentView('news_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Record view in background
    try {
      const res = await fetch(`/api/news/${item.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.item) {
          setSelectedNews(data.item);
          setNews((prev) =>
            prev.map((n) => (n.id === data.item.id ? data.item : n))
          );
        }
      }
    } catch {
      // ignore
    }
  };

  const handleAdminLoginSuccess = async (token: string) => {
    localStorage.setItem('maktab40_token', token);
    setAuthToken(token);
    setUserRole('admin');
    await fetchNewsAndSettings(token);
    setCurrentView('admin_dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewerLoginSuccess = async (token: string) => {
    localStorage.setItem('maktab40_token', token);
    setAuthToken(token);
    setUserRole('viewer');
    await fetchNewsAndSettings(token);
    setCurrentView('viewer_home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    if (authToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${authToken}` },
        });
      } catch {
        // ignore
      }
    }
    localStorage.removeItem('maktab40_token');
    setAuthToken('');
    setUserRole(null);
    await fetchNewsAndSettings('');
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-red-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          <span>Internet aloqasi mavjud emas.</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <Navbar
        currentView={currentView}
        activeCategory={activeCategory}
        userRole={userRole}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      {/* Toast Notifications Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl shadow-lg border text-sm font-medium ${
              t.type === 'error'
                ? 'bg-red-950 text-white border-red-800'
                : t.type === 'info'
                ? 'bg-slate-900 text-white border-slate-700'
                : 'bg-[#0F172A] text-white border-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {t.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              ) : t.type === 'info' ? (
                <Info className="w-4 h-4 text-blue-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span>{t.message}</span>
            </div>
            <button
              type="button"
              onClick={() =>
                setToasts((prev) => prev.filter((item) => item.id !== t.id))
              }
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {loading ? (
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
            <div className="h-64 bg-slate-200/70 rounded-xl animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-72 bg-slate-200/70 rounded-xl animate-pulse" />
              <div className="h-72 bg-slate-200/70 rounded-xl animate-pulse" />
              <div className="h-72 bg-slate-200/70 rounded-xl animate-pulse" />
            </div>
          </div>
        ) : currentView === 'auth_choice' ||
          currentView === 'admin_login' ||
          currentView === 'viewer_login' ? (
          <AuthViews
            currentView={currentView}
            onNavigate={handleNavigate}
            onAdminLoginSuccess={handleAdminLoginSuccess}
            onViewerLoginSuccess={handleViewerLoginSuccess}
            showToast={showToast}
          />
        ) : currentView === 'admin_dashboard' && userRole === 'admin' ? (
          <AdminDashboard
            authToken={authToken}
            news={news}
            settings={settings}
            onRefreshData={() => fetchNewsAndSettings(authToken)}
            onLogout={handleLogout}
            showToast={showToast}
          />
        ) : (
          <PublicViews
            currentView={currentView}
            news={news.filter((n) => n.published)}
            settings={settings}
            selectedNews={selectedNews}
            activeCategory={activeCategory}
            onSelectCategory={(cat) => setActiveCategory(cat)}
            onOpenNewsDetail={handleOpenNewsDetail}
            onNavigate={handleNavigate}
          />
        )}
      </div>

      {/* Footer (shown on public views) */}
      {currentView !== 'admin_dashboard' && (
        <Footer settings={settings} onNavigate={handleNavigate} />
      )}
    </div>
  );
}
