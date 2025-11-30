# 🚀 KOBİ Kredit Platform - Setup Guide

Bu layihəni başqa bir kompüterdə işə salmaq üçün aşağıdakı addımları izləyin.

## 📋 Tələblər (Prerequisites)

Layihəni işə salmazdan əvvəl kompüterinizdə aşağıdakıların yüklü olduğundan əmin olun:

1.  **Node.js**: (Versiya 18 və ya daha yüksək)
    *   Yükləmək üçün: [nodejs.org](https://nodejs.org/)
2.  **Git**: (Layihəni klonlamaq üçün)
    *   Yükləmək üçün: [git-scm.com](https://git-scm.com/)
3.  **pnpm** (Tövsiyə olunur) və ya **npm**:
    *   Node.js yükləndikdən sonra terminalda bu əmri yazın: `npm install -g pnpm`

---

## 🛠️ Quraşdırma (Installation)

### 1. Layihəni Klonlayın və ya Köçürün
Layihə qovluğunu yeni kompüterə köçürün və ya Git-dən klonlayın.
Terminalı (Command Prompt və ya PowerShell) açın və layihə qovluğuna daxil olun:

```bash
cd kobi-main/kobi-main
```

### 2. Asılılıqları Yükləyin (Install Dependencies)
Bütün lazımi kitabxanaları yükləmək üçün aşağıdakı əmri icra edin:

```bash
pnpm install
# və ya npm istifadə edirsinizsə:
npm install
```

### 3. Mühit Dəyişənlərini Tənzimləyin (.env)
Layihənin kök qovluğunda `.env` faylı yaradın (əgər yoxdursa) və aşağıdakı məlumatları əlavə edin:

```env
# Google Gemini API Key (AI Chatbot üçün vacibdir)
GEMINI_API_KEY=sizin_gemini_api_key_buraya

# Server Port (Varsayılan: 3001)
PORT=3001
```
*Qeyd: `GEMINI_API_KEY` olmadan chatbot işləməyəcək.*

---

## ▶️ İşə Salma (Running the App)

Layihəni inkişaf rejimində (development mode) işə salmaq üçün:

```bash
pnpm dev
# və ya
npm run dev
```

Bu əmr həm **Frontend** (Vite), həm də **Backend** (Express) serverlərini eyni anda işə salacaq.

Terminalda aşağıdakı kimi bir yazı görəcəksiniz:
```
  VITE vX.X.X  ready in XXX ms

  ➜  Local:   http://localhost:8080/
```

Brauzerdə **http://localhost:8080** ünvanına daxil olun.

---

## ❓ Tez-tez Rast Gəlinən Problemlər (Troubleshooting)

**1. `Port 8080 is in use` xətası:**
Əgər 8080 portu məşğuldursa, Vite avtomatik olaraq növbəti portu (məsələn, 8081) seçəcək. Terminaldakı "Local" ünvanına diqqət yetirin.

**2. `GEMINI_API_KEY` xətası:**
Chatbot işləmirsə, `.env` faylını yoxlayın və düzgün API açarını qeyd etdiyinizdən əmin olun.

**3. Modul tapılmadı xətaları:**
Əgər `Cannot find module` kimi xətalar alırsınızsa, `node_modules` qovluğunu silib yenidən yükləyin:
```bash
rm -rf node_modules
pnpm install
```

---

## 📞 Dəstək
Hər hansı bir sualınız yaranarsa, texniki komanda ilə əlaqə saxlayın.
