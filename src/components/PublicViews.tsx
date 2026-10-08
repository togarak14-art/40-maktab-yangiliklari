import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowLeft,
  ArrowRight,
  Film,
  X,
  MapPin,
  Phone,
  Mail,
  Clock,
  GraduationCap,
} from 'lucide-react';
import {
  NewsItem,
  NewsCategory,
  SchoolSettings,
  AppView,
  NEWS_CATEGORIES,
  formatUzbekDate,
} from '../types';
import { ResilientImage } from './ResilientImage';

interface PublicViewsProps {
  currentView: AppView;
  news: NewsItem[];
  settings: SchoolSettings;
  selectedNews: NewsItem | null;
  activeCategory: NewsCategory | 'Barchasi';
  onSelectCategory: (cat: NewsCategory | 'Barchasi') => void;
  onOpenNewsDetail: (item: NewsItem) => void;
  onNavigate: (view: AppView, category?: NewsCategory | 'Barchasi') => void;
}

export const PublicViews: React.FC<PublicViewsProps> = ({
  currentView,
  news,
  settings,
  selectedNews,
  activeCategory,
  onSelectCategory,
  onOpenNewsDetail,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);

  // Filter and search news
  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const matchesCat =
        activeCategory === 'Barchasi' || item.category === activeCategory;
      if (!matchesCat) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });
  }, [news, activeCategory, searchQuery]);

  // 1. FULL NEWS DETAIL PAGE ("Batafsil")
  if (currentView === 'news_detail' && selectedNews) {
    return (
      <article className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => onNavigate('viewer_home', activeCategory)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Orqaga</span>
          </button>
        </div>

        {/* Unboxed Editorial Metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1E3A8A] mb-3">
          <span>{selectedNews.category}</span>
          <span aria-hidden="true" className="text-slate-300">
            ·
          </span>
          <span className="text-slate-500 font-normal normal-case tabular-nums">
            {formatUzbekDate(selectedNews.createdAt)}
          </span>
          <span aria-hidden="true" className="text-slate-300">
            ·
          </span>
          <span className="text-slate-500 font-normal normal-case">
            {selectedNews.author}
          </span>
          <span aria-hidden="true" className="text-slate-300">
            ·
          </span>
          <span className="text-slate-500 font-normal normal-case tabular-nums">
            {selectedNews.views} marta o‘qildi
          </span>
        </div>

        {/* Large Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-slate-900 font-serif leading-tight">
          {selectedNews.title}
        </h1>

        <div className="my-8 h-[420px] sm:h-[480px] rounded-xl overflow-hidden border border-slate-200">
          <ResilientImage
            src={selectedNews.imageUrl}
            alt={selectedNews.title}
            category={selectedNews.category}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Video Player if videoUrl is present */}
        {selectedNews.videoUrl && (
          <div className="my-8 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-3">
              <Film className="w-4 h-4" />
              <span>Video lavha</span>
            </div>
            <video
              src={selectedNews.videoUrl}
              controls
              preload="metadata"
              className="w-full max-h-[480px] rounded-lg bg-black"
            >
              Brauzeringiz video formatini qo‘llab-quvvatlamaydi.
            </video>
          </div>
        )}

        {/* Full Article Prose */}
        <div className="mt-8 max-w-[70ch] text-base sm:text-lg text-slate-800 leading-relaxed space-y-5">
          {selectedNews.content.split('\n\n').map((paragraph, index) => (
            <p
              key={index}
              className={
                index === 0
                  ? 'first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:text-[#1E3A8A] first-letter:mr-2'
                  : ''
              }
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('viewer_home', activeCategory)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Orqaga</span>
          </button>
          <span className="text-xs text-slate-500">
            40-MAKTAB rasmiy axborot xizmati
          </span>
        </div>
      </article>
    );
  }

  // 2. ABOUT PAGE ("Biz haqimizda")
  if (currentView === 'about') {
    return (
      <section className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-6">
            <p className="text-xs uppercase tracking-widest text-[#1E3A8A] font-semibold">
              MAKTAB TARIXI VA FAOLIYATI
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif">
              {settings.schoolName} — Zamonaviy ta’lim va yuksak tarbiya maskani
            </h1>
            <p className="text-base text-slate-700 leading-relaxed">
              40-umumiy o‘rta ta’lim maktabi {settings.foundedYear}-yilda tashkil etilgan bo‘lib, bugungi kunda {settings.studentCount} nafardan ziyod o‘quvchiga zamonaviy standartlar asosida ta’lim berib kelmoqda. Maktabimizda {settings.teacherCount} nafar yuqori malakali pedagog va ustozlar faoliyat yuritadi.
            </p>
            <p className="text-base text-slate-700 leading-relaxed">
              “40-MAKTAB” raqamli axborot platformasi maktab ma’muriyati, o‘quvchilar va ota-onalar o‘rtasidagi axborot almashinuvini shaffof, tezkor va ishonchli tarzda yo‘lga qo‘yish maqsadida ishlab chiqilgan.
            </p>

            {/* Operational Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-[#1E3A8A] font-mono tabular-nums">
                  {settings.studentCount}+
                </p>
                <p className="text-xs text-slate-500 mt-1">Faol o‘quvchilar</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-[#1E3A8A] font-mono tabular-nums">
                  {settings.teacherCount}
                </p>
                <p className="text-xs text-slate-500 mt-1">Malakali ustozlar</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-[#1E3A8A] font-mono tabular-nums">
                  {settings.foundedYear}
                </p>
                <p className="text-xs text-slate-500 mt-1">Tashkil topgan yil</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="h-52 rounded-lg overflow-hidden">
              <ResilientImage
                src="/assets/school_campus.jpg"
                alt="40-maktab binosi"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3 text-sm">
              <h2 className="text-lg font-bold text-slate-900 font-serif">
                Bog‘lanish va qabul
              </h2>
              <div className="flex items-start gap-3 text-slate-600">
                <GraduationCap className="w-4 h-4 text-[#1E3A8A] mt-1 shrink-0" />
                <span>Maktab direktori: {settings.directorName}</span>
              </div>
              <div className="flex items-start gap-3 text-slate-600">
                <MapPin className="w-4 h-4 text-[#1E3A8A] mt-1 shrink-0" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 tabular-nums">
                <Phone className="w-4 h-4 text-[#1E3A8A] shrink-0" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Mail className="w-4 h-4 text-[#1E3A8A] shrink-0" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Clock className="w-4 h-4 text-[#1E3A8A] shrink-0" />
                <span>{settings.workingHours}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 3. VIEWER HOME ("40-MAKTAB YANGILIKLARI")
  if (currentView === 'viewer_home') {
    const paginatedNews = filteredNews.slice(0, visibleCount);

    return (
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#1E3A8A] font-semibold mb-1.5">
              {settings.subtitle || '40-maktab yangiliklari va e’lonlari'}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif">
              40-MAKTAB YANGILIKLARI
            </h1>
          </div>

          {/* Search Input ("Yangilik qidirish...") */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Yangilik qidirish..."
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-blue-900/15"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Qidiruvni tozalash"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Tabs (Interactive Segmented Buttons) */}
        <div className="mt-6 flex items-center gap-1.5 overflow-x-auto pb-2">
          {(['Barchasi', ...NEWS_CATEGORIES] as const).map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  onSelectCategory(cat);
                  setVisibleCount(6);
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#1E3A8A] text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* News Listing or Empty States */}
        {news.length === 0 ? (
          <div className="mt-12 bg-white rounded-xl border border-slate-200 p-12 text-center">
            <p className="text-base font-medium text-slate-600">
              Hozircha yangiliklar mavjud emas.
            </p>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="mt-12 bg-white rounded-xl border border-slate-200 p-12 text-center">
            <p className="text-base font-medium text-slate-600">
              Hech qanday yangilik topilmadi.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                onSelectCategory('Barchasi');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-[#1E3A8A] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
            >
              Barcha yangiliklarni ko‘rsatish
            </button>
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedNews.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors"
                >
                  <div>
                    <div
                      onClick={() => onOpenNewsDetail(item)}
                      className="h-52 w-full cursor-pointer overflow-hidden"
                    >
                      <ResilientImage
                        src={item.imageUrl}
                        alt={item.title}
                        category={item.category}
                        hasVideo={Boolean(item.videoUrl)}
                        className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-200"
                      />
                    </div>

                    <div className="p-6">
                      {/* Zero-Pill Unboxed Metadata */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <span className="font-semibold text-[#1E3A8A]">
                          {item.category}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">
                          {formatUzbekDate(item.createdAt)}
                        </span>
                      </div>

                      <h2
                        onClick={() => onOpenNewsDetail(item)}
                        className="text-xl font-bold text-slate-900 font-serif leading-snug line-clamp-2 hover:text-[#1E3A8A] transition-colors cursor-pointer"
                      >
                        {item.title}
                      </h2>

                      <p className="mt-2.5 text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onOpenNewsDetail(item)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3A8A] hover:text-blue-950 transition-colors cursor-pointer"
                    >
                      <span>Batafsil</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {item.videoUrl && (
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Film className="w-3.5 h-3.5 text-amber-600" />
                        <span>Video</span>
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {visibleCount < filteredNews.length && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="px-6 py-3 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Yana yuklash ({filteredNews.length - visibleCount} ta)
                </button>
              </div>
            )}
          </>
        )}
      </section>
    );
  }

  // 4. HOME PAGE (Landing Page)
  const announcements = news.filter((n) => n.category === 'E’lonlar').slice(0, 3);
  const recentEvents = news.filter((n) => n.category === 'Tadbirlar' || n.category === 'Sport').slice(0, 3);
  const mediaPreviews = news.filter((n) => n.imageUrl || n.videoUrl).slice(0, 4);
  const latestNews = news.slice(0, 6);

  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative bg-[#0F172A] text-white overflow-hidden border-b border-slate-800">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold">
                <span>{settings.subtitle || '40-maktab yangiliklari va e’lonlari'}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif tracking-tight text-white">
                40-MAKTAB
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-xl">
                Maktabimizdagi eng so‘nggi yangiliklardan xabardor bo‘ling.
              </p>

              <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
                Rasmiy yangiliklar, dars jadvallari va muhim e’lonlar, fan olimpiadalari natijalari hamda maktab hayotidan foto va video lavhalar.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('viewer_home', 'Barchasi')}
                  className="px-6 py-3.5 bg-[#1E3A8A] hover:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  Yangiliklarni ko‘rish
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('auth_choice')}
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm font-semibold rounded-lg backdrop-blur-sm transition-colors cursor-pointer whitespace-nowrap"
                >
                  Kirish
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-xl overflow-hidden border border-slate-700/80 shadow-2xl h-[300px] sm:h-[380px]">
                <ResilientImage
                  src="/assets/school_campus.jpg"
                  alt="40-MAKTAB binosi"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs text-amber-300 font-semibold uppercase tracking-wider">
                    Rasmiy ta’lim muassasasi
                  </p>
                  <p className="text-sm sm:text-base font-serif font-medium mt-0.5">
                    {settings.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OPERATIONAL UTILITY STRIP */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-slate-900">Ish vaqti:</span>
            <span>{settings.workingHours}</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-slate-900">Ishonch telefoni:</span>
            <span className="tabular-nums">{settings.phone}</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('about')}
            className="text-[#1E3A8A] font-semibold hover:underline cursor-pointer"
          >
            Maktab haqida ma’lumot →
          </button>
        </div>
      </div>

      {/* MAIN CONTENT: SEARCH, FILTERS & LATEST NEWS */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#1E3A8A] font-semibold mb-1">
              SO‘NGGI XABARLAR
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
              Maktab yangiliklari va maqolalar
            </h2>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Yangilik qidirish..."
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1E3A8A]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Controls */}
        <div className="mt-6 flex items-center gap-1.5 overflow-x-auto pb-2">
          {(['Barchasi', ...NEWS_CATEGORIES] as const).map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#1E3A8A] text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Filtered or Latest News Cards */}
        {news.length === 0 ? (
          <div className="mt-10 bg-white rounded-xl border border-slate-200 p-12 text-center">
            <p className="text-base font-medium text-slate-600">
              Hozircha yangiliklar mavjud emas.
            </p>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="mt-10 bg-white rounded-xl border border-slate-200 p-12 text-center">
            <p className="text-base font-medium text-slate-600">
              Hech qanday yangilik topilmadi.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(searchQuery || activeCategory !== 'Barchasi'
              ? filteredNews
              : latestNews
            ).map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div>
                  <div
                    onClick={() => onOpenNewsDetail(item)}
                    className="h-52 w-full cursor-pointer overflow-hidden"
                  >
                    <ResilientImage
                      src={item.imageUrl}
                      alt={item.title}
                      category={item.category}
                      hasVideo={Boolean(item.videoUrl)}
                      className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-200"
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <span className="font-semibold text-[#1E3A8A]">
                        {item.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        {formatUzbekDate(item.createdAt)}
                      </span>
                    </div>

                    <h3
                      onClick={() => onOpenNewsDetail(item)}
                      className="text-xl font-bold text-slate-900 font-serif leading-snug line-clamp-2 hover:text-[#1E3A8A] transition-colors cursor-pointer"
                    >
                      {item.title}
                    </h3>

                    <p className="mt-2.5 text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onOpenNewsDetail(item)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3A8A] hover:text-blue-950 transition-colors cursor-pointer"
                  >
                    <span>Batafsil</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {item.videoUrl && (
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Film className="w-3.5 h-3.5 text-amber-600" />
                      <span>Video</span>
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* IMPORTANT ANNOUNCEMENTS & RECENT EVENTS SPLIT SECTION */}
      <section className="bg-white border-y border-slate-200 py-14 sm:py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Muhim e’lonlar */}
          <div className="lg:col-span-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <p className="text-xs uppercase tracking-widest text-amber-700 font-semibold">
                  RASMIY XABARNOMALAR
                </p>
                <h2 className="text-2xl font-bold text-slate-900 font-serif mt-0.5">
                  Muhim e’lonlar
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('viewer_home', 'E’lonlar')}
                className="text-xs font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
              >
                Barcha e’lonlar →
              </button>
            </div>

            <div className="divide-y divide-slate-200">
              {announcements.length === 0 ? (
                <p className="py-6 text-sm text-slate-500">
                  Hozircha e’lonlar mavjud emas.
                </p>
              ) : (
                announcements.map((ann) => (
                  <div key={ann.id} className="py-5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                      <span className="font-semibold text-amber-700">
                        {ann.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        {formatUzbekDate(ann.createdAt)}
                      </span>
                    </div>
                    <h3
                      onClick={() => onOpenNewsDetail(ann)}
                      className="text-lg font-bold text-slate-900 font-serif hover:text-[#1E3A8A] transition-colors cursor-pointer"
                    >
                      {ann.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-slate-600 line-clamp-2">
                      {ann.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Yaqinda bo‘lib o‘tgan tadbirlar */}
          <div className="lg:col-span-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#1E3A8A] font-semibold">
                  MAKTAB HAYOTI
                </p>
                <h2 className="text-2xl font-bold text-slate-900 font-serif mt-0.5">
                  Tadbirlar va sport
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('viewer_home', 'Tadbirlar')}
                className="text-xs font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
              >
                Barcha tadbirlar →
              </button>
            </div>

            <div className="divide-y divide-slate-200">
              {recentEvents.length === 0 ? (
                <p className="py-6 text-sm text-slate-500">
                  Hozircha tadbirlar mavjud emas.
                </p>
              ) : (
                recentEvents.map((ev) => (
                  <div key={ev.id} className="py-5 flex items-start gap-4">
                    <div
                      onClick={() => onOpenNewsDetail(ev)}
                      className="w-28 h-20 rounded-lg overflow-hidden shrink-0 cursor-pointer border border-slate-200"
                    >
                      <ResilientImage
                        src={ev.imageUrl}
                        alt={ev.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <span className="font-semibold text-[#1E3A8A]">
                          {ev.category}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">
                          {formatUzbekDate(ev.createdAt)}
                        </span>
                      </div>
                      <h3
                        onClick={() => onOpenNewsDetail(ev)}
                        className="text-base font-bold text-slate-900 font-serif line-clamp-2 hover:text-[#1E3A8A] transition-colors cursor-pointer"
                      >
                        {ev.title}
                      </h3>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PHOTO / VIDEO PREVIEWS SECTION */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="flex items-end justify-between pb-6 border-b border-slate-200">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#1E3A8A] font-semibold mb-1">
              FOTO VA VIDEO LAVHALAR
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
              Maktabimiz hayotidan fotogalereya
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('viewer_home', 'Barchasi')}
            className="text-xs font-semibold text-[#1E3A8A] hover:underline cursor-pointer"
          >
            Barchasini ko‘rish →
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {mediaPreviews.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenNewsDetail(item)}
              className="group bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:border-slate-300 transition-colors"
            >
              <div className="h-48 w-full overflow-hidden">
                <ResilientImage
                  src={item.imageUrl}
                  alt={item.title}
                  category={item.category}
                  hasVideo={Boolean(item.videoUrl)}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-[#1E3A8A] font-semibold">
                  {item.category}
                </p>
                <p className="text-sm font-bold text-slate-900 font-serif line-clamp-2 mt-1">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
