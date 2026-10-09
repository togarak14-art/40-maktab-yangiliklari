import { NewsItem, MediaFile, SchoolSettings, AdminStats, NewsCategory } from './types';
import heroCampusImg from './assets/images/school_hero_campus_1791482849534.jpg';
import stemOlympiadImg from './assets/images/news_stem_olympiad_1791482868128.jpg';
import sportsTournamentImg from './assets/images/news_sports_tournament_1791482884831.jpg';
import libraryDigitalImg from './assets/images/news_library_digital_1791482901841.jpg';
import culturalFestivalImg from './assets/images/news_cultural_festival_1791482916835.jpg';

const STORAGE_KEY_NEWS = 'maktab40_news_v2';
const STORAGE_KEY_MEDIA = 'maktab40_media_v2';
const STORAGE_KEY_SETTINGS = 'maktab40_settings_v2';

export const STATIC_ASSET_MAP: Record<string, string> = {
  '/assets/school_campus.jpg': heroCampusImg,
  '/assets/stem_olympiad.jpg': stemOlympiadImg,
  '/assets/sports_tournament.jpg': sportsTournamentImg,
  '/assets/library_digital.jpg': libraryDigitalImg,
  '/assets/cultural_festival.jpg': culturalFestivalImg,
};

export function resolveAssetUrl(url?: string): string {
  if (!url) return '';
  return STATIC_ASSET_MAP[url] || url;
}

