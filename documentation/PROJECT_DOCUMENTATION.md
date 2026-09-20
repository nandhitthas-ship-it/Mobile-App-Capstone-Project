# SpendWise project documentation

## User flow and navigation

```mermaid
flowchart LR
  Splash[Splash / brand] --> Onboarding[Onboarding value proposition]
  Onboarding --> Auth[Login or register]
  Auth --> Home[Overview]
  Home --> Transactions[Transactions CRUD]
  Home --> Budgets[Budgets and reminders]
  Home --> Insights[Insights and rates]
  Home --> Settings[Profile, camera, logout]
  Settings --> Auth
```

## System architecture

```mermaid
flowchart TB
  UI[Responsive UI / Capacitor shell] --> State[Application state]
  State --> Local[(Local storage / SQLite)]
  State --> Auth[Firebase Auth adapter]
  State --> Cloud[(Firestore user data)]
  State --> API[Exchange rate REST adapter]
  UI --> Device[Camera, notifications, secure permissions]
```

## Use cases

```mermaid
flowchart LR
  User((User)) --> A[Create account / login]
  User --> B[Record income or expense]
  User --> C[Search and filter transactions]
  User --> D[Review budgets and insights]
  User --> E[Capture receipt]
  User --> F[Enable reminders]
  Admin((Maintainer)) --> G[Deploy web and APK]
```

## Activity diagram

```mermaid
flowchart TD
  Start((Start)) --> Logged{Authenticated?}
  Logged -- No --> Login[Validate credentials]
  Login -- Invalid --> Error[Show inline error]
  Error --> Login
  Login -- Valid --> Dashboard[Load local data]
  Logged -- Yes --> Dashboard
  Dashboard --> Action{Choose action}
  Action -->|Transaction| Form[Validate form]
  Form --> Save[Persist transaction]
  Save --> Dashboard
  Action -->|Insights| Rates[Request REST data]
  Rates --> Dashboard
  Action -->|Logout| End((End))
```

## Sequence diagram

```mermaid
sequenceDiagram
  actor User
  participant UI
  participant Store as Local store
  participant API as Rates API
  User->>UI: Open Insights
  UI->>API: GET latest/INR
  API-->>UI: JSON rates
  UI-->>User: Render rates or error state
  User->>UI: Save transaction
  UI->>Store: Upsert JSON record
  Store-->>UI: Confirm write
  UI-->>User: Show success toast
```

## Data flow and ER model

```mermaid
flowchart LR
  Input[Form input] --> Validate[Validation]
  Validate --> Tx[(Transactions)]
  Tx --> Aggregate[Totals / category aggregates]
  Aggregate --> Dashboard[Cards, chart, insights]
  API[REST rates] --> Dashboard
```

```mermaid
erDiagram
  USER ||--o{ TRANSACTION : owns
  USER ||--o{ BUDGET : creates
  USER { string id string email string displayName }
  TRANSACTION { string id string userId string type decimal amount string category date note }
  BUDGET { string id string userId string category decimal limit decimal spent }
```

## Class/component model

```mermaid
classDiagram
  class User { +id +email +displayName }
  class Transaction { +id +type +amount +category +date +note }
  class StorageService { +read() +upsert() +remove() }
  class AuthService { +signIn() +register() +signOut() }
  class RatesService { +getLatest(base) }
  User "1" --> "*" Transaction
  StorageService --> Transaction
  AuthService --> User
  RatesService --> Dashboard
```

## UI/UX screen descriptions

| Screen | Purpose | Key states |
|---|---|---|
| Auth | Login, registration, demo entry | Invalid input, success |
| Overview | Financial snapshot | Loading, populated, empty |
| Transactions | CRUD and discovery | Search empty, filtered empty |
| Budgets | Category limits and reminders | Permission denied, warning |
| Insights | Advice and exchange data | API loading/error |
| Settings | Profile, camera, logout | Camera permission denied |

## Deployment runbook

1. Push the folder to a GitHub repository.
2. Import the repository into Vercel or Netlify with no build command and `.` as the output directory.
3. Replace the Live Website URL in `README.md`.
4. Capture mobile screenshots into `screenshots/`.
5. Add Firebase config via environment variables and deploy security rules.
6. Wrap with Capacitor, build a signed release APK, and test camera, notification, offline CRUD, and logout on an emulator.
7. Record the 3–5 minute flow and replace the demo URL.

## Presentation checklist

Title, problem, proposed solution, objectives, existing/proposed system, features, stack, architecture, UI screens, database, API, hardware permissions, test evidence, GitHub, APK, website, video, and future enhancements.

## Future enhancements

Recurring transactions, OCR receipt extraction, bank integrations, multi-currency budgets, biometric lock, scheduled notifications, and encrypted cloud backup.
