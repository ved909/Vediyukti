# 🚀 Vediyukti — Complete Setup & Deployment Guide

---

## 📁 WHERE TO SAVE FILES

```
vediyukti/                              ← root folder on your computer
├── frontend/
│   ├── index.html                      ← ✅ the website file
│   ├── assets/
│   │   ├── js/main.js                  ← ✅ connects form, Instagram, WhatsApp
│   │   └── images/                     ← put your logo, client logos here
│   ├── pages/                          ← (future pages)
│   └── components/                     ← (future components)
├── backend/
│   ├── src/
│   │   ├── server.js                   ← ✅ main Express server
│   │   ├── config/index.js             ← ✅ environment config loader
│   │   ├── controllers/
│   │   │   └── contactController.js    ← ✅ form logic + email
│   │   ├── models/
│   │   │   └── Lead.js                 ← ✅ MongoDB data model
│   │   ├── routes/
│   │   │   ├── contact.js              ← ✅ form route
│   │   │   └── instagram.js            ← ✅ instagram feed route
│   │   ├── middleware/                 ← (custom middleware)
│   │   ├── services/                   ← (business logic)
│   │   └── utils/                      ← (helpers)
│   ├── logs/                           ← server logs
│   └── tests/                          ← test files
├── docs/
│   ├── api/                            ← API documentation
│   ├── deployment/                     ← deployment guides
│   │   └── SETUP_GUIDE.md              ← this file (copy)
│   └── architecture/                   ← architecture docs
├── archive/                            ← orphaned / legacy files
├── .env.example                        ← ✅ template — copy to .env
├── .gitignore                          ← ✅ keeps .env out of GitHub
├── package.json                        ← ✅ Node.js dependencies
├── README.md                           ← ✅ project overview
└── SETUP_GUIDE.md                      ← this file
```

---

## STEP 1 — Install Node.js

Download from https://nodejs.org → install the LTS version.
Verify: open Terminal / CMD and type:
```
node -v    # should show v18 or v20
npm -v     # should show v9 or v10
```

---

## STEP 2 — Install Backend Dependencies

Open Terminal in the `vediyukti/` folder and run:
```bash
npm install
```
This installs Express, Mongoose, Nodemailer, etc.

---

## STEP 3 — MongoDB Atlas (Free Database)

1. Go to https://cloud.mongodb.com
2. Click "Try Free" → sign up
3. Create a FREE Shared cluster (M0)
4. Choose a region (Mumbai / Singapore for India)
5. Under "Security" → "Database Access" → Add user
   - Username: vediyukti_admin
   - Password: generate a strong one (SAVE IT)
6. Under "Security" → "Network Access" → Add IP → Allow Access from Anywhere (0.0.0.0/0)
7. Under "Database" → Connect → Drivers → Copy the connection string
   It looks like: mongodb+srv://vediyukti_admin:PASSWORD@cluster0.xxxxx.mongodb.net/
8. Add `vediyukti` at the end: .../vediyukti?retryWrites=true&w=majority

---

## STEP 4 — Gmail App Password (for email alerts)

1. Go to your Google Account → myaccount.google.com
2. Security → 2-Step Verification → TURN IT ON if not already
3. Security → Search "App Passwords"
4. Select app: Mail | Select device: Other → type "Vediyukti"
5. Click Generate → COPY the 16-character password (e.g. "abcd efgh ijkl mnop")
6. Remove spaces when pasting into .env

---

## STEP 5 — Create the .env File

Copy `.env.example` to `.env` in the project root (or inside `backend/` for backward compatibility):

```env
PORT=5000
MONGODB_URI=mongodb+srv://vediyukti_admin:YOURPASSWORD@cluster0.xxxxx.mongodb.net/vediyukti?retryWrites=true&w=majority
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=abcdefghijklmnop
ALERT_EMAIL=hello@vediyukti.works
INSTAGRAM_ACCESS_TOKEN=IGAAxxxxx
INSTAGRAM_USER_ID=123456789
FRONTEND_URL=https://vediyukti.works
NODE_ENV=development
```

⚠️  NEVER share this file or push it to GitHub (.gitignore handles it)

---

## STEP 6 — Test Locally

```bash
# In the vediyukti/ folder:
npm run dev
```

You should see:
```
🚀  Server on http://localhost:5000
✅  MongoDB connected
```

Open `frontend/index.html` in your browser (use VS Code Live Server extension).
Fill the contact form → check your email for the alert.

---

## STEP 7 — Instagram Graph API Setup

### 7a. Convert Instagram to Business Account
Instagram App → Settings → Account → Switch to Professional → Business

### 7b. Create a Facebook Developer App
1. Go to https://developers.facebook.com
2. My Apps → Create App → "Business" type
3. Name it "Vediyukti Website"
4. Add Product → "Instagram Graph API"

### 7c. Connect your Instagram Business Account
1. In your app → Instagram → Basic Display OR
2. Use Instagram Graph API → connect your Facebook Page linked to Instagram
3. Under "Permissions" add: instagram_basic, instagram_content_publish

### 7d. Get Your Access Token
1. In the API Explorer: https://developers.facebook.com/tools/explorer
2. Select your app → Generate Token → add instagram_basic permission
3. Exchange for long-lived token (lasts 60 days):
```
GET https://graph.instagram.com/access_token
  ?grant_type=ig_exchange_token
  &client_id=YOUR_APP_ID
  &client_secret=YOUR_APP_SECRET
  &access_token=SHORT_LIVED_TOKEN
```

