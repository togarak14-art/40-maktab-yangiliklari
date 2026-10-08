export type NewsCategory =
  | 'Maktab yangiliklari'
  | 'Tadbirlar'
  | 'E’lonlar'
  | 'Sport'
  | 'Ta’lim';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: NewsCategory;
  imageUrl: string;
  videoUrl: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  author: string;
  views: number;
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  mimeType: string;
  size: number;
  createdAt: string;
}

export interface SchoolSettings {
  schoolName: string;
  subtitle: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  directorName: string;
  studentCount: number;
  teacherCount: number;
  foundedYear: number;
}

export interface AdminStats {
  totalNews: number;
  todayNews: number;
  totalViews: number;
  totalAnnouncements: number;
  totalMedia: number;
  categoryBreakdown: {
    category: NewsCategory;
    count: number;
    views: number;
  }[];
}

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type AppView =
  | 'home'
  | 'viewer_home'
  | 'news_detail'
  | 'auth_choice'
  | 'admin_login'
  | 'viewer_login'
  | 'admin_dashboard'
  | 'about';

export type AdminTab =
  | 'overview'
  | 'news_list'
  | 'create_news'
  | 'media'
  | 'stats'
  | 'settings';

export const NEWS_CATEGORIES: NewsCategory[] = [
  'Maktab yangiliklari',
  'Tadbirlar',
  'E’lonlar',
  'Sport',
  'Ta’lim',
];

export function formatUzbekDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    const months = [
      'yanvar',
      'fevral',
      'mart',
      'aprel',
      'may',
      'iyun',
      'iyul',
      'avgust',
      'sentyabr',
      'oktyabr',
      'noyabr',
      'dekabr',
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}, ${year}-yil · ${hours}:${minutes}`;
  } catch {
    return isoString;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}
