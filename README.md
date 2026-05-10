# 🦠 NURSEiq — AI Nursing Study Platform

A free AI-powered nursing review app built with Next.js and Google Gemini.
Features quizzes, notes, progress tracking, and a dedicated MicroPara mode.

---

## 🚀 Setup (Local)

### 1. Install Node.js
Download from https://nodejs.org (choose the LTS version)

### 2. Get your FREE Gemini API Key
1. Go to https://aistudio.google.com
2. Sign in with a Google account
3. Click **"Get API Key"** → **"Create API key"**
4. Copy the key

### 3. Add your API key
Open the file `.env.local` and replace `paste_your_key_here`:
```
GEMINI_API_KEY=AIzaSy...your_actual_key_here
```

### 4. Install and run
Open a terminal in this folder and run:
```bash
npm install
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
2. Add: `GEMINI_API_KEY` = your key from step above
3. Click **Save** → then **Redeploy**

Your app will be live at `https://nurseiq.vercel.app` (or similar) 🎉

---

## 📁 Project Structure

```
nurseiq/
├── app/
│   ├── api/question/route.js   ← Gemini API call (server-side, key is safe here)
│   ├── layout.js
│   └── page.js
├── components/
│   └── NurseIQ.jsx             ← Full frontend app
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
- **API**: FREE (Gemini 1.5 Flash free tier — generous limits, no credit card needed)