export const INITIAL_SETTINGS: SchoolSettings = {
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

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-101',
    title: '40-maktab o‘quvchilari Respublika STEM va Robototexnika olimpiadasida faxrli 1-o‘rinni egalladi',
    content: `Joriy o‘quv yilining eng muhim ilmiy bellashuvlaridan biri bo‘lgan Respublika STEM va zamonaviy robototexnika olimpiadasida 40-maktabning iqtidorli o‘quvchilari jamoasi yuqori natijalarni qayd etib, mutlaq g‘oliblikni qo‘lga kiritdi.

Musobaqada mamlakatimizning barcha hududlaridan 120 dan ortiq jamoa ishtirok etdi. Maktabimizning 10- va 11-sinf o‘quvchilari tomonidan ishlab chiqilgan "Aqlli maktab laboratoriya tizimi" hamda avtonom harakatlanuvchi ekologik robot loyihasi hakamlar hay’ati tomonidan eng yuqori ball bilan baholandi.

"Biz ushbu loyiha ustida so‘nggi to‘rt oy davomida fizika va informatika ustozlarimiz rahbarligida tinimsiz ishladik. Maqsadimiz — maktab laboratoriyalarida xavfsizlik va energiya tejamkorligini avtomatlashtirish edi," — deydi jamoa sardori Sardorbek Alimov.

G‘olib o‘quvchilarimiz Xalq ta’limi vazirligining maxsus diplomi, zamonaviy noutbuklar hamda xalqaro turnirga yo‘llanma bilan taqdirlandilar. Maktab ma’muriyati barcha ishtirokchilarni va ularning ustozlarini ushbu ulkan yutuq bilan samimiy muborakbod etadi!`,
    category: 'Ta’lim',
    imageUrl: stemOlympiadImg,
    videoUrl: '',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    published: true,
    author: 'Maktab ma’muriyati',
    views: 342,
  },
  {
    id: 'news-102',
    title: 'Yangi o‘quv choragi oldidan ota-onalar va o‘quvchilar uchun muhim rasmiy e’lon',
    content: `Hurmatli ota-onalar va aziz o‘quvchilar! 40-umumiy o‘rta ta’lim maktabi ma’muriyati kelgusi haftadan boshlanadigan yangi o‘quv jarayonlari va qo‘shimcha fan to‘garaklari jadvali tasdiqlanganligini ma’lum qiladi.

Barcha sinflarda dars mashg‘ulotlari ertalab soat 08:00 da boshlanadi. O‘quvchilarning maktab hududiga soat 07:45 ga qadar belgilangan maktab formasida va o‘quv qurollari bilan yetib kelishlari so‘raladi.

Shuningdek, joriy oydan boshlab 5–11-sinf o‘quvchilari uchun quyidagi bepul qo‘shimcha to‘garaklar o‘z faoliyatini boshlaydi:
• Chuqurlashtirilgan ingliz tili va IELTS tayyorlov kursi (Seshanba va Payshanba, 14:30)
• Dasturlash asoslari va Sun’iy intellekt (Dushanba va Chorshanba, 15:00)
• Milliy shaxmat va mantiqiy matematika klubi (Juma, 14:00)

To‘garaklarga ro‘yxatdan o‘tish sinf rahbarlari orqali amalga oshiriladi. Farzandingizning bilim olishi va bo‘sh vaqtini mazmunli o‘tkazishiga befarq bo‘lmang!`,
    category: 'E’lonlar',
    imageUrl: heroCampusImg,
    videoUrl: '',
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    published: true,
    author: 'O‘quv ishlari bo‘limi',
    views: 518,
  },
  {
    id: 'news-103',
    title: 'Maktablararo “Yoshlik kubogi” futbol turnirida 40-maktab terma jamoasi finalga yo‘l oldi',
    content: `Tuman miqyosida o‘tkazilayotgan an’anaviy “Yoshlik kubogi” maktablararo futbol musobaqasining yarim final bahslari qizg‘in va murosasiz ruhda bo‘lib o‘tdi.

Maktabimizning yangilangan sun’iy qoplamali stadionida bo‘lib o‘tgan uchrashuvda 40-maktab terma jamoasi 3:1 hisobida ishonchli g‘alabaga erishib, musobaqaning hal qiluvchi final bosqichiga yo‘llanmani naqd qildi. Uchrashuv davomida maktabimizning 9-"A" sinf o‘quvchisi Javohir Rustamov ikkita gol urib, o‘yinning eng yaxshi futbolchisi deb topildi.

Final uchrashuvi kelasi shanba kuni soat 10:00 da maktabimiz bosh maydonida bo‘lib o‘tadi. Barcha o‘quvchilar, o‘qituvchilar va ota-onalarni jamoamizni qo‘llab-quvvatlashga taklif etamiz!`,
    category: 'Sport',
    imageUrl: sportsTournamentImg,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    createdAt: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
    published: true,
    author: 'Jismoniy tarbiya kafedrasi',
    views: 289,
  },
  {
    id: 'news-104',
    title: 'Zamonaviy raqamli kutubxona va “Kitobxonlik haftaligi” tantanali ravishda ochildi',
    content: `40-maktabda o‘quvchilarning kitobga bo‘lgan mehrini oshirish va zamonaviy axborot resurslaridan foydalanish imkoniyatini kengaytirish maqsadida to‘liq ta’mirlangan va raqamlashtirilgan axborot-resurs markazi foydalanishga topshirildi.

Yangi kutubxona fondiga 3 500 dan ortiq badiiy, ilmiy-ommabop va jahon adabiyoti durdonalari, shuningdek, elektron darsliklar bilan jihozlangan 20 ta zamonaviy planshet va kompyuter terminallari keltirildi. Endilikda o‘quvchilar maktab ichki tarmog‘i orqali 10 000 dan ziyod elektron kitoblar va audiokitoblardan bepul foydalanishlari mumkin.

“Kitobxonlik haftaligi” doirasida taniqli yozuvchilar bilan ijodiy uchrashuvlar, “Eng faol kitobxon sinf” ko‘rik-tanlovi hamda adabiy viktorinalar o‘tkazilishi rejalashtirilgan.`,
    category: 'Maktab yangiliklari',
    imageUrl: libraryDigitalImg,
    videoUrl: '',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    published: true,
    author: 'Axborot-resurs markazi',
    views: 410,
  },
  {
    id: 'news-105',
    title: '“Milliy qadriyatlar va yoshlar ijodi” nomli san’at va madaniyat festivali bo‘lib o‘tdi',
    content: `Maktabimizning katta faollar zalida o‘quvchilarning badiiy-estetik didini yuksaltirish va iste’dodli yoshlarni kashf etish maqsadida “Milliy qadriyatlar va yoshlar ijodi” festivali yuqori saviyada tashkil etildi.

Tadbirda 1-sinfdan 11-sinfgacha bo‘lgan 200 nafarga yaqin o‘quvchi o‘zlarining musiqiy chiqishlari, sahna ko‘rinishlari, tasviriy san’at va hunarmandchilik ishlari ko‘rgazmasi bilan qatnashdi. Ayniqsa, maktab xor jamoasi hamda milliy cholg‘u ansamblining jonli ijrosi tomoshabinlarda unutilmas taassurot qoldirdi.

Festival yakunida eng faol sinflar va ijodkor o‘quvchilar faxriy yorliqlar hamda esdalik sovg‘alari bilan mukofotlandi.`,
    category: 'Tadbirlar',
    imageUrl: culturalFestivalImg,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    published: true,
    author: 'Ma’naviyat va ma’rifat bo‘limi',
    views: 376,
  },
  {
    id: 'news-106',
    title: '9–11-sinf bitiruvchilari uchun OTMlarga tayyorgarlik va kasbga yo‘naltirish seminari',
    content: `Bitiruvchi sinf o‘quvchilarining kelajakda to‘g‘ri kasb tanlashi hamda oliy ta’lim muassasalariga kirish imtihonlariga puxta tayyorgarlik ko‘rishini ta’minlash maqsadida maktabimizda yetakchi universitet professor-o‘qituvchilari va IT-mutaxassislar ishtirokida ochiq muloqot o‘tkazildi.

Seminar davomida o‘quvchilarga xalqaro va mahalliy universitetlarning grant dasturlari, zamonaviy mehnat bozorida talab yuqori bo‘lgan muhandislik, tibbiyot, axborot texnologiyalari va moliya yo‘nalishlari haqida batafsil ma’lumot berildi.

O‘quvchilar o‘zlarini qiziqtirgan barcha savollarga mutaxassislardan bevosita javob oldilar va individual maslahat soatlariga yozildilar.`,
    category: 'Ta’lim',
    imageUrl: stemOlympiadImg,
    videoUrl: '',
    createdAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    published: true,
    author: 'Maktab psixologi va kasbga yo‘naltirish bo‘limi',
    views: 265,
  },
];

