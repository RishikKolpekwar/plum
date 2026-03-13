<div align="center">

  <br>

  <img src="https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase">
  <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Gemini">

  <br><br>

  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
    <path d="M32 8 C32 8 34 2 38 4" stroke="#5A3A1A" stroke-width="2.5" stroke-linecap="round"/>
    <ellipse cx="39" cy="5" rx="5" ry="2.5" transform="rotate(-20 39 5)" fill="#6BBF59"/>
    <ellipse cx="32" cy="30" rx="18" ry="20" fill="#7B2D8E"/>
    <ellipse cx="24" cy="22" rx="5" ry="7" fill="#9B4DCA" opacity="0.6"/>
    <path d="M22 48 C22 48 22 56 20 60 C19 62 21 63 22 61 C23 58 23 54 23 48" fill="#7B2D8E"/>
    <path d="M30 50 C30 50 30 58 29 62 C28.5 64 31.5 64 31 62 C30 58 30 54 30 50" fill="#7B2D8E"/>
    <path d="M38 47 C38 47 39 53 40 56 C40.5 58 38 58 38 56 C37.5 53 38 50 38 47" fill="#7B2D8E"/>
  </svg>

  # plum

  ### Rhode Island's plumber, on demand.

  An AI-powered residential plumbing platform that lets customers chat with an intelligent assistant to book visits, manage protection plans, and get emergency support — all in one place.

  <br>

  `⭐ 4.9 Google Rating` · `🏆 A+ BBB Accredited` · `🔁 80% Repeat Customers`

</div>

---

## 🔧 What It Does

plum replaces the traditional call-and-wait plumbing experience with an **AI-first platform**. Customers open a chat widget, describe their issue, and the system autonomously handles scheduling — matching the right licensed technician based on availability, specialty, and location.

No phone trees. No callbacks. Just tell plum what's wrong and a tech shows up.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **💬 AI Chat Assistant** | Gemini-powered conversational interface with function calling — books visits, answers plan questions, triages emergencies |
| **📅 Smart Scheduling** | Autonomous technician matching based on availability, specialty, and proximity |
| **🛡️ Protection Plans** | Three subscription tiers ($29/$49/$79/mo) for year-round coverage and priority service |
| **📊 Technician Dashboard** | Admin and technician views for managing appointments, job history, and customer info |
| **🚨 Emergency Dispatch** | Priority routing for burst pipes, flooding, and other urgent issues — 24/7 |

---

## 🏠 Services

<table>
  <tr>
    <td align="center" width="25%">
      <br>
      <h3>🔥</h3>
      <b>Boiler Repair & Installation</b>
      <br><br>
      <sub>All makes and models — installs, repairs, and annual servicing</sub>
      <br><br>
    </td>
    <td align="center" width="25%">
      <br>
      <h3>🚿</h3>
      <b>Drain Cleaning</b>
      <br><br>
      <sub>Fast, clean, and guaranteed — residential drain maintenance</sub>
      <br><br>
    </td>
    <td align="center" width="25%">
      <br>
      <h3>🚰</h3>
      <b>Fixture Installation</b>
      <br><br>
      <sub>Faucets to full bathroom upgrades — precision work, fair pricing</sub>
      <br><br>
    </td>
    <td align="center" width="25%">
      <br>
      <h3>⚡</h3>
      <b>Emergency Plumbing</b>
      <br><br>
      <sub>Burst pipe at 2am? We pick up. Priority dispatch on every call</sub>
      <br><br>
    </td>
  </tr>
</table>

---

## 🧠 How the AI Works

plum's chat assistant isn't a simple FAQ bot — it uses **Gemini function calling** to take real actions:

```
Customer: "My boiler is making a banging noise and there's no heat"
    ↓
Gemini analyzes → classifies as BOILER REPAIR (urgent)
    ↓
Calls check_availability() → finds next open slot with boiler-certified tech
    ↓
Calls create_booking() → schedules appointment in Supabase
    ↓
Customer gets confirmation with tech name, time, and what to expect
```

The AI handles the entire flow autonomously — from issue identification to technician assignment to booking confirmation — without human intervention.

---

## 💎 Protection Plans

| | Basic | Standard | Premium |
|---|:---:|:---:|:---:|
| **Price** | $29/mo | $49/mo | $79/mo |
| Annual inspection | ✅ | ✅ | ✅ |
| Drain cleaning (1x/yr) | ✅ | ✅ | ✅ |
| Priority scheduling | 48hrs | 48hrs | 48hrs |
| Boiler inspection | — | ✅ | ✅ |
| Water heater flush | — | ✅ | ✅ |
| Emergency dispatch | — | 1x/yr | Unlimited |
| Repair discount | 10% | 15% | 20% |
| Radiator & filtration checks | — | — | ✅ |

---

## 💻 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 15, React 19, Tailwind CSS 4, Framer Motion |
| **Backend** | Next.js API Routes, Server Actions |
| **AI** | Google Gemini (function calling) |
| **Database** | Supabase (PostgreSQL) |
| **UI** | Radix UI, Lucide Icons, shadcn/ui |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

```bash
# Clone and install
git clone https://github.com/your-username/plum.git
cd plum
npm install

# Set up environment
cp .env.local.example .env.local
# Add your GEMINI_API_KEY and SUPABASE keys

# Run dev server
npm run dev
```

Visit `http://localhost:3000`

---

## 📍 Service Area

Serving **Woonsocket, Providence, Smithfield & N. Smithfield, Rhode Island** since 2013.

---

<div align="center">
  <sub>© 2026 plum. Rhode Island's plumbing.</sub>
</div>
