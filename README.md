# Village Complaint Portal (గ్రామ ఫిర్యాదుల పోర్టల్)


**🌐 Live Website:** [https://village-complaint-portal.vercel.app/](https://village-complaint-portal.vercel.app/)


A mobile-first web application designed for rural citizens to report sanitation, drainage, street light, stagnant water, and drinking water grievances directly to their village Gram Panchayat.

**Pilot Village**: Gurrajupalem, Gaddamanugu Konduru (G.Konduru) Mandal, NTR District, Andhra Pradesh (PIN 521230).

---

## 🌟 Key Features

1. **Bilingual (Telugu Default + English)**
   - Unicode Telugu support with Google's *Noto Sans Telugu* font.
   - Persistent language switcher saved in browser storage.
   - All system strings, errors, and public awareness tips centralized in `src/i18n/translations.ts`.

2. **Resident Flow (Elderly & Mobile-First)**
   - **Phone OTP Sign-in**: Fast verification via Indian (+91) 10-digit mobile number with reCAPTCHA and Firebase test numbers support.
   - **Grievance Categories with Big Touch Targets (48px+)**: Drain/Sewage, Stagnant Water, Mosquito Problem, Street Light, Waste Collection, Drinking Water, Other.
   - **Instant GPS Photo Capture**: Browser Geolocation (`enableHighAccuracy: true`) captures coordinates at the exact moment the photo is snapped.
   - **Client-Side Image Compression**: Automatically resizes to 1280px wide with 70% JPEG quality before network transfer.
   - **Telugu Voice Input (Speech-to-Text)**: Speak in Telugu using Web Speech API (`te-IN`) with mic button.
   - **Sequential Complaint ID**: `GRP-YYYYMMDD-NNNN` (e.g. `GRP-20261106-0001`).
   - **WhatsApp Share & Direct Tracking**: Instant 1-click sharing of complaint details to WhatsApp and tracking via Complaint ID + mobile number.

3. **Panchayat Staff Dashboard**
   - Email/password login scoped strictly to the officer's linked village (Gurrajupalem).
   - High-level metric counters: Total, Received (Pending), In Progress, Resolved.
   - Problem frequency Bar Chart (Recharts) with "Top Problem" highlight.
   - **Repeated Problem Detection**: Automatically flags areas with 3 or more complaints of the same type in the same lane or within 50 meters with an alert badge.
   - Filters by status, problem category, lane name, and search queries.
   - Export filtered grievances to CSV.
   - Update grievance status with official remarks and audit trail timeline.

---

## 🚀 Step-by-Step Firebase Setup Guide

Follow these steps to deploy this application with your own Firebase backend:

### Step 1: Create a Firebase Project
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project**, name it (e.g. `village-complaint-portal`), and disable Google Analytics (optional).

### Step 2: Enable Authentication Providers
1. In the left navigation, go to **Build** > **Authentication** > **Sign-in method**.
2. **Phone Sign-in**:
   - Click **Phone**, toggle **Enable**, and click **Save**.
   - Under **Phone numbers for testing (optional)**, add a test phone number:
     - Phone number: `+91 9876543210`
     - Verification code: `123456`
3. **Email/Password**:
   - Click **Email/Password**, toggle **Enable**, and click **Save**.
4. **Authorized Domains**:
   - In **Settings** > **Authorized domains**, ensure `localhost` and your hosting domain (e.g. `run.app` or `web.app`) are listed.

### Step 3: Create Firestore Database
1. Go to **Build** > **Firestore Database** > **Create database**.
2. Choose a nearby region (e.g. `asia-south1` Mumbai).
3. Select **Start in production mode** or paste the security rules directly.

### Step 4: Apply Firestore Security Rules
1. In Firebase Console, go to **Firestore Database** > **Rules**.
2. Replace all content with the provided rules from `/firestore.rules`:
   ```bash
   cat firestore.rules
   ```
3. Click **Publish**.

### Step 5: Create Firebase Storage
1. Go to **Build** > **Storage** > **Get Started**.
2. Apply the security rules from `/storage.rules`:
   ```bash
   cat storage.rules
   ```
3. Click **Publish**.

### Step 6: Create the First Panchayat Staff User
1. In **Authentication** > **Users**, click **Add user**.
2. Enter email: `panchayat.gurrajupalem@example.com`
3. Enter password: `panchayat123` (or your choice).
4. Note the generated User UID, then in **Firestore Database**, create a document in the `users` collection:
   - Document ID: `<The UID from Auth>`
   - Fields:
     - `role`: `"panchayat"` (string)
     - `villageId`: `"gurrajupalem"` (string)
     - `email`: `"panchayat.gurrajupalem@example.com"` (string)
     - `name`: `"Gurrajupalem Panchayat Secretary"` (string)
     - `createdAt`: `"2026-11-06T00:00:00.000Z"` (string)

### Step 7: Configure Environment Variables
Copy `.env.example` to `.env` and fill in your Firebase Web App credentials:
```bash
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-app"
VITE_FIREBASE_STORAGE_BUCKET="your-app.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
VITE_FIREBASE_APP_ID="1:123456789:web:abcdef"
```

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start Vite dev server on port 3000
npm run dev

# Build for production
npm run build
```

---

## 👥 Demo Accounts for Immediate Evaluation

| Role | Identifier | Credentials / OTP |
| :--- | :--- | :--- |
| **Resident** | `+91 9876543210` | OTP: `123456` (or 1-click Demo Resident) |
| **Panchayat Staff** | `panchayat.gurrajupalem@example.com` | Password: `panchayat123` (or 1-click Staff Demo) |

---

## 🏛️ Project Structure
```
/
├── firestore.rules          # Production ABAC Firestore security rules
├── storage.rules            # Firebase Storage image upload rules
├── firebase-blueprint.json  # Data schema blueprint & entities
├── USER_GUIDE.md            # Bilingual User Manual for Citizens and Staff
├── src/
│   ├── components/
│   │   ├── AwarenessBanner.tsx       # Rotating Telugu health & sanitation tips
│   │   ├── BottomNav.tsx             # 48px touch-target mobile navigation
│   │   ├── ComplaintDetailModal.tsx  # Timeline, map coordinates, remarks
│   │   ├── Header.tsx                # Branding, language toggle, college banner
│   │   ├── LandingHero.tsx           # High-contrast action CTA buttons
│   │   ├── MapPreview.tsx            # Leaflet OpenStreetMap preview
│   │   ├── MyComplaintsList.tsx      # Resident grievance history
│   │   ├── NewComplaintWizard.tsx    # Multi-step GPS photo complaint wizard
│   │   ├── PanchayatDashboard.tsx    # Analytics, charts, CSV export, repeat alert
│   │   ├── PanchayatLoginModal.tsx   # Staff email/password auth
│   │   ├── PhoneAuthModal.tsx        # Mobile OTP modal (+91 Indian phone)
│   │   └── TrackComplaintModal.tsx   # Direct public tracking by ID
│   ├── data/
│   │   └── seedData.ts               # Gurrajupalem pilot & 10 sample complaints
│   ├── hooks/
│   │   └── useTeluguSpeech.ts        # Web Speech API with te-IN Telugu recognition
│   ├── i18n/
│   │   └── translations.ts           # Centralized Telugu & English Unicode strings
│   ├── services/
│   │   ├── db.ts                     # Compression, repeated detector, sequential ID
│   │   └── firebase.ts               # Firebase App & Auth initialization
│   ├── types/
│   │   └── index.ts                  # Shared TypeScript interfaces
│   ├── App.tsx                       # Master controller & state coordinator
│   └── main.tsx                      # App entry point
```
