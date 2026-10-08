import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  Newspaper,
  PlusSquare,
  Image as ImageIcon,
  BarChart3,
  Settings,
  LogOut,
  Edit3,
  Trash2,
  Film,
  Upload,
  Eye,
  X,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import {
  NewsItem,
  NewsCategory,
  MediaFile,
  SchoolSettings,
  AdminStats,
  AdminTab,
  NEWS_CATEGORIES,
  formatUzbekDate,
  formatFileSize,
} from '../types';
import { ResilientImage } from './ResilientImage';

interface AdminDashboardProps {
  authToken: string;
  news: NewsItem[];
  settings: SchoolSettings;
  onRefreshData: () => Promise<void>;
  onLogout: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  authToken,
  news,
  settings,
  onRefreshData,
  onLogout,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [mediaList, setMediaList] = useState<MediaFile[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingMedia, setLoadingMedia] = useState(false);

  // News Editor State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NewsCategory>('Maktab yangiliklari');
  const [imageUrl, setImageUrl] = useState('');
  const [imageMeta, setImageMeta] = useState<{ name: string; size: number } | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoMeta, setVideoMeta] = useState<{ name: string; size: number } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadingType, setUploadingType] = useState<'image' | 'video' | null>(null);
  const [submittingNews, setSubmittingNews] = useState(false);

  // Deletion Confirmation Modal State
  const [deleteTargetNews, setDeleteTargetNews] = useState<NewsItem | null>(null);
  const [deletingNews, setDeletingNews] = useState(false);

  // Media Preview Modal State
  const [previewMedia, setPreviewMedia] = useState<MediaFile | null>(null);

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<SchoolSettings>(settings);
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const res = await fetch('/api/stats', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      // ignore
    } finally {
      setLoadingStats(false);
    }
  }, [authToken]);

  const fetchMedia = useCallback(async () => {
    setLoadingMedia(true);
    try {
      const res = await fetch('/api/media', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMediaList(data.media || []);
      }
    } catch {
      // ignore
    } finally {
      setLoadingMedia(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchStats();
    fetchMedia();
  }, [fetchStats, fetchMedia]);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  const resetEditor = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setCategory('Maktab yangiliklari');
    setImageUrl('');
    setImageMeta(null);
    setVideoUrl('');
    setVideoMeta(null);
    setUploadProgress(0);
    setUploadingType(null);
  };

  const handleStartEdit = (item: NewsItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setContent(item.content);
    setCategory(item.category);
    setImageUrl(item.imageUrl || '');
    setImageMeta(item.imageUrl ? { name: 'Yuklangan rasm', size: 0 } : null);
    setVideoUrl(item.videoUrl || '');
    setVideoMeta(item.videoUrl ? { name: 'Yuklangan video', size: 0 } : null);
    setActiveTab('create_news');
  };

  // File Upload Handler with validation, size checks, and progress
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetType: 'image' | 'video'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedImages = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedVideos = ['video/mp4', 'video/webm', 'video/quicktime'];

    if (targetType === 'image' && !allowedImages.includes(file.type.toLowerCase())) {
      showToast('Fayl formati qo‘llab-quvvatlanmaydi.', 'error');
      e.target.value = '';
      return;
    }

    if (targetType === 'video' && !allowedVideos.includes(file.type.toLowerCase())) {
      showToast('Fayl formati qo‘llab-quvvatlanmaydi.', 'error');
      e.target.value = '';
      return;
    }

    const maxBytes = targetType === 'image' ? 10 * 1024 * 1024 : 25 * 1024 * 1024;
    if (file.size > maxBytes) {
      showToast('Fayl hajmi juda katta.', 'error');
      e.target.value = '';
      return;
    }

    setUploadingType(targetType);
    setUploadProgress(15);

    const reader = new FileReader();
    reader.onprogress = (ev) => {
      if (ev.lengthComputable) {
        const pct = Math.round((ev.loaded / ev.total) * 65);
        setUploadProgress(pct);
      }
    };

    reader.onload = async () => {
      try {
        setUploadProgress(80);
        const dataUrl = reader.result as string;
        const res = await fetch('/api/media/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            fileName: file.name,
            mimeType: file.type,
            dataUrl,
            size: file.size,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          showToast(data.error || 'Xatolik yuz berdi. Qaytadan urinib ko‘ring.', 'error');
          setUploadingType(null);
          setUploadProgress(0);
          return;
        }

        setUploadProgress(100);
        if (targetType === 'image') {
          setImageUrl(data.media.url);
          setImageMeta({ name: file.name, size: file.size });
          showToast('Rasm yuklandi.', 'success');
        } else {
          setVideoUrl(data.media.url);
          setVideoMeta({ name: file.name, size: file.size });
          showToast('Video yuklandi.', 'success');
        }

        fetchMedia();
        fetchStats();
      } catch {
        showToast('Xatolik yuz berdi. Qaytadan urinib ko‘ring.', 'error');
      } finally {
        setTimeout(() => {
          setUploadingType(null);
          setUploadProgress(0);
        }, 400);
      }
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Save or Publish News
  const handleSaveNews = async (publishNow: boolean) => {
    if (!title.trim() || !content.trim()) {
      showToast('Yangilik sarlavhasi va matnini kiriting.', 'error');
      return;
    }

    setSubmittingNews(true);
    try {
      const endpoint = editingId ? `/api/news/${editingId}` : '/api/news';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title,
          content,
          category,
          imageUrl,
          videoUrl,
          published: publishNow,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Xatolik yuz berdi. Qaytadan urinib ko‘ring.', 'error');
        setSubmittingNews(false);
        return;
      }

      showToast(
        publishNow
          ? 'Yangilik muvaffaqiyatli e’lon qilindi.'
          : 'Yangilik muvaffaqiyatli saqlandi.',
        'success'
      );

      resetEditor();
      await onRefreshData();
      await fetchStats();
      setActiveTab('news_list');
    } catch {
      showToast('Xatolik yuz berdi. Qaytadan urinib ko‘ring.', 'error');
    } finally {
      setSubmittingNews(false);
    }
  };

  // Confirm Delete News
  const handleConfirmDeleteNews = async () => {
    if (!deleteTargetNews) return;
    setDeletingNews(true);

    try {
      const res = await fetch(`/api/news/${deleteTargetNews.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Xatolik yuz berdi. Qaytadan urinib ko‘ring.', 'error');
        setDeletingNews(false);
        return;
      }

      showToast('Yangilik o‘chirildi.', 'success');
      setDeleteTargetNews(null);
      await onRefreshData();
      await fetchStats();
    } catch {
      showToast('Xatolik yuz berdi. Qaytadan urinib ko‘ring.', 'error');
    } finally {
      setDeletingNews(false);
    }
  };

  // Delete Media File
  const handleDeleteMedia = async (id: string) => {
    try {
      const res = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        showToast('Yangilik o‘chirildi.', 'info');
        fetchMedia();
        fetchStats();
      }
    } catch {
      showToast('Xatolik yuz berdi. Qaytadan urinib ko‘ring.', 'error');
    }
  };

  // Save School Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(settingsForm),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || 'Yangilik muvaffaqiyatli saqlandi.', 'success');
        await onRefreshData();
      } else {
        showToast('Xatolik yuz berdi. Qaytadan urinib ko‘ring.', 'error');
      }
    } catch {
      showToast('Xatolik yuz berdi. Qaytadan urinib ko‘ring.', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Boshqaruv', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'news_list', label: 'Yangiliklar', icon: <Newspaper className="w-4 h-4" /> },
    { id: 'create_news', label: 'Yangi yangilik', icon: <PlusSquare className="w-4 h-4" /> },
    { id: 'media', label: 'Media', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'stats', label: 'Statistika', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Sozlamalar', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F8FAFC] flex flex-col lg:flex-row">
      {/* ADMIN SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 shrink-0">
        <div className="p-6 border-b border-slate-200 hidden lg:block">
          <p className="text-xs uppercase tracking-widest text-[#1E3A8A] font-semibold">
            40-MAKTAB
          </p>
          <h1 className="text-xl font-bold text-slate-900 font-serif mt-0.5">
            Admin paneli
          </h1>
        </div>

        <nav className="p-3 flex lg:flex-col gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === 'create_news' && activeTab !== 'create_news') {
                    resetEditor();
                  }
                  setActiveTab(item.id);
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#1E3A8A] text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors whitespace-nowrap shrink-0 lg:mt-6 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Chiqish</span>
          </button>
        </nav>
      </aside>

      {/* MAIN ADMIN WORKSPACE */}
      <main className="flex-1 p-4 sm:p-8 max-w-[1200px]">
        {/* 1. BOSHQARUV (OVERVIEW TAB) */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#1E3A8A] font-semibold">
                  ADMIN PANELI
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif mt-0.5">
                  Boshqaruv
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetEditor();
                  setActiveTab('create_news');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1E3A8A] hover:bg-blue-900 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer self-start"
              >
                <PlusSquare className="w-4 h-4" />
                <span>Yangi yangilik</span>
              </button>
            </div>

            {/* Clean Statistic Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Jami yangiliklar
                </p>
                <p className="text-3xl font-bold text-slate-900 font-mono tabular-nums mt-2">
                  {stats ? stats.totalNews : news.length}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Barcha chop etilgan va qoralama maqolalar
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Bugungi yangiliklar
                </p>
                <p className="text-3xl font-bold text-[#1E3A8A] font-mono tabular-nums mt-2">
                  {stats ? stats.todayNews : 0}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Oxirgi 24 soat ichida kiritilgan
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Jami ko‘rishlar
                </p>
                <p className="text-3xl font-bold text-emerald-700 font-mono tabular-nums mt-2">
                  {stats
                    ? stats.totalViews
                    : news.reduce((s, n) => s + (n.views || 0), 0)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  O‘quvchilar va ota-onalar faolligi
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Jami e’lonlar
                </p>
                <p className="text-3xl font-bold text-amber-700 font-mono tabular-nums mt-2">
                  {stats
                    ? stats.totalAnnouncements
                    : news.filter((n) => n.category === 'E’lonlar').length}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Rasmiy maktab e’lonlari soni
                </p>
              </div>
            </div>

            {/* Recent News Quick Management Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 font-serif">
                  So‘nggi kiritilgan yangiliklar
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('news_list')}
                  className="text-xs font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
                >
                  Yangiliklarni boshqarish →
                </button>
              </div>

              {news.length === 0 ? (
                <div className="p-10 text-center text-sm text-slate-500">
                  Hozircha yangiliklar mavjud emas.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 bg-slate-50">
                        <th className="py-3 px-4">Sarlavha</th>
                        <th className="py-3 px-4">Kategoriya</th>
                        <th className="py-3 px-4">Sana</th>
                        <th className="py-3 px-4">Holati</th>
                        <th className="py-3 px-4 text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm">
                      {news.slice(0, 5).map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80">
                          <td className="py-3.5 px-4 font-medium text-slate-900 max-w-xs truncate">
                            {item.title}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                            {item.category}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 text-xs tabular-nums whitespace-nowrap">
                            {formatUzbekDate(item.createdAt)}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {item.published ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                E’lon qilingan
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                                <Clock className="w-3.5 h-3.5" />
                                Saqlangan (Qoralama)
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-3">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(item)}
                              className="text-xs font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
                            >
                              Tahrirlash
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTargetNews(item)}
                              className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                            >
                              O‘chirish
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. YANGILIKLARNI BOSHQARISH (NEWS MANAGEMENT TAB) */}
        {activeTab === 'news_list' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#1E3A8A] font-semibold">
                  MAQOLALAR VA E’LONLAR RO‘YXATI
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif mt-0.5">
                  Yangiliklarni boshqarish
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetEditor();
                  setActiveTab('create_news');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1E3A8A] hover:bg-blue-900 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer self-start"
              >
                <PlusSquare className="w-4 h-4" />
                <span>Yangi yangilik</span>
              </button>
            </div>

            {news.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <p className="text-base font-medium text-slate-600">
                  Hozircha yangiliklar mavjud emas.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {news.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                      {/* Image Thumbnail */}
                      <div className="w-24 h-18 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                        <ResilientImage
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
                          <span className="font-semibold text-[#1E3A8A]">
                            {item.category}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">
                            {formatUzbekDate(item.createdAt)}
                          </span>
                          <span aria-hidden="true">·</span>
                          {item.published ? (
                            <span className="font-semibold text-emerald-700">
                              E’lon qilingan
                            </span>
                          ) : (
                            <span className="font-semibold text-amber-700">
                              Saqlangan (Qoralama)
                            </span>
                          )}
                          {item.videoUrl && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                                <Film className="w-3.5 h-3.5" />
                                Video mavjud
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 font-serif truncate">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {item.content}
                        </p>
                      </div>
                    </div>

                    {/* Actions: "Tahrirlash" & "O‘chirish" */}
                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(item)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Tahrirlash</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTargetNews(item)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>O‘chirish</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. YANGI YANGILIK (CREATE / EDIT NEWS TAB) */}
        {activeTab === 'create_news' && (
          <div className="space-y-6">
            <div className="pb-6 border-b border-slate-200">
              <p className="text-xs uppercase tracking-widest text-[#1E3A8A] font-semibold">
                MUHARRIR BO‘LIMI
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif mt-0.5">
                {editingId ? 'Yangilikni tahrirlash' : 'Yangi yangilik'}
              </h2>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
              {/* Field: "Yangilik sarlavhasi" */}
              <div>
                <label
                  htmlFor="news-title-input"
                  className="block text-sm font-semibold text-slate-800 mb-2"
                >
                  Yangilik sarlavhasi
                </label>
                <input
                  id="news-title-input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masalan: 40-maktab o‘quvchilari fan olimpiadasida g‘olib bo‘ldi"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 text-base focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>

              {/* Field: "Kategoriya" */}
              <div>
                <label
                  htmlFor="news-category-select"
                  className="block text-sm font-semibold text-slate-800 mb-2"
                >
                  Kategoriya
                </label>
                <select
                  id="news-category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as NewsCategory)}
                  className="w-full sm:w-72 px-4 py-3 rounded-lg border border-slate-300 text-slate-900 text-sm bg-white focus:outline-none focus:border-[#1E3A8A]"
                >
                  {NEWS_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field: "Yangilik matni" */}
              <div>
                <label
                  htmlFor="news-content-textarea"
                  className="block text-sm font-semibold text-slate-800 mb-2"
                >
                  Yangilik matni
                </label>
                <textarea
                  id="news-content-textarea"
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Yangilikning to‘liq matnini shu yerga yozing..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 text-base leading-relaxed focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>

              {/* Media Upload Section: "Rasm yuklash" & "Video yuklash" */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Image Upload Box */}
                <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-slate-800">
                        Rasm yuklash
                      </span>
                      <span className="text-xs text-slate-500">
                        JPG, JPEG, PNG, WEBP (maks. 10 MB)
                      </span>
                    </div>

                    {imageUrl ? (
                      <div className="space-y-3">
                        <div className="h-44 rounded-lg overflow-hidden border border-slate-200 bg-white">
                          <ResilientImage
                            src={imageUrl}
                            alt="Yuklangan rasm"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-600">
                          <span className="truncate max-w-[200px]">
                            {imageMeta?.name || 'Yuklangan rasm'}
                            {imageMeta?.size ? ` (${formatFileSize(imageMeta.size)})` : ''}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setImageUrl('');
                              setImageMeta(null);
                            }}
                            className="text-red-600 font-semibold hover:underline cursor-pointer"
                          >
                            O‘chirish
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-slate-300 rounded-lg bg-white hover:border-[#1E3A8A] transition-colors cursor-pointer p-4 text-center">
                        <Upload className="w-6 h-6 text-[#1E3A8A] mb-2" />
                        <span className="text-sm font-semibold text-[#1E3A8A]">
                          Rasm yuklash
                        </span>
                        <span className="text-xs text-slate-500 mt-1">
                          Kompyuter yoki telefondan rasm tanlang
                        </span>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                          onChange={(e) => handleFileUpload(e, 'image')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Video Upload Box */}
                <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-slate-800">
                        Video yuklash
                      </span>
                      <span className="text-xs text-slate-500">
                        MP4, WEBM, MOV (maks. 25 MB)
                      </span>
                    </div>

                    {videoUrl ? (
                      <div className="space-y-3">
                        <div className="h-44 rounded-lg overflow-hidden border border-slate-200 bg-black flex items-center justify-center">
                          <video
                            src={videoUrl}
                            controls
                            preload="metadata"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-600">
                          <span className="truncate max-w-[200px]">
                            {videoMeta?.name || 'Yuklangan video'}
                            {videoMeta?.size ? ` (${formatFileSize(videoMeta.size)})` : ''}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setVideoUrl('');
                              setVideoMeta(null);
                            }}
                            className="text-red-600 font-semibold hover:underline cursor-pointer"
                          >
                            O‘chirish
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-slate-300 rounded-lg bg-white hover:border-[#1E3A8A] transition-colors cursor-pointer p-4 text-center">
                        <Film className="w-6 h-6 text-[#1E3A8A] mb-2" />
                        <span className="text-sm font-semibold text-[#1E3A8A]">
                          Video yuklash
                        </span>
                        <span className="text-xs text-slate-500 mt-1">
                          MP4, WEBM yoki MOV video tanlang
                        </span>
                        <input
                          type="file"
                          accept=".mp4,.webm,.mov,video/mp4,video/webm,video/quicktime"
                          onChange={(e) => handleFileUpload(e, 'video')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload Progress Indicator */}
              {uploadingType && (
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#1E3A8A] mb-1.5">
                    <span>
                      {uploadingType === 'image'
                        ? 'Rasm yuklanmoqda...'
                        : 'Video yuklanmoqda...'}
                    </span>
                    <span className="tabular-nums">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1E3A8A] transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Editor Action Buttons: "Saqlash", "E’lon qilish", "Bekor qilish" */}
              <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    resetEditor();
                    setActiveTab('news_list');
                  }}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>

                <button
                  type="button"
                  disabled={submittingNews}
                  onClick={() => handleSaveNews(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-[#1E3A8A] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                >
                  Saqlash
                </button>

                <button
                  type="button"
                  disabled={submittingNews}
                  onClick={() => handleSaveNews(true)}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-blue-900 rounded-lg transition-colors cursor-pointer"
                >
                  E’lon qilish
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. MEDIA KUTUBXONASI (MEDIA LIBRARY TAB) */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#1E3A8A] font-semibold">
                  YUKLANGAN FAYLLAR BAZASI
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif mt-0.5">
                  Media kutubxonasi
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Rasm yuklash</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={(e) => handleFileUpload(e, 'image')}
                    className="hidden"
                  />
                </label>
                <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer">
                  <Film className="w-4 h-4" />
                  <span>Video yuklash</span>
                  <input
                    type="file"
                    accept=".mp4,.webm,.mov,video/mp4,video/webm,video/quicktime"
                    onChange={(e) => handleFileUpload(e, 'video')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {loadingMedia ? (
              <div className="p-12 text-center text-sm text-slate-500">
                Yuklanmoqda...
              </div>
            ) : mediaList.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <p className="text-base font-medium text-slate-600">
                  Hozircha media fayllar mavjud emas.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mediaList.map((m) => (
                  <div
                    key={m.id}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-44 w-full bg-slate-900 relative overflow-hidden">
                        {m.type === 'image' ? (
                          <ResilientImage
                            src={m.url}
                            alt={m.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-white p-4">
                            <Film className="w-10 h-10 text-amber-400 mb-2" />
                            <span className="text-xs text-slate-300 font-medium">
                              Video fayl ({m.mimeType})
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {m.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 tabular-nums">
                          <span>{formatFileSize(m.size)}</span>
                          <span aria-hidden="true">·</span>
                          <span>{formatUzbekDate(m.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setPreviewMedia(m)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1E3A8A] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ko‘rish</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteMedia(m.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>O‘chirish</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. STATISTIKA (STATISTICS TAB) */}
        {activeTab === 'stats' && (
          <div className="space-y-8">
            <div className="pb-6 border-b border-slate-200">
              <p className="text-xs uppercase tracking-widest text-[#1E3A8A] font-semibold">
                TAHLIL VA KO‘RSATKICHLAR
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif mt-0.5">
                Statistika
              </h2>
            </div>

            {loadingStats ? (
              <div className="p-10 text-center text-sm text-slate-500">
                Yuklanmoqda...
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Jami yangiliklar
                    </p>
                    <p className="text-3xl font-bold text-slate-900 font-mono tabular-nums mt-2">
                      {stats ? stats.totalNews : news.length}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Bugungi yangiliklar
                    </p>
                    <p className="text-3xl font-bold text-[#1E3A8A] font-mono tabular-nums mt-2">
                      {stats ? stats.todayNews : 0}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Jami ko‘rishlar
                    </p>
                    <p className="text-3xl font-bold text-emerald-700 font-mono tabular-nums mt-2">
                      {stats
                        ? stats.totalViews
                        : news.reduce((s, n) => s + (n.views || 0), 0)}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Jami e’lonlar
                    </p>
                    <p className="text-3xl font-bold text-amber-700 font-mono tabular-nums mt-2">
                      {stats
                        ? stats.totalAnnouncements
                        : news.filter((n) => n.category === 'E’lonlar').length}
                    </p>
                  </div>
                </div>

                {/* Category Distribution Chart */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
                  <h3 className="text-lg font-bold text-slate-900 font-serif mb-6">
                    Kategoriyalar bo‘yicha yangiliklar va o‘qilishlar ko‘rsatkichi
                  </h3>

                  <div className="space-y-5">
                    {(stats?.categoryBreakdown || []).map((row) => {
                      const maxViews = Math.max(
                        1,
                        ...(stats?.categoryBreakdown.map((c) => c.views) || [1])
                      );
                      const widthPct = Math.max(
                        6,
                        Math.round((row.views / maxViews) * 100)
                      );

                      return (
                        <div key={row.category} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-semibold text-slate-800">
                              {row.category}
                            </span>
                            <span className="text-xs text-slate-500 font-mono tabular-nums">
                              {row.count} ta yangilik · {row.views} ta ko‘rish
                            </span>
                          </div>
                          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#1E3A8A] rounded-full"
                              style={{ width: `${widthPct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* 6. SOZLAMALAR (SETTINGS TAB) */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="pb-6 border-b border-slate-200">
              <p className="text-xs uppercase tracking-widest text-[#1E3A8A] font-semibold">
                TIZIM PARAMETRLARI
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif mt-0.5">
                Sozlamalar
              </h2>
            </div>

            <form
              onSubmit={handleSaveSettings}
              className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Maktab nomi
                  </label>
                  <input
                    type="text"
                    value={settingsForm.schoolName}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, schoolName: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Asosiy shior (Subtitle)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.subtitle}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, subtitle: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Maktab direktori
                  </label>
                  <input
                    type="text"
                    value={settingsForm.directorName}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, directorName: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Telefon raqami
                  </label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, phone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Maktab manzili
                  </label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, address: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Elektron pochta
                  </label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, email: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Ish vaqti
                  </label>
                  <input
                    type="text"
                    value={settingsForm.workingHours}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, workingHours: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-6 py-2.5 bg-[#1E3A8A] hover:bg-blue-900 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  {savingSettings ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* DELETION CONFIRMATION MODAL ("Bu yangilikni o‘chirishni xohlaysizmi?") */}
      {deleteTargetNews && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 sm:p-8 shadow-xl">
            <h3 className="text-xl font-bold text-slate-900 font-serif">
              Bu yangilikni o‘chirishni xohlaysizmi?
            </h3>
            <p className="mt-2 text-sm text-slate-600 line-clamp-2">
              “{deleteTargetNews.title}”
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={deletingNews}
                onClick={() => setDeleteTargetNews(null)}
                className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                disabled={deletingNews}
                onClick={handleConfirmDeleteNews}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
              >
                {deletingNews ? 'O‘chirilmoqda...' : 'Ha, o‘chirish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MEDIA PREVIEW MODAL ("Ko‘rish") */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-3xl w-full overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 truncate">
                {previewMedia.name}
              </h3>
              <button
                type="button"
                onClick={() => setPreviewMedia(null)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-slate-950 flex items-center justify-center max-h-[70vh] overflow-hidden">
              {previewMedia.type === 'image' ? (
                <img
                  src={previewMedia.url}
                  alt={previewMedia.name}
                  className="max-h-[62vh] w-auto object-contain rounded"
                />
              ) : (
                <video
                  src={previewMedia.url}
                  controls
                  autoPlay
                  className="max-h-[62vh] w-full rounded"
                />
              )}
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 tabular-nums">
              <span>Hajmi: {formatFileSize(previewMedia.size)}</span>
              <span>Sana: {formatUzbekDate(previewMedia.createdAt)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
