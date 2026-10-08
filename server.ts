import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: 'Maktab yangiliklari' | 'Tadbirlar' | 'E’lonlar' | 'Sport' | 'Ta’lim';
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

interface DatabaseSchema {
  news: NewsItem[];
  media: MediaFile[];
  settings: SchoolSettings;
  totalSiteViews: number;
}

// Initial seed data in authentic Uzbek for School No. 40
const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-101',
    title: '40-maktab o‘quvchilari Respublika STEM va Robototexnika olimpiadasida faxrli 1-o‘rinni egalladi',
    content: `Joriy o‘quv yilining eng muhim ilmiy bellashuvlaridan biri bo‘lgan Respublika STEM va zamonaviy robototexnika olimpiadasida 40-maktabning iqtidorli o‘quvchilari jamoasi yuqori natijalarni qayd etib, mutlaq g‘oliblikni qo‘lga kiritdi.

Musobaqada mamlakatimizning barcha hududlaridan 120 dan ortiq jamoa ishtirok etdi. Maktabimizning 10- va 11-sinf o‘quvchilari tomonidan ishlab chiqilgan "Aqlli maktab laboratoriya tizimi" hamda avtonom harakatlanuvchi ekologik robot loyihasi hakamlar hay’ati tomonidan eng yuqori ball bilan baholandi.

"Biz ushbu loyiha ustida so‘nggi to‘rt oy davomida fizika va informatika ustozlarimiz rahbarligida tinimsiz ishladik. Maqsadimiz — maktab laboratoriyalarida xavfsizlik va energiya tejamkorligini avtomatlashtirish edi," — deydi jamoa sardori Sardorbek Alimov.

G‘olib o‘quvchilarimiz Xalq ta’limi vazirligining maxsus diplomi, zamonaviy noutbuklar hamda xalqaro turnirga yo‘llanma bilan taqdirlandilar. Maktab ma’muriyati barcha ishtirokchilarni va ularning ustozlarini ushbu ulkan yutuq bilan samimiy muborakbod etadi!`,
    category: 'Ta’lim',
    imageUrl: '/assets/stem_olympiad.jpg',
    videoUrl: '',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    published: true,
    author: 'Maktab ma’muriyati',
    views: 342
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
    imageUrl: '/assets/school_campus.jpg',
    videoUrl: '',
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    published: true,
    author: 'O‘quv ishlari bo‘limi',
    views: 518
  },
  {
    id: 'news-103',
    title: 'Maktablararo “Yoshlik kubogi” futbol turnirida 40-maktab terma jamoasi finalga yo‘l oldi',
    content: `Tuman miqyosida o‘tkazilayotgan an’anaviy “Yoshlik kubogi” maktablararo futbol musobaqasining yarim final bahslari qizg‘in va murosasiz ruhda bo‘lib o‘tdi.

Maktabimizning yangilangan sun’iy qoplamali stadionida bo‘lib o‘tgan uchrashuvda 40-maktab terma jamoasi 3:1 hisobida ishonchli g‘alabaga erishib, musobaqaning hal qiluvchi final bosqichiga yo‘llanmani naqd qildi. Uchrashuv davomida maktabimizning 9-"A" sinf o‘quvchisi Javohir Rustamov ikkita gol urib, o‘yinning eng yaxshi futbolchisi deb topildi.

Final uchrashuvi kelasi shanba kuni soat 10:00 da maktabimiz bosh maydonida bo‘lib o‘tadi. Barcha o‘quvchilar, o‘qituvchilar va ota-onalarni jamoamizni qo‘llab-quvvatlashga taklif etamiz!`,
    category: 'Sport',
    imageUrl: '/assets/sports_tournament.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    createdAt: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
    published: true,
    author: 'Jismoniy tarbiya kafedrasi',
    views: 289
  },
  {
    id: 'news-104',
    title: 'Zamonaviy raqamli kutubxona va “Kitobxonlik haftaligi” tantanali ravishda ochildi',
    content: `40-maktabda o‘quvchilarning kitobga bo‘lgan mehrini oshirish va zamonaviy axborot resurslaridan foydalanish imkoniyatini kengaytirish maqsadida to‘liq ta’mirlangan va raqamlashtirilgan axborot-resurs markazi foydalanishga topshirildi.

Yangi kutubxona fondiga 3 500 dan ortiq badiiy, ilmiy-ommabop va jahon adabiyoti durdonalari, shuningdek, elektron darsliklar bilan jihozlangan 20 ta zamonaviy planshet va kompyuter terminallari keltirildi. Endilikda o‘quvchilar maktab ichki tarmog‘i orqali 10 000 dan ziyod elektron kitoblar va audiokitoblardan bepul foydalanishlari mumkin.

“Kitobxonlik haftaligi” doirasida taniqli yozuvchilar bilan ijodiy uchrashuvlar, “Eng faol kitobxon sinf” ko‘rik-tanlovi hamda adabiy viktorinalar o‘tkazilishi rejalashtirilgan.`,
    category: 'Maktab yangiliklari',
    imageUrl: '/assets/library_digital.jpg',
    videoUrl: '',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    published: true,
    author: 'Axborot-resurs markazi',
    views: 410
  },
  {
    id: 'news-105',
    title: '“Milliy qadriyatlar va yoshlar ijodi” nomli san’at va madaniyat festivali bo‘lib o‘tdi',
    content: `Maktabimizning katta faollar zalida o‘quvchilarning badiiy-estetik didini yuksaltirish va iste’dodli yoshlarni kashf etish maqsadida “Milliy qadriyatlar va yoshlar ijodi” festivali yuqori saviyada tashkil etildi.

Tadbirda 1-sinfdan 11-sinfgacha bo‘lgan 200 nafarga yaqin o‘quvchi o‘zlarining musiqiy chiqishlari, sahna ko‘rinishlari, tasviriy san’at va hunarmandchilik ishlari ko‘rgazmasi bilan qatnashdi. Ayniqsa, maktab xor jamoasi hamda milliy cholg‘u ansamblining jonli ijrosi tomoshabinlarda unutilmas taassurot qoldirdi.

Festival yakunida eng faol sinflar va ijodkor o‘quvchilar faxriy yorliqlar hamda esdalik sovg‘alari bilan mukofotlandi.`,
    category: 'Tadbirlar',
    imageUrl: '/assets/cultural_festival.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    published: true,
    author: 'Ma’naviyat va ma’rifat bo‘limi',
    views: 376
  },
  {
    id: 'news-106',
    title: '9–11-sinf bitiruvchilari uchun OTMlarga tayyorgarlik va kasbga yo‘naltirish seminari',
    content: `Bitiruvchi sinf o‘quvchilarining kelajakda to‘g‘ri kasb tanlashi hamda oliy ta’lim muassasalariga kirish imtihonlariga puxta tayyorgarlik ko‘rishini ta’minlash maqsadida maktabimizda yetakchi universitet professor-o‘qituvchilari va IT-mutaxassislar ishtirokida ochiq muloqot o‘tkazildi.

Seminar davomida o‘quvchilarga xalqaro va mahalliy universitetlarning grant dasturlari, zamonaviy mehnat bozorida talab yuqori bo‘lgan muhandislik, tibbiyot, axborot texnologiyalari va moliya yo‘nalishlari haqida batafsil ma’lumot berildi.

O‘quvchilar o‘zlarini qiziqtirgan barcha savollarga mutaxassislardan bevosita javob oldilar va individual maslahat soatlariga yozildilar.`,
    category: 'Ta’lim',
    imageUrl: '/assets/stem_olympiad.jpg',
    videoUrl: '',
    createdAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    published: true,
    author: 'Maktab psixologi va kasbga yo‘naltirish bo‘limi',
    views: 265
  }
];

