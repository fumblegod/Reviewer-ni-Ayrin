# 🦠 NURSEiq — AI Nursing Study Platform

A free AI-powered nursing review app built with Next.js and Groq.
Features quizzes, notes, database-backed progress tracking, and a dedicated MicroPara mode.

---

## 🚀 Setup (Local)

### 1. Install Node.js
Download from https://nodejs.org (choose the LTS version)

### 2. Get your FREE Groq API Key
1. Go to https://console.groq.com
2. Sign in and create an API key
3. Copy the key

### 3. Add your API key and database URL
Open the file `.env.local` and replace the placeholders:
```
GROQ_API_KEY=gsk_...
DATABASE_URL="file:./dev.db"
```

### 4. Install, create the database, and run
Open a terminal in this folder and run:
```bash
npm install
npm run db:push
npm run dev
```

Then open http://localhost:3000 in your browser. Done! ✅

---

## 🌐 Deploy to Vercel (Free — so anyone can use it)

### 1. Push to GitHub
1. Create a free account at https://github.com
2. Create a new repository (call it `nurseiq`)
3. Upload this folder to it (or use git push)

### 2. Deploy on Vercel
1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New Project"** → select your `nurseiq` repo
3. Click **"Deploy"** (Vercel auto-detects Next.js)

### 3. Add your API key to Vercel
1. In your Vercel project → **Settings** → **Environment Variables**
2. Add: `GROQ_API_KEY` = your key from step above
3. Add: `DATABASE_URL` = your database connection string
4. Click **Save** → then **Redeploy**

Your app will be live at `https://nurseiq.vercel.app` (or similar) 🎉

---

## 📁 Project Structure

```
nurseiq/
├── app/
│   ├── api/progress/route.js   ← Saves and loads quiz progress
│   ├── api/question/route.js   ← Groq API call (server-side, key is safe here)
│   ├── layout.js
│   └── page.js
├── components/
│   └── NurseIQ.jsx             ← Full frontend app
├── lib/
│   └── prisma.js               ← Shared Prisma client
├── prisma/
│   └── schema.prisma           ← Quiz progress table
├── .env.local                  ← Your API key (never commit this!)
├── .env.example                ← Safe template to share
├── .gitignore                  ← Keeps .env.local out of git
└── package.json
```

---

## 💡 Topics Covered
- 🦠 Micro & Parasitology (with subtopics: bacteria, viruses, fungi, parasites, antibiotics, infection control)
- 🏥 Med-Surg
- 💊 Pharmacology
- 🤱 OB / Maternity
- 🧒 Pediatrics
- 🧠 Psych / Mental Health
- 📋 Fundamentals
- ❤️‍🔥 Critical Care
- 🌍 Community Health

---

## 💰 Cost
- **Hosting**: FREE (Vercel free tier)
- **API**: FREE tier available through Groq, depending on your account and usage