### 7e. Get Your Instagram User ID
```
GET https://graph.instagram.com/me?fields=id,username&access_token=YOUR_TOKEN
```
Copy the "id" value → paste as INSTAGRAM_USER_ID in .env

### 7f. Auto-Refresh Token (Important!)
Long-lived tokens expire in 60 days. Refresh before expiry:
```
GET https://graph.instagram.com/refresh_access_token
  ?grant_type=ig_refresh_token
  &access_token=CURRENT_TOKEN
```
Set a calendar reminder every 50 days.

---

## STEP 8 — Deploy Backend to Render.com (Free)

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   # Create repo on github.com, then:
   git remote add origin https://github.com/YOUR_USERNAME/vediyukti.git
   git push -u origin main
   ```

2. Go to https://render.com → New → Web Service
3. Connect your GitHub repo
4. Settings:
   - Name: vediyukti-backend
   - Root Directory: (leave empty — it's at root)
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free

5. Under "Environment Variables" — add ALL your .env values here

6. Click Deploy. Render gives you a URL like:
   `https://vediyukti-backend.onrender.com`

7. Update `frontend/js/main.js` line 6:
   Change `vediyukti-backend.onrender.com` to your actual Render URL

---

## STEP 9 — Deploy Frontend to Vercel (Free)

1. Go to https://vercel.com → New Project
2. Import your GitHub repo
3. Settings:
   - Framework: Other (plain HTML)
   - Root Directory: `frontend`
   - No build command needed
4. Deploy → Vercel gives you a URL

5. Add your custom domain:
   - In Vercel: Settings → Domains → Add `vediyukti.works`
   - In your domain registrar (wherever you bought vediyukti.works):
     - Add a CNAME record: `@` pointing to `cname.vercel-dns.com`

---

## STEP 10 — Update CORS for Production

In `backend/server.js`, the `allowedOrigins` array already includes
`https://vediyukti.works`. Make sure your Vercel URL matches exactly.

---

## 📋 QUICK REFERENCE — What Each File Does

| File | What it does |
|------|-------------|
| `frontend/index.html` | The full website — all HTML + CSS |
| `frontend/assets/js/main.js` | Contact form fetch, Instagram loader, WhatsApp button |
| `backend/src/server.js` | Express app — security, CORS, routes, MongoDB connect |
| `backend/src/models/Lead.js` | Mongoose schema — stores every form submission |
| `backend/src/routes/contact.js` | POST /api/contact route |
| `backend/src/controllers/contactController.js` | Saves lead + sends email alert |
| `backend/src/routes/instagram.js` | GET /api/instagram/feed — proxies IG API with caching |
| `backend/.env` or `.env` | Your secrets (never commit this) |

---

## 🛠️ Common Issues & Fixes

**"MongoDB connection failed"**
→ Check your MONGODB_URI in .env
→ Check Network Access in Atlas — IP 0.0.0.0/0 must be whitelisted

**"Email not sending"**
→ Make sure 2-Step Verification is ON in Gmail
→ Use App Password, not your login password
→ App Password has no spaces

**"Instagram feed not loading"**
→ Check INSTAGRAM_ACCESS_TOKEN hasn't expired (60-day limit)
→ Make sure your IG account is Business type

**"CORS error in browser"**
→ Add your Vercel URL to `allowedOrigins` in server.js
→ Redeploy backend to Render after any server.js change

**Render backend is slow on first request (cold start)**
→ Free Render instances sleep after 15 min of inactivity
→ First request takes ~30 sec to wake up
→ Upgrade to paid ($7/mo) to avoid this, or use UptimeRobot to ping /api/health every 14 min

**"Can't find module '../config'" or similar import errors**
→ The project was restructured. Make sure you're using the latest code from the `backend/src/` directory. Run `npm install` to ensure all dependencies are installed.

---

## 📞 API Endpoints Reference

| Method | URL | What it does |
|--------|-----|-------------|
| GET | /api/health | Check if server is running |
| POST | /api/contact | Submit contact form |
| GET | /api/instagram/feed | Get 9 latest Instagram posts |

### POST /api/contact — Request Body
```json
{
  "name": "Rahul Verma",
  "phone": "+91 98765 43210",
  "email": "rahul@example.com",
  "service": "Social Media Marketing",
  "message": "I need help with Instagram growth"
}
```

### POST /api/contact — Success Response
```json
{ "success": true, "message": "Message received! We'll get back to you within 24 hours. 🚀" }
```

---

## 🎨 Customise the Frontend

**Add real client logos** — in `index.html`, find `.client-logo` divs and replace `<span>` with:
```html
<img src="assets/images/logos/clientname.png" alt="Client Name" style="max-height:32px;max-width:100px;object-fit:contain;filter:grayscale(1);opacity:.6" />
```

**Add real work screenshots** — replace the gradient thumbs `.t1–.t6` in the work section with:
```html
<div class="work-thumb" style="padding:0"><img src="assets/images/work/project1.jpg" style="width:100%;height:100%;object-fit:cover" /></div>
```

**Update WhatsApp number** — in `frontend/js/main.js` line 85:
```js
const PHONE = '919876543210'; // 91 + your 10-digit mobile
```

---

Good luck! The site is production-ready. 🚀