export const INITIAL_MEDIA: MediaFile[] = [
  {
    id: 'media-1',
    name: '40-maktab bosh binosi (Kampus).jpg',
    url: heroCampusImg,
    type: 'image',
    mimeType: 'image/jpeg',
    size: 482400,
    createdAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
  },
  {
    id: 'media-2',
    name: 'STEM va Robototexnika laboratoriyasi.jpg',
    url: stemOlympiadImg,
    type: 'image',
    mimeType: 'image/jpeg',
    size: 512800,
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
  },
  {
    id: 'media-3',
    name: 'Yoshlik kubogi futbol musobaqasi.jpg',
    url: sportsTournamentImg,
    type: 'image',
    mimeType: 'image/jpeg',
    size: 624100,
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
  {
    id: 'media-4',
    name: 'Zamonaviy raqamli kutubxona.jpg',
    url: libraryDigitalImg,
    type: 'image',
    mimeType: 'image/jpeg',
    size: 495300,
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
  },
  {
    id: 'media-5',
    name: 'San’at va madaniyat festivali.jpg',
    url: culturalFestivalImg,
    type: 'image',
    mimeType: 'image/jpeg',
    size: 558900,
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'media-6',
    name: 'Sport musobaqasi lavhasi (Video).mp4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    type: 'video',
    mimeType: 'video/mp4',
    size: 2458000,
    createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
  },
];

export function getLocalNews(): NewsItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NEWS);
    if (raw) {
      const parsed: NewsItem[] = JSON.parse(raw);
      return parsed.map((n) => ({
        ...n,
        imageUrl: resolveAssetUrl(n.imageUrl),
      }));
    }
  } catch {
    // ignore
  }
  localStorage.setItem(STORAGE_KEY_NEWS, JSON.stringify(INITIAL_NEWS));
  return INITIAL_NEWS;
}

export function saveLocalNews(news: NewsItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_NEWS, JSON.stringify(news));
  } catch {
    // ignore
  }
}

export function getLocalMedia(): MediaFile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MEDIA);
    if (raw) {
      const parsed: MediaFile[] = JSON.parse(raw);
      return parsed.map((m) => ({
        ...m,
        url: resolveAssetUrl(m.url),
      }));
    }
  } catch {
    // ignore
  }
  localStorage.setItem(STORAGE_KEY_MEDIA, JSON.stringify(INITIAL_MEDIA));
  return INITIAL_MEDIA;
}

export function saveLocalMedia(media: MediaFile[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_MEDIA, JSON.stringify(media));
  } catch {
    // ignore
  }
}

export function getLocalSettings(): SchoolSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  return INITIAL_SETTINGS;
}

export function saveLocalSettings(settings: SchoolSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function computeLocalStats(): AdminStats {
  const news = getLocalNews();
  const media = getLocalMedia();
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const totalNews = news.length;
  const todayNews = news.filter((n) => new Date(n.createdAt).getTime() >= startOfToday).length;
  const totalViews = news.reduce((acc, n) => acc + (n.views || 0), 0);
  const totalAnnouncements = news.filter((n) => n.category === 'E’lonlar').length;

  const categories: NewsCategory[] = [
    'Maktab yangiliklari',
    'Tadbirlar',
    'E’lonlar',
    'Sport',
    'Ta’lim',
  ];

  const categoryBreakdown = categories.map((cat) => {
    const items = news.filter((n) => n.category === cat);
    return {
      category: cat,
      count: items.length,
      views: items.reduce((sum, i) => sum + (i.views || 0), 0),
    };
  });

  return {
    totalNews,
    todayNews,
    totalViews,
    totalAnnouncements,
    totalMedia: media.length,
    categoryBreakdown,
  };
}
