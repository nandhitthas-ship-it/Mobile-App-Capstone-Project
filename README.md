# SpendWise — Mobile Expense Tracker

SpendWise is a calm, mobile-first expense tracker that helps students and young professionals understand daily spending without spreadsheet friction. It combines local-first CRUD, search and filtering, budget progress, personalized insights, live exchange-rate data, account flows, camera capture, and notification permission handling in one responsive experience.

## Live website

**Live Website:** https://mobile-app-capstone-project.vercel.app

**Demo video:** `https://your-video-link.example` *(replace with the recorded 3–5 minute walkthrough)*

## Problem statement

People often make financial decisions from incomplete memory. Existing tools can be intimidating, slow to configure, or disconnected from everyday mobile use. SpendWise provides a small, focused surface for recording transactions, understanding categories, and acting on simple insights.

## Objectives and features

- Splash/auth entry with login, registration, demo account, validation, and logout.
- Responsive dashboard with balance, income, expenses, savings rate, chart, category mix, and recent activity.
- Transaction create, read, update, delete, search, type filter, category filter, and empty states.
- Budget progress cards with warning states and notification permission request.
- Insights screen with live exchange-rate REST API integration and explicit API error state.
- Profile/settings screen with local profile persistence and camera/gallery receipt input.
- Local persistence through `localStorage`, designed to map directly to AsyncStorage or SQLite.
- Accessible labels, semantic buttons, keyboard-friendly forms, and mobile navigation drawer.

## Technology stack

Vite, HTML5, CSS3, modern JavaScript, Web Storage API, Notifications API, Media Capture input, Fetch API, and Vercel static hosting. The app is intentionally dependency-light and can also be wrapped by Capacitor for an APK.

## Run locally

```bash
npm install
npm run dev
```

`npm run dev` starts Vite and opens the local app automatically (usually `http://localhost:5173`). `npm start` is an alias for the same command. `npm run build` creates the production site in `dist`; `npm run preview` serves that build locally. `npm test` runs a JavaScript syntax check.

Use the **Try the demo account** button, or create a local account. No real credentials are bundled.

## Project structure

```text
├── index.html              # app shell and modal markup
├── styles.css              # responsive design system
├── app.js                  # state, views, CRUD, API and device handlers
├── components/             # reusable component contracts
├── screens/                # screen specifications for native port
├── services/               # auth, storage and API adapters
├── models/                 # domain model
├── database/               # local schema and migration notes
├── authentication/         # Firebase integration guide
├── api/                    # REST API contract
├── assets/                 # branding and media guidance
├── documentation/          # architecture, diagrams, UX and deployment
├── tests/                  # test cases and test plan
└── screenshots/            # capture targets for final submission
```

## Backend and security

The demo uses local storage and a demo auth flow so it is safe to evaluate without credentials. Production integration instructions are in [`authentication/FIREBASE_SETUP.md`](authentication/FIREBASE_SETUP.md), including Firebase Auth, Firestore rules, environment variables, and user-scoped document paths. Never commit a service-account key or production API secret.

## API details

SpendWise displays amounts in Indian Rupees (INR). Insights calls `GET https://open.er-api.com/v6/latest/INR`, parses JSON rates, and shows loading/error states. See [`api/API.md`](api/API.md) for the adapter contract and a production proxy recommendation.

## Database details

The local `transactions` collection is persisted as JSON under `spendwise_transactions`; user profile data is stored under `spendwise_user`. See [`database/SCHEMA.md`](database/SCHEMA.md) for the equivalent SQLite/Firestore schema and CRUD mapping.

## Testing

The test matrix in [`tests/TEST_CASES.md`](tests/TEST_CASES.md) covers unit, UI, functional, auth, API, database, navigation, permission, and error handling scenarios. Run `npm test` for the current static syntax check; add Playwright or Vitest in CI when the hosting environment is selected.

## APK/build and presentation

The browser app can be packaged with Capacitor:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init SpendWise com.example.spendwise --web-dir .
npx cap add android
npx cap copy && npx cap open android
```

Build `app-release.apk` from Android Studio after adding Firebase config and testing on an emulator or physical device. The full presentation checklist, diagrams, user flow, and deployment runbook are in [`documentation/PROJECT_DOCUMENTATION.md`](documentation/PROJECT_DOCUMENTATION.md).

## Links to complete before submission

- **GitHub repository:** https://github.com/nandhitthas-ship-it/Mobile-App-Capstone-Project
- **APK download:** Not built yet; follow the Capacitor/Android build steps above.
- **Live website:** https://mobile-app-capstone-project.vercel.app
- **Demo video:** Not recorded/uploaded yet.
