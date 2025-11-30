# KOBİ Kredit Platforması

AI əsaslı skorlaşdırma sistemi ilə Azərbaycanda kiçik və orta sahibkarlara kredit tapmaq prosesini sadələşdirən rəqəmsal fintech platforması.

## 🚀 Xüsusiyyətlər

- ✅ **AI Skorlaşdırma**: 7 kriteriyanı əhatə edən smart skorlaşdırma sistemi
- ✅ **ASAN İmza İnteqrasiyası**: Mock authentication (real API inteqrasiyası gələcəkdə)
- ✅ **Multi-BOKT Agregator**: Bir platformada bütün BOKT-lərin kredit təklifləri
- ✅ **Şəffaf Hesablamalar**: Hər kriteriyanın skorunuza təsiri aydın göstərilir
- ✅ **Responsive Design**: Desktop və mobil cihazlarda mükəmməl işləyir
- ✅ **Modern UI**: Tailwind CSS və shadcn/ui ilə professional görünüş

## 📋 Tələblər

- Node.js 18+ 
- npm 9+

## 🛠️ Quraşdırma

1. Dependencies quraşdırın:
```bash
npm install
```

2. Development server başladın:
```bash
npm run dev
```

3. Brauzerinizə [http://localhost:3000](http://localhost:3000) açın

## 📁 Proyekt Strukturu

```
kobi-kredit-platform/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── score/           # Scoring endpoints
│   │   └── bokt/            # BOKT endpoints
│   ├── dashboard/           # Dashboard page
│   ├── kredits/             # Credit application page
│   ├── login/               # Login page
│   └── page.tsx             # Landing page
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── ScoreGauge.tsx       # Score visualization
│   ├── BOKTCard.tsx         # BOKT card component
│   ├── CriteriaBreakdown.tsx # Score breakdown
│   └── AIExplanation.tsx    # AI recommendations
├── lib/                     # Utility functions
│   ├── scoring-engine.ts    # Credit scoring logic
│   ├── matching-engine.ts   # BOKT matching logic
│   ├── mock-data.ts         # Mock data helpers
│   └── utils.ts             # General utilities
└── public/                  # Static files
    ├── mock-kobi-data.json  # Demo company data
    └── bokt-list.json       # BOKT institutions data
```

## 🎯 İstifadə Axını

1. **Landing Page**: Ana səhifədə platformanın xüsusiyyətlərini görün
2. **Login**: 3 demo şirkətdən birini seçin (ASAN İmza simulyasiyası)
3. **Dashboard**: Kredit skorunuzu və detallı breakdown-u görün
4. **Kredit Müraciəti**: 
   - Uyğun BOKT seçin
   - Kredit məhsulu seçin
   - Məbləğ və müddət daxil edin
   - Müraciət göndərin

## 👥 Demo İstifadəçilər

### 1. TechHub MMC (Yüksək Skor)
- **VÖEN**: 1234567890
- **Sektor**: IT
- **Aylıq Dövriyyə**: 65,000 AZN
- **Gözlənilən Skor**: ~4.2/5.0

### 2. GülShop MMC (Aşağı Skor)
- **VÖEN**: 9876543210
- **Sektor**: Ticarət
- **Aylıq Dövriyyə**: 18,000 AZN
- **Vergi Borcu**: 1,500 AZN
- **Gözlənilən Skor**: ~1.8/5.0

### 3. BuildPro MMC (Orta Skor)
- **VÖEN**: 5555555555
- **Sektor**: Tikinti
- **Aylıq Dövriyyə**: 120,000 AZN
- **Gözlənilən Skor**: ~3.4/5.0

## 🏦 BOKT-lər

1. **MCB BOKT** - Minimum skor: 2.5, Faiz: 18-24%
2. **KredAqro BOKT** - Minimum skor: 2.0, Faiz: 22-28%
3. **Qafqaz Kredit BOKT** - Minimum skor: 3.0, Faiz: 16-22%

## 🧮 Skorlaşdırma Kriteriləri

| Kriteriya | Çəki |
|-----------|------|
| Aylıq Dövriyyə | 20% |
| Şirkət Yaşı | 15% |
| Xalis Gəlir | 15% |
| Vergi Borcu | 15% |
| Sektor Riski | 10% |
| İşçi Sayı | 5% |
| Cashflow | 5% |

## 🚀 Deployment

### Vercel (Tövsiyə edilir)

1. Vercel-ə qeydiyyatdan keçin
2. GitHub repository-ni bağlayın
3. Auto-deploy aktivləşir

```bash
# və ya Vercel CLI ilə
npm install -g vercel
vercel --prod
```

## 📝 Environment Variables

`.env.local` faylı:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_ASAN_IMZA_MOCK=true
```

## 🔮 Gələcək Təkmilləşdirmələr

- [ ] Real ASAN İmza API inteqrasiyası
- [ ] PostgreSQL database
- [ ] Real BOKT tərəfdaşlıqları
- [ ] Email bildirişləri
- [ ] Kredit müqavilə tracking
- [ ] Admin panel
- [ ] Mobile app (React Native)
- [ ] TensorFlow.js model training
- [ ] Analytics dashboard

## 📄 Lisenziya

© 2025 KOBİ Kredit Platforması - Azərbaycan Hackathon 2025

## 🤝 Komanda

MVP Development Team - 48 saat challenge

---

**"Kredit almağı bir klik qədər asan etmək"**
