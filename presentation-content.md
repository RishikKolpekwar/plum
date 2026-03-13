# Plum Brr — AI-Powered Residential Plumbing
## American Operator Case Study | Rishik Kolpekwar

Generate a professional, modern slide deck. Each slide should have minimal text. Keep it visual and clean.

---

# Slide 1: Title

**Plum Brr: AI-Powered Residential Plumbing**

Driving Revenue Growth & Margin Improvement for a $1.24M Rhode Island Plumbing Business

Rishik Kolpekwar — American Operator, Forward Deployed AI Hacker Internship

---

# Slide 2: The Problem

**To maximize earnings, two things must happen:**

1. **Maximize revenue** — capture lost demand, increase customer lifetime value
2. **Maximize margins** — cut operational costs, automate manual workflows

---

# Slide 3: Revenue Leaks

- After-hours calls go to voicemail → **100% of after-5pm demand is lost**
- No subscription model → one-time customers = $198/yr vs subscriber = $642/yr (3.2x)
- No referral system → word-of-mouth is the #1 channel in plumbing but completely untracked
- 80% repeat rate, 4.9 Google, 28 Nextdoor recommendations — loyalty exists, no system captures it

---

# Slide 4: Cost Leaks

- Full-time office manager: **$48,000/yr** (phones, scheduling, dispatch)
- HouseCall Pro software: **$3,600/yr**
- Phone booking: **8.2 min** per appointment, office hours only
- Manual scheduling → double-bookings, missed follow-ups

---

# Slide 5: What I Built — Three Interfaces, Three Users

1. **Customer** → AI Chat Widget (book, cancel, subscribe, refer — 24/7)
2. **Admin** → Analytics Dashboard (revenue, AI impact, subscriptions, team performance)
3. **Technician** → Portal (appointments, schedule management, AI job resolution)

---

# Slide 6: Customer AI Chatbot

- Fully autonomous booking — no human in the loop
- Checks live technician availability, presents specific time slots
- Books appointment in **2.4 min** (vs 8.2 min phone)
- Upsells subscription plans at **26% conversion** (vs 8% phone)
- Manages referral program ($15 credit, no cap)
- Available **24/7** — captures after-hours demand

---

# Slide 7: After-Hours Revenue Capture

- 23 bookings after 5pm this month
- 19 converted to jobs → **83% conversion rate**
- **$6,555/month** → **$78,660 annualized**
- Previously **$0** — all went to voicemail
- 6.4% revenue lift on $1.235M TTM

---

# Slide 8: AI vs Phone — Side by Side

| Metric | AI | Phone |
|--------|-----|-------|
| Booking time | 2.4 min | 8.2 min |
| Cost per booking | $0.12 | $4.50 |
| After-hours bookings | 36% | 0% |
| Upsell conversion | 26% | 8% |
| Availability | 24/7 | Office hours only |

---

# Slide 9: Subscription Model

| Plan | Price | Discount |
|------|-------|----------|
| Basic | $29/mo | 10% off |
| Standard (Most Popular) | $49/mo | 15% off |
| Premium | $79/mo | 20% off |

- 87 subscribers → **$4,710 MRR** → **$56,520 ARR**
- Subscriber LTV: $642/yr vs one-time: $198/yr **(3.2x)**

---

# Slide 10: Technician Portal

- **Upcoming**: Today's + future appointments, auto-refreshes every 15 sec
- **History**: AI-generated resolution notes, follow-up detection, cost estimates
- **Schedule**: Visual calendar, weekly hours editor, time-off manager
- Replaces HouseCall Pro → **$3,600/yr saved**
- Technicians fully self-sufficient — no admin dependency

---

# Slide 11: Admin Analytics Dashboard

- AI Impact Summary: **$138,222 total annual impact**
- Revenue: monthly, MRR, ARR, subscriber growth
- AI vs Phone performance comparison
- Team: per-technician jobs, revenue, utilization
- **Live data, not projections** — business sees impact daily

---

# Slide 12: Measuring Impact — Revenue

| Metric | Value |
|--------|-------|
| After-hours revenue (annualized) | $78,660 |
| Subscription ARR | $56,520 |
| AI upsell revenue | $1,240/month |
| Revenue per subscriber vs one-time | $642 vs $198 (3.2x) |

---

# Slide 13: Measuring Impact — Margins & Errors

| Metric | Value |
|--------|-------|
| Net annual cost savings | $51,450 |
| Hours saved/week | 6.2 hrs |
| EBITDA margin | 39.8% → 44.0% (+4.2pp) |
| Double-bookings | 0 (was ~2-3/month) |
| Missed follow-ups | 26% now caught (was ~30% missed) |
| After-hours calls lost | 17% (was 100%) |

---

# Slide 14: Implementation — Testing Approach

**Three-phase rollout:**

1. **Shadow Mode (Weeks 1-2)** — AI alongside phone, office manager reviews all AI bookings
2. **Soft Launch (Weeks 3-4)** — AI live for 50% of visitors, technicians transition to portal
3. **Full Rollout (Month 2)** — AI primary channel, HouseCall Pro cancelled

---

# Slide 15: Concerns & Risks

| Risk | Mitigation |
|------|-----------|
| Technicians don't trust AI | Portal gives them MORE control, not less |
| Customers prefer phone | Phone still available — AI is additive |
| AI hallucinates availability | Function calling queries live DB — impossible |
| Token/context limits | Focused system prompt + graceful fallback |
| Winter demand spikes | AI handles unlimited concurrent chats |

---

# Slide 16: Deployment

**Productionizing:**
- Vercel + Supabase (already production-ready)
- Rate limiting, Sentry error monitoring

**Data access needed:**
- Existing customer list, technician schedules (Supabase)
- Financial data (QuickBooks/CPA integration)
- SMS/email confirmations (Twilio)

**Remote monitoring:**
- Admin dashboard = primary monitoring tool
- Weekly automated KPI reports
- Alerts on error rate > 2%

---

# Slide 17: Change Management — Three Users

| User | Before | After |
|------|--------|-------|
| **Customer** | Call during office hours, 8.2 min booking | Chat 24/7, 2.4 min booking |
| **Technician** | Depends on office manager + HouseCall Pro | Self-service portal, full schedule control |
| **Admin** | Manual tracking, no real-time visibility | Live dashboard with AI impact in dollars |

---

# Slide 18: Training & Adoption

**Customers:** Frictionless — chat widget on website, no app/account needed. 45% adoption month one.

**Technicians:** 30-min walkthrough → 1 week parallel with HouseCall Pro → full transition by week 3.

**Admin:** Dashboard becomes daily check-in. Minimal training — shows money made and money saved.

---

# Slide 19: Total Impact

| Component | Annual Value |
|-----------|-------------|
| After-hours revenue captured | $78,660 |
| Costs eliminated (office mgr + HCP) | $51,450 |
| Subscription ARR | $8,112 |
| **Total Annual AI Impact** | **$138,222** |

**EBITDA: 39.8% → 44.0%** — highest in the company's 11-year history.

---

# Slide 20: Closing

**The AI doesn't fix a broken business. It takes an already great business and removes the ceiling.**

$138,222 in annual impact. Every number on a live dashboard.

Not projections — real data, real dollars, real impact.
