🇬🇧 English | 🇫🇷 [Français](README.fr.md)

<p align="center">
  <img src="public/locars-logo.png" alt="Locars logo" width="96" />
</p>

# Locars Web

> Website and admin back-office for **Locars**, a car rental marketplace that connects renters with private owners and rental agencies.

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%7C%20Auth%20%7C%20Storage-FFCA28?logo=firebase&logoColor=black)

## About

Locars is a car rental platform operated by INNOVTECH SAS (Cotonou, Benin). Renters book cars through the Locars mobile app; vehicle owners ("hosts") list their cars and set their own prices. Prices are shown in FCFA and the interface is in French.

This repository contains the **web side** of the product:

- a **public website** that presents the service, lets visitors browse approved vehicles, sign up as a host, contact the team, request account deletion, and download the mobile app;
- an **admin back-office** where the Locars team validates hosts and vehicles, follows reservations and reviews, and tracks commissions and revenue.

Both sides share the same Firebase project as the mobile app.

<p align="center">
  <img src="public/mockup.png" alt="Locars mobile app mockup" width="320" />
</p>

<!-- TODO: add screenshot -->

## Key features

### Public website

- **Landing page** (`/`) with the value proposition, how it works, and popular cars.
- **Vehicle catalogue** (`/cars-dashboard`) loaded from Firestore, with filters for transmission, fuel type, and rental period (day / week / month).
- **Host sign-up** (`/become-host`): a 4-step form for private owners (`particulier`) or agencies (`agence`). It creates a Firebase Auth account and uploads supporting documents to Firebase Storage: ID and driving licence for individuals; ID, trade register extract, and IFU (tax ID) certificate for agencies.
- **Contact form** (`/contact`): sends an email to the team through [Resend](https://resend.com).
- **Account deletion request** (`/delete-account`): uploads a proof of identity and stores the request in Firestore for review.
- **App download page** (`/download`) with links to the App Store and Google Play.
- **FAQ, About, Terms (`/cgu`), and Privacy Policy (`/privacy`)**. The legal pages are rendered at request time from the Markdown files at the repo root with `react-markdown` and `remark-gfm`.

### Admin back-office (`/back-office`)

| Section | Purpose |
|---------|---------|
| Dashboard | Overview stats (pending accounts, pending vehicles, users) |
| Users | Approve, reject, suspend, or reactivate accounts |
| Host requests (`web-requests`) | Review host applications submitted from the website; approving one creates the Firebase Auth user and the `users` document |
| Cars | Review vehicle listings and approve them |
| Reservations | List and detail view of bookings |
| Reviews | Moderate ratings and reviews, issue warnings |
| Analytics | Pending payouts, host earnings, monthly revenue |
| Host commissions | Track commissions owed and mark payouts as paid |
| Contact requests / Delete requests | Follow-up on messages and account-deletion requests |
| Settings | App and environment info, summary counts |

Back-office and `/auth` pages use their own layout, without the public header and footer.

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, Heroicons |
| Data | Cloud Firestore (client SDK in pages, Admin SDK in API routes) |
| Auth | Firebase Authentication |
| File storage | Firebase Storage |
| Email | Resend |
| Content | `react-markdown` + `remark-gfm` for legal pages |
| Packaging | Dockerfile (`node:20-alpine`) |

### Notable technical choices

- **Two Firebase SDKs.** Client components use the Firebase JS SDK (`lib/firebase.ts`, `lib/firebase-utils.ts`). Privileged operations, such as creating users, approving records, and writing deletion requests, run in Next.js Route Handlers with the **Firebase Admin SDK** (`lib/firebase-admin.ts`). If Admin credentials are missing, the Admin SDK initializes lazily and returns `null`, so the public site still runs; the affected API routes return a clear `500`.
- **Route protection with middleware.** `middleware.ts` redirects requests under `/back-office/*` to `/auth/login` when no `authToken` cookie is present. The login page signs in with Firebase Auth, then calls `/api/auth/login` to set the cookie.
- **Legal content as Markdown.** Terms and privacy policy live in versioned `.md` files and are read with `fs` in Server Components. Updating them requires no code changes.
- **HTML escaping** of user input before it goes into the contact email.

## Architecture

```mermaid
flowchart LR
  subgraph Browser
    P[Public pages]
    B[Back-office pages]
  end
  subgraph "Next.js server"
    MW[middleware.ts<br/>authToken check]
    API[Route Handlers<br/>/api/*]
  end
  subgraph Firebase
    AUTH[Authentication]
    FS[(Firestore)]
    ST[(Storage)]
  end
  RS[Resend]

  P -- client SDK --> FS
  P -- uploads --> ST
  P -- sign-up --> AUTH
  B --> MW
  B -- client SDK --> FS
  P & B -- fetch --> API
  API -- Admin SDK --> FS
  API -- Admin SDK --> AUTH
  API -- /api/contact --> RS
```

Firestore collections used in the code: `users`, `cars`, `host_requests`, `web_host_requests`, `reservations`, `reviews`, `review_warnings`, `host_transactions`, `commissionHistory`, `contact_messages`, `inquiries`, `delete_requests`.

## Getting started

### Prerequisites

- Node.js 20 (the version used in the `Dockerfile`) and npm
- Access to a Firebase project with Authentication, Firestore, and Storage enabled
- A Resend API key if you want the contact form to send emails

### Installation

```bash
git clone https://github.com/andysags/locars-web.git
cd locars-web
npm install
```

### Configuration

Create a `.env.local` file at the project root. The repository has no `.env.example`, so here are the variables the code reads:

| Variable | Required for | Description |
|----------|--------------|-------------|
| `FIREBASE_PROJECT_ID` | Admin API routes | Firebase project ID for the Admin SDK |
| `FIREBASE_CLIENT_EMAIL` | Admin API routes | Service account client email |
| `FIREBASE_PRIVATE_KEY` | Admin API routes | Service account private key. Escaped `\n` sequences are converted to real newlines. |
| `RESEND_API_KEY` | `/api/contact` | Resend API key. Without it, the contact endpoint returns an error. |
| `CONTACT_RECIPIENT_EMAIL` | `/api/contact` (optional) | Destination address. Defaults to `contact@locars.app`. |
| `CONTACT_SENDER_EMAIL` | `/api/contact` (optional) | Sender address. Defaults to `Locars <onboarding@resend.dev>`. |

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
RESEND_API_KEY=your-resend-key
```

> **Note:** The **client-side** Firebase web config is hard-coded in `lib/firebase.ts`, and copies of it appear in several back-office pages. It is not read from environment variables. To point the app at another Firebase project, update those files.

### Run

```bash
npm run dev      # development server on http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint     # ESLint
```

### Docker

```bash
docker build -t locars-web .
docker run -p 3000:3000 --env-file .env.local locars-web
```

For more on deployment (Vercel, Docker, Cloud Run), see [DEPLOYMENT.md](DEPLOYMENT.md).

## Usage

- **Visitors** browse `/cars-dashboard`, get the mobile app from `/download`, or apply as a host via `/become-host`.
- **Admins** sign in at `/auth/login` with a Firebase Auth account, then manage the platform from `/back-office`.

## Project structure

```
locars-web/
├── app/
│   ├── page.tsx               # Landing page
│   ├── layout.tsx             # Root layout (fonts, metadata, lang="fr")
│   ├── components/            # Header, Footer, PopularCars, SiteChrome, LegalMarkdown
│   ├── cars-dashboard/        # Vehicle catalogue with filters
│   ├── become-host/           # Multi-step host sign-up
│   ├── contact/  faq/  about/  download/  delete-account/
│   ├── cgu/  privacy/         # Legal pages rendered from Markdown
│   ├── auth/login/            # Admin login
│   ├── back-office/           # Admin dashboard and sections
│   └── api/
│       ├── auth/login/        # Sets the authToken cookie
│       ├── contact/           # Sends email via Resend
│       ├── delete-account/    # Stores deletion requests
│       └── back-office/       # users, cars, web-requests (Admin SDK)
├── lib/
│   ├── firebase.ts            # Client SDK initialization
│   ├── firebase-utils.ts      # Client-side Firestore/Auth/Storage helpers
│   └── firebase-admin.ts      # Lazy Admin SDK initialization
├── public/                    # Logo, images, store badges
├── middleware.ts              # /back-office route guard
├── CGU Locars_01.05.2026.md   # Terms of use (source for /cgu)
├── Confidentialité Locars_01.05.2026.md  # Privacy policy (source for /privacy)
├── Dockerfile
└── DEPLOYMENT.md
```

## Tests

The project has no automated tests yet. Use `npm run lint` and `npm run build` as basic checks.

## Mobile app

- App Store: <https://apps.apple.com/bj/app/locars/id6763099054>
- Google Play: <https://play.google.com/store/apps/details?id=com.innovtechlabs.locars>

## License

This repository has no license file. Under the platform's terms of use, the Locars platform and its content belong to INNOVTECH SAS.