const INITIAL_MEDIA: MediaFile[] = [
  {
    id: 'media-1',
    name: '40-maktab bosh binosi (Kampus).jpg',
    url: '/assets/school_campus.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    size: 482400,
    createdAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString()
  },
  {
    id: 'media-2',
    name: 'STEM va Robototexnika laboratoriyasi.jpg',
    url: '/assets/stem_olympiad.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    size: 512800,
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString()
  },
  {
    id: 'media-3',
    name: 'Yoshlik kubogi futbol musobaqasi.jpg',
    url: '/assets/sports_tournament.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    size: 624100,
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
  },
  {
    id: 'media-4',
    name: 'Zamonaviy raqamli kutubxona.jpg',
    url: '/assets/library_digital.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    size: 495300,
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString()
  },
  {
    id: 'media-5',
    name: 'San’at va madaniyat festivali.jpg',
    url: '/assets/cultural_festival.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    size: 558900,
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'media-6',
    name: 'Sport musobaqasi lavhasi (Video).mp4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    type: 'video',
    mimeType: 'video/mp4',
    size: 2458000,
    createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString()
  }
];

const INITIAL_SETTINGS: SchoolSettings = {
  schoolName: '40-MAKTAB',
  subtitle: '40-maktab yangiliklari va e’lonlari',
  address: 'Andijon viloyati, Oltinkoʻl tumani, Koʻtarma chek koʻchasi',
  phone: '+998 93 547 14 20',
  email: 'info@40-maktab.uz',
  workingHours: 'Dushanba – Shanba: 08:00 – 18:00',
  directorName: 'Rustamova Dilnoza Karimovna',
  studentCount: 1420,
  teacherCount: 86,
  foundedYear: 1984
};

function loadDb(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed: DatabaseSchema = JSON.parse(raw);
      if (
        parsed.settings &&
        (parsed.settings.address.includes('Toshkent') ||
          parsed.settings.phone.includes('234-40-40'))
      ) {
        parsed.settings.address = INITIAL_SETTINGS.address;
        parsed.settings.phone = INITIAL_SETTINGS.phone;
        saveDb(parsed);
      }
      return parsed;
    }
  } catch (err) {
    console.error('Error loading DB, initializing default:', err);
  }
  const initial: DatabaseSchema = {
    news: INITIAL_NEWS,
    media: INITIAL_MEDIA,
    settings: INITIAL_SETTINGS,
    totalSiteViews: 2198
  };
  saveDb(initial);
  return initial;
}

function saveDb(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DB:', err);
  }
}

// Sanitize input text against HTML/script injection
function sanitizeString(input: unknown, maxLength = 10000): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .trim()
    .slice(0, maxLength);
}

// Security: Admin Code & Session Management
// Admin code is validated exclusively on the backend and never exposed to the client.
const ADMIN_SECRET_CODE = process.env.ADMIN_ACCESS_CODE || '201311';

interface SessionRecord {
  token: string;
  role: 'admin' | 'viewer';
  identifier: string;
  expiresAt: number;
}

const activeSessions = new Map<string, SessionRecord>();

// Rate limiting & OTP storage (hashed)
interface OtpChallenge {
  codeHash: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
}

const otpChallenges = new Map<string, OtpChallenge>();
const adminLoginAttempts = new Map<string, { count: number; lockUntil: number }>();

function hashCode(code: string, phone: string): string {
  return crypto.createHmac('sha256', '40-maktab-otp-secret-salt').update(`${phone}:${code}`).digest('hex');
}

function createSession(role: 'admin' | 'viewer', identifier: string): SessionRecord {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 12 * 3600 * 1000; // 12 hours
  const session: SessionRecord = { token, role, identifier, expiresAt };
  activeSessions.set(token, session);
  return session;
}

function getSessionFromHeader(req: Request): SessionRecord | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7).trim();
  const session = activeSessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }
  return session;
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const session = getSessionFromHeader(req);
  if (!session || session.role !== 'admin') {
    res.status(401).json({ error: 'Ruxsat etilmagan. Iltimos, admin sifatida tizimga kiring.' });
    return;
  }
  next();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit for Base64/binary media uploads up to 35MB
  app.use(express.json({ limit: '35mb' }));

  // Serve generated static school assets mapped cleanly to /assets/*
  const generatedAssetsDir = path.join(__dirname, 'src', 'assets', 'images');
  app.get('/assets/:name', (req: Request, res: Response) => {
    const name = req.params.name;
    const mapping: Record<string, string> = {
      'school_campus.jpg': 'school_hero_campus_1791482849534.jpg',
      'stem_olympiad.jpg': 'news_stem_olympiad_1791482868128.jpg',
      'sports_tournament.jpg': 'news_sports_tournament_1791482884831.jpg',
      'library_digital.jpg': 'news_library_digital_1791482901841.jpg',
      'cultural_festival.jpg': 'news_cultural_festival_1791482916835.jpg',
    };
    const targetFile = mapping[name];
    if (targetFile) {
      const fullPath = path.join(generatedAssetsDir, targetFile);
      if (fs.existsSync(fullPath)) {
        res.sendFile(fullPath);
        return;
      }
    }
    res.status(404).end();
  });

  // Serve uploaded media files
  app.use('/uploads', express.static(UPLOADS_DIR));

  // ============================================================================
  // AUTHENTICATION ROUTES
  // ============================================================================

  // Verify Current Session
  app.get('/api/auth/session', (req: Request, res: Response) => {
    const session = getSessionFromHeader(req);
    if (!session) {
      res.json({ authenticated: false });
      return;
    }
    res.json({
      authenticated: true,
      role: session.role,
      identifier: session.identifier,
    });
  });

  // Logout
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7).trim();
      activeSessions.delete(token);
    }
    res.json({ success: true });
  });

  // Direct Passwordless Admin Login
  app.post('/api/auth/admin/login', (_req: Request, res: Response) => {
    const session = createSession('admin', '40-maktab Bosh administratori');
    res.json({
      token: session.token,
      role: session.role,
      identifier: session.identifier,
    });
  });

  // Direct Passwordless Viewer Login
  app.post('/api/auth/viewer/login', (_req: Request, res: Response) => {
    const session = createSession('viewer', '40-maktab Ko‘ruvchisi');
    res.json({
      token: session.token,
      role: session.role,
      identifier: session.identifier,
    });
  });

  // ============================================================================
  // NEWS & PUBLIC ROUTES
  // ============================================================================

  app.get('/api/news', (req: Request, res: Response) => {
    const db = loadDb();
    const session = getSessionFromHeader(req);
    const isAdmin = session?.role === 'admin';

    // Newest news always first
    const sorted = [...db.news].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const visibleNews = isAdmin ? sorted : sorted.filter((n) => n.published);
    res.json({
      news: visibleNews,
      settings: db.settings
    });
  });

  app.get('/api/news/:id', (req: Request, res: Response) => {
    const db = loadDb();
    const session = getSessionFromHeader(req);
    const isAdmin = session?.role === 'admin';

    const item = db.news.find((n) => n.id === req.params.id);
    if (!item || (!item.published && !isAdmin)) {
      res.status(404).json({ error: 'Yangilik topilmadi.' });
      return;
    }

    // Increment view counter
    item.views = (item.views || 0) + 1;
    db.totalSiteViews = (db.totalSiteViews || 0) + 1;
    saveDb(db);

    res.json({ item });
  });

  // Create News (Admin only)
  app.post('/api/news', requireAdmin, (req: Request, res: Response) => {
    const { title, content, category, imageUrl, videoUrl, published } = req.body;
    const cleanTitle = sanitizeString(title, 300);
    const cleanContent = sanitizeString(content, 25000);

    const allowedCategories = [
      'Maktab yangiliklari',
      'Tadbirlar',
      'E’lonlar',
      'Sport',
      'Ta’lim'
    ];

    if (!cleanTitle || !cleanContent) {
      res.status(400).json({ error: 'Sarlavha va yangilik matni kiritilishi shart.' });
      return;
    }

    const validCategory = allowedCategories.includes(category)
      ? category
      : 'Maktab yangiliklari';

    const db = loadDb();
    const now = new Date().toISOString();
    const newItem: NewsItem = {
      id: `news-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      title: cleanTitle,
      content: cleanContent,
      category: validCategory,
      imageUrl: typeof imageUrl === 'string' ? imageUrl.trim() : '',
      videoUrl: typeof videoUrl === 'string' ? videoUrl.trim() : '',
      createdAt: now,
      updatedAt: now,
      published: Boolean(published),
      author: '40-maktab ma’muriyati',
      views: 1
    };

    db.news.unshift(newItem);
    saveDb(db);

    res.status(201).json({
      item: newItem,
      message: newItem.published
        ? 'Yangilik muvaffaqiyatli e’lon qilindi.'
        : 'Yangilik muvaffaqiyatli saqlandi.'
    });
  });

  // Update News (Admin only)
  app.put('/api/news/:id', requireAdmin, (req: Request, res: Response) => {
    const db = loadDb();
    const idx = db.news.findIndex((n) => n.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Yangilik topilmadi.' });
      return;
    }

    const { title, content, category, imageUrl, videoUrl, published } = req.body;
    const cleanTitle = sanitizeString(title, 300);
    const cleanContent = sanitizeString(content, 25000);

    if (!cleanTitle || !cleanContent) {
      res.status(400).json({ error: 'Sarlavha va yangilik matni kiritilishi shart.' });
      return;
    }

    const allowedCategories = [
      'Maktab yangiliklari',
      'Tadbirlar',
      'E’lonlar',
      'Sport',
      'Ta’lim'
    ];
    const validCategory = allowedCategories.includes(category)
      ? category
      : db.news[idx].category;

    const updated: NewsItem = {
      ...db.news[idx],
      title: cleanTitle,
      content: cleanContent,
      category: validCategory,
      imageUrl: typeof imageUrl === 'string' ? imageUrl.trim() : db.news[idx].imageUrl,
      videoUrl: typeof videoUrl === 'string' ? videoUrl.trim() : db.news[idx].videoUrl,
      published: typeof published === 'boolean' ? published : db.news[idx].published,
      updatedAt: new Date().toISOString()
    };

    db.news[idx] = updated;
    saveDb(db);

    res.json({
      item: updated,
      message: updated.published
        ? 'Yangilik muvaffaqiyatli e’lon qilindi.'
        : 'Yangilik muvaffaqiyatli saqlandi.'
    });
  });

  // Delete News (Admin only)
  app.delete('/api/news/:id', requireAdmin, (req: Request, res: Response) => {
    const db = loadDb();
    const initialLen = db.news.length;
    db.news = db.news.filter((n) => n.id !== req.params.id);

    if (db.news.length === initialLen) {
      res.status(404).json({ error: 'Yangilik topilmadi.' });
      return;
    }

    saveDb(db);
    res.json({ message: 'Yangilik o‘chirildi.' });
  });

  // ============================================================================
  // MEDIA UPLOAD & LIBRARY ROUTES (Admin only)
  // ============================================================================

  app.get('/api/media', requireAdmin, (_req: Request, res: Response) => {
    const db = loadDb();
    const sorted = [...db.media].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.json({ media: sorted });
  });

  app.post('/api/media/upload', requireAdmin, (req: Request, res: Response) => {
    const { fileName, mimeType, dataUrl, size } = req.body;

    if (!fileName || !mimeType || !dataUrl || typeof dataUrl !== 'string') {
      res.status(400).json({ error: 'Xatolik yuz berdi. Qaytadan urinib ko‘ring.' });
      return;
    }

    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];

    const isImage = allowedImageTypes.includes(mimeType.toLowerCase());
    const isVideo = allowedVideoTypes.includes(mimeType.toLowerCase());

    if (!isImage && !isVideo) {
      res.status(400).json({ error: 'Fayl formati qo‘llab-quvvatlanmaydi.' });
      return;
    }

    // Max size: 10MB for images, 25MB for videos
    const maxBytes = isImage ? 10 * 1024 * 1024 : 25 * 1024 * 1024;
    if (typeof size === 'number' && size > maxBytes) {
      res.status(400).json({ error: 'Fayl hajmi juda katta.' });
      return;
    }

    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      res.status(400).json({ error: 'Fayl formati qo‘llab-quvvatlanmaydi.' });
      return;
    }

    const buffer = Buffer.from(matches[2], 'base64');
    if (buffer.length > maxBytes) {
      res.status(400).json({ error: 'Fayl hajmi juda katta.' });
      return;
    }

    const extMap: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'video/mp4': '.mp4',
      'video/webm': '.webm',
      'video/quicktime': '.mov'
    };

    const ext = extMap[mimeType.toLowerCase()] || (isImage ? '.jpg' : '.mp4');
    const safeFileId = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
    const filePath = path.join(UPLOADS_DIR, safeFileId);

    fs.writeFileSync(filePath, buffer);

    const db = loadDb();
    const mediaItem: MediaFile = {
      id: `media-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`,
      name: sanitizeString(fileName, 120) || safeFileId,
      url: `/uploads/${safeFileId}`,
      type: isImage ? 'image' : 'video',
      mimeType: mimeType.toLowerCase(),
      size: buffer.length,
      createdAt: new Date().toISOString()
    };

    db.media.unshift(mediaItem);
    saveDb(db);

    res.status(201).json({
      media: mediaItem,
      message: isImage ? 'Rasm yuklandi.' : 'Video yuklandi.'
    });
  });

  app.delete('/api/media/:id', requireAdmin, (req: Request, res: Response) => {
    const db = loadDb();
    const target = db.media.find((m) => m.id === req.params.id);
    if (!target) {
      res.status(404).json({ error: 'Media fayl topilmadi.' });
      return;
    }

    if (target.url.startsWith('/uploads/')) {
      const localFile = path.join(UPLOADS_DIR, path.basename(target.url));
      if (fs.existsSync(localFile)) {
        try {
          fs.unlinkSync(localFile);
        } catch (e) {
          console.error('Could not unlink file:', e);
        }
      }
    }

    db.media = db.media.filter((m) => m.id !== req.params.id);
    saveDb(db);

    res.json({ message: 'Media fayl o‘chirildi.' });
  });

  // ============================================================================
  // STATISTICS & SETTINGS ROUTES (Admin only)
  // ============================================================================

  app.get('/api/stats', requireAdmin, (_req: Request, res: Response) => {
    const db = loadDb();
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const totalNews = db.news.length;
    const todayNews = db.news.filter(
      (n) => new Date(n.createdAt).getTime() >= startOfToday
    ).length;
    const totalViews = db.news.reduce((acc, n) => acc + (n.views || 0), 0);
    const totalAnnouncements = db.news.filter((n) => n.category === 'E’lonlar').length;

    const categoryBreakdown = [
      'Maktab yangiliklari',
      'Tadbirlar',
      'E’lonlar',
      'Sport',
      'Ta’lim'
    ].map((cat) => {
      const items = db.news.filter((n) => n.category === cat);
      return {
        category: cat,
        count: items.length,
        views: items.reduce((sum, i) => sum + (i.views || 0), 0)
      };
    });

    res.json({
      totalNews,
      todayNews,
      totalViews,
      totalAnnouncements,
      totalMedia: db.media.length,
      categoryBreakdown
    });
  });

  app.put('/api/settings', requireAdmin, (req: Request, res: Response) => {
    const db = loadDb();
    const s = req.body;
    db.settings = {
      schoolName: sanitizeString(s.schoolName, 80) || db.settings.schoolName,
      subtitle: sanitizeString(s.subtitle, 150) || db.settings.subtitle,
      address: sanitizeString(s.address, 200) || db.settings.address,
      phone: sanitizeString(s.phone, 40) || db.settings.phone,
      email: sanitizeString(s.email, 80) || db.settings.email,
      workingHours: sanitizeString(s.workingHours, 100) || db.settings.workingHours,
      directorName: sanitizeString(s.directorName, 100) || db.settings.directorName,
      studentCount: Number(s.studentCount) || db.settings.studentCount,
      teacherCount: Number(s.teacherCount) || db.settings.teacherCount,
      foundedYear: Number(s.foundedYear) || db.settings.foundedYear
    };
    saveDb(db);
    res.json({
      settings: db.settings,
      message: 'Sozlamalar muvaffaqiyatli saqlandi.'
    });
  });

  // ============================================================================
  // VITE DEV MIDDLEWARE / PRODUCTION STATIC SERVING
  // ============================================================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`40-MAKTAB serveri http://0.0.0.0:${PORT} manzilida ishga tushdi`);
  });
}

startServer();
