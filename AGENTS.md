# Locars Web - AI Agent Guide

**Project**: Locars - A car rental marketplace platform built with Next.js, Firebase, and TypeScript.

## Quick Start

### Setup & Build Commands
```bash
# Install dependencies
npm install

# Development server (runs on http://localhost:3000)
npm run dev

# Production buildclaude /logout
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Key Paths (use `@/` alias)
- `@/lib/firebase-utils.ts` - Firebase client utilities (auth, Firestore operations)
- `@/lib/firebase-admin.ts` - Firebase admin SDK (server-side operations)
- `@/middleware.ts` - Route protection (authentication guard)

## Architecture Overview

### Project Structure
- **Public Pages**: `/app/` - Landing, browse cars, FAQ, privacy, contact
- **Admin Dashboard**: `/app/back-office/` - Protected back-office routes for admins
- **API Routes**: `/app/api/` - RESTful endpoints for authentication and back-office operations
- **Components**: `/app/components/` - Reusable React components
- **Utilities**: `/lib/` - Firebase and utility functions

### Tech Stack
- **Framework**: Next.js 16.2.4 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **Styling**: Tailwind CSS 4
- **Icons**: Heroicons (@heroicons/react)
- **Deployment**: Vercel, Docker, Firebase Cloud Run, Railway, etc.

## Development Conventions

### Routing
- **Client vs Server Components**: Server components by default. Add `"use client"` at top of file for client-side interactivity.
- **Protected Routes**: `/back-office` routes are protected by `middleware.ts` - redirects unauthenticated users to `/auth/login`
- **Dynamic Routes**: Use `[id]/` pattern (e.g., `[carId]/`, `[userId]/`)

### Authentication
- Authentication via Firebase
- Auth tokens stored in cookies (httpOnly: false for client access, secure in production)
- Middleware checks `authToken` cookie before allowing `/back-office` access
- Cookie expiry: 7 days

#### API Route Structure & Patterns

#### **Authentication Flow**
1. **Login endpoint**: `/api/auth/login` (POST)
   - Takes email + password
   - Validates user via Firebase Auth
   - Sets `authToken` cookie (7 days, not httpOnly)
   - Returns `{ success: true }`

2. **Route Protection**: 
   - Middleware (`middleware.ts`) checks `authToken` cookie
   - Redirects unauthenticated users to `/auth/login`
   - Only protects `/back-office/*` routes

#### **Back-Office API Routes** (`/api/back-office/*`)
All back-office routes use Firebase Admin SDK (server-side operations).

**Users Management** (`/api/back-office/users/*`)
- `GET /users` - List unapproved users (filtering `is_approved == false`)
- `POST /users/[userId]/approve` - Approve a user
- `POST /users/[userId]/reject` - Reject a user  
- `POST /users/[userId]/suspend` - Suspend active user
- `POST /users/[userId]/unsuspend` - Reactivate suspended user

**Cars Management** (`/api/back-office/cars/*`)
- `GET /cars` - List all cars (pending approval)
- `POST /cars/[carId]/approve` - Approve a car listing

**Web Requests** (`/api/back-office/web-requests/*`)
- `GET /web-requests` - List pending host registration requests
- `POST /web-requests/[reqId]/approve` - Approve host request

**Contact Form** (`/api/contact`)
- `POST /contact` - Submit contact inquiry

#### **Common API Response Patterns**
```typescript
// Success response
NextResponse.json({ success: true, data: {...} })

// Error response (always 500)
NextResponse.json({ error: "Failed to..." }, { status: 500 })

// List response
NextResponse.json([
  { id: "...", ...docData },
  { id: "...", ...docData }
])
```

#### **Error Handling Gotchas**
- ⚠️ **No input validation**: API routes accept any data. Consider adding Zod/Yup validation
- ⚠️ **No auth checks in API routes**: Routes assume client already authenticated (relies on middleware)
- ⚠️ **Generic error messages**: "Failed to..." hides actual error. Add `console.error()` for debugging
- ⚠️ **No structured logging**: Errors don't include request ID or user context

## Firebase Architecture: Client vs Admin SDK

### Client Firebase SDK (`lib/firebase.ts`, `lib/firebase-utils.ts`)
**Used in**: Browser and client components (`"use client"`)
```typescript
// Client imports
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Public API key (safe to expose)
const firebaseConfig = {
  apiKey: "...", // OK to expose
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
```

**Functions in `firebase-utils.ts`**:
- `registerUser()` - Create user with email/password
- `loginUser()` - Authenticate user
- `logoutUser()` - Sign out
- `uploadDocument()` - Upload file to Storage
- `createHostRequest()` - Submit host registration form
- `getHostRequests()` - Fetch pending requests
- `getPopularCars()` - Get rated cars for homepage
- etc.

**Pattern**: All client operations use Firestore `collection()`, `doc()`, `getDocs()`, `addDoc()`, `updateDoc()`

### Server Firebase Admin SDK (`lib/firebase-admin.ts`)
**Used in**: API routes (`/api/*`) only

```typescript
// Admin imports
import * as admin from "firebase-admin";

function getOrInitAdminApp(): admin.app.App {
  if (admin.apps.length) return admin.app();
  
  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export function getAdminDb() {
  const app = getOrInitAdminApp();
  return app.firestore();
}

export function getAdminAuth() {
  const app = getOrInitAdminApp();
  return app.auth();
}
```

**Why Admin SDK?**
- ✅ Full admin privileges (bypass security rules)
- ✅ Runs server-side (credentials never exposed)
- ✅ Needed for approval workflows where user shouldn't have direct access

**Caveat**: 
⚠️ Admin SDK credentials stored in `.env.local` (not in repo). Needed for: user/car approval, status updates, dashboard stats

### Security Model
1. **Public Firestore Config**: Exposed in `firebase.ts` (fine for Firebase public projects)
2. **Security Rules**: Must be configured in Firebase Console (NOT in this repo)
3. **Admin Credentials**: 
   - Only on server (API routes)
   - Environment variables: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
   - Never hardcoded in client code

### Styling
- Tailwind CSS utility classes
- No CSS-in-JS required (Tailwind + PostCSS)
- Responsive design with Tailwind breakpoints

## Common Tasks

### Adding a New Back-Office Page
1. Create folder under `/app/back-office/` (e.g., `/app/back-office/new-feature/`)
2. Add `page.tsx` file
3. Page automatically protected by middleware (checks authToken cookie)
4. Import utilities from `@/lib/firebase-utils.ts` for data operations
5. Use `"use client"` if interactive components needed

### Creating an API Endpoint
1. Create file under `/app/api/` following REST conventions
2. Export `POST`, `GET`, etc. functions
3. Use `NextRequest` and `NextResponse` from next/server
4. Parse JSON with `await req.json()` for POST requests
5. Return JSON responses with appropriate status codes

### Adding Authentication Logic
1. Use Firebase utilities from `@/lib/firebase-utils.ts`
2. For server-side operations, use `lib/firebase-admin.ts`
3. Set auth cookie after successful login in API routes
4. Middleware automatically protects `/back-office` routes

### Uploading Files
1. Files handled in API routes
2. Use Firebase Storage ref: `ref(storage, path)` then `uploadBytes(ref, file)`
3. Get download URL with `getDownloadURL(ref)`
4. Store metadata in Firestore collection

## Key Files Reference

| File | Purpose |
|------|---------|
| `app/page.tsx` | Home page |
| `app/auth/login/page.tsx` | Login page UI |
| `app/api/auth/login/route.ts` | Login endpoint |
| `app/back-office/page.tsx` | Admin dashboard with stats |
| `app/back-office/users/page.tsx` | User management |
| `app/back-office/cars/page.tsx` | Car management |
| `lib/firebase-utils.ts` | Client Firebase utilities |
| `lib/firebase-admin.ts` | Server Firebase utilities |
| `middleware.ts` | Route protection logic |
| `next.config.js` | Next.js configuration |
| `tsconfig.json` | TypeScript config with `@/` path alias |

## Project Status & Localization

### Current Deployment Status
- ✅ **Application Complete**: All features implemented and tested
- ✅ **Build Status**: Compiles successfully with zero TypeScript errors  
- ✅ **Firebase**: Configured at https://locars-b5310.web.app (static hosting)
- ⚠️ **Deployment Note**: Firebase static hosting doesn't support server-side rendering. See [DEPLOYMENT.md](DEPLOYMENT.md) for recommended deployment options (Vercel recommended)
- 📊 **Status Details**: See [DEPLOYMENT_STATUS.md](DEPLOYMENT_STATUS.md) for full build output and feature checklist

### Localization & Currency
- **Language**: French translations throughout the application
- **UI Examples**: "Devenir Loueur" (Become Host), navigation, forms, etc.
- **Currency**: **XOF** (CFA Francs) for all financial values
  - Used in: commission calculations, revenue analytics, pricing displays
  - When displaying prices, always use XOF format: `1000 XOF`
  - Database stores values as numbers; format on display only

## Important Notes

### Security
- Firebase credentials exposed in `app/back-office/page.tsx` (public config) - acceptable for Firebase public projects
- Production: Ensure Firestore security rules are properly configured
- API routes should validate inputs and authenticate admin operations

## Naming Conventions

### Firestore Fields
- Collections: PascalCase (`users`, `cars`, `host_requests`)
- Document fields: **snake_case** (e.g., `is_approved`, `host_type`, `date_of_birth`)
  - Exception: Some fields may use camelCase in newer code
  - When querying, use snake_case to match Firestore structure
  - Example: `where("is_approved", "==", true)` NOT `where("isApproved", "==", true)`

### File/Component Naming
- Components: PascalCase (e.g., `PopularCars.tsx`, `UserManagement.tsx`)
- Routes/Pages: kebab-case folders with `page.tsx` or `route.ts`
- Functions/Variables: camelCase
- Types/Interfaces: PascalCase
- API endpoints: kebab-case (e.g., `/api/back-office/users`, `/api/auth/login`)

### Naming Conventions
- Components: PascalCase (e.g., `PopularCars.tsx`)
- Routes/Pages: kebab-case folders with `page.tsx` or `route.ts`
- Functions/Variables: camelCase
- Types/Interfaces: PascalCase

### Common Imports
```tsx
// Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Next.js
import { NextRequest, NextResponse } from "next/server";
import { useEffect, useState } from "react";

// Icons
import { UsersIcon, TruckIcon, SparklesIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

// Path alias
import { functionName } from "@/lib/firebase-utils";
```

### Deployment
See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment options (Vercel, Docker, Firebase Cloud Run, Railway, Render).

## Common Backend Patterns

### Firestore Query Patterns
```typescript
// 1. Get all documents from collection
const snapshot = await getDocs(collection(db, "cars"));
const cars = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

// 2. Query with WHERE clause
const q = query(
  collection(db, "users"),
  where("isApproved", "==", true)
);
const results = await getDocs(q);

// 3. Get single document by ID
const docRef = doc(db, "cars", carId);
const docSnapshot = await getDoc(docRef);
const data = docSnapshot.data();

// 4. Update document
const docRef = doc(db, "users", userId);
await updateDoc(docRef, {
  isApproved: true,
  updatedAt: new Date(),
});

// 5. Add new document
const docRef = await addDoc(collection(db, "inquiries"), {
  name: "John",
  email: "john@example.com",
  message: "...",
  createdAt: new Date(),
});
```

### File Upload Pattern (Document Storage)
```typescript
// 1. Upload to Storage
const fileRef = ref(storage, `user-documents/${userId}/${fileName}`);
await uploadBytes(fileRef, file);

// 2. Get download URL
const downloadURL = await getDownloadURL(fileRef);

// 3. Store URL in Firestore
const hostRequest = {
  documentUrls: {
    identityDocument: downloadURL,
    drivingLicense: downloadURL2,
  },
  // ... other fields
};
await addDoc(collection(db, "host_requests"), hostRequest);
```

### Approval Workflow Pattern
```typescript
// 1. Create request with PENDING status
const requestData = {
  status: "PENDING", // or APPROVED, REJECTED
  userId: userId,
  createdAt: new Date(),
  // ... other fields
};

// 2. Admin API endpoint approves it
// POST /api/back-office/users/[userId]/approve
const response = await fetch(`/api/back-office/users/${userId}/approve`, {
  method: "POST",
  body: JSON.stringify({ approved: true })
});

// 3. Update document status
await updateDoc(userRef, {
  isApproved: true,
  status: "APPROVED",
  updatedAt: new Date(),
});
```

### Dashboard Stats Pattern
```typescript
// Fetch multiple collections and aggregate
export const getDashboardStats = async (firestore: Firestore) => {
  const hostRequestsSnap = await getDocs(collection(firestore, "host_requests"));
  const usersSnap = await getDocs(collection(firestore, "users"));
  const carsSnap = await getDocs(collection(firestore, "cars"));

  const pendingRequests = hostRequestsSnap.docs.filter(
    doc => doc.data().status === "PENDING"
  );
  
  return {
    pendingAccounts: pendingRequests.length,
    pendingVehicles: carsSnap.docs.filter(d => !d.data().isApproved).length,
    activeRenters: usersSnap.docs.filter(d => d.data().isApproved).length,
  };
};
```

### 🚨 Security & Configuration Issues
- **Firebase config is duplicated** across multiple files (`lib/firebase.ts`, `app/back-office/page.tsx`, `app/auth/login/page.tsx`) with exposed public API keys - this is acceptable for Firebase public configs, but verify Firestore security rules are properly configured in production
- **No input validation**: API endpoints accept data without schema validation (consider adding Zod/Yup for safety)
- **Auth token is plaintext "true"**: The cookie stores just `"true"` instead of a JWT. This is acceptable for same-site scenarios but less secure for cross-domain use
- **No logout UI wired up**: `logoutUser()` function exists but isn't connected to any UI button

### ⚠️ Common Developer Mistakes
- **Firebase init on every render**: While `getApps()` guard prevents duplicate initialization, avoid calling `initializeApp()` in component bodies - use `lib/firebase.ts` which handles this centrally
- **Generic error handling**: All API routes return `{ error: "Failed to..." }` without details, making debugging difficult - consider adding structured logging
- **No token refresh**: The 7-day auth cookie has no refresh mechanism; users must re-login after expiry
- **Collection names are strings**: Queries use hardcoded collection names (`"users"`, `"cars"`, etc.) without type safety - there's no runtime validation that collections exist

### 📋 Testing & Quality Gaps
- **No automated tests**: The project has zero test files (no Jest, Vitest, or testing setup)
- **No schema validation library**: Firebase collections accept any data structure
- **No error tracking**: Errors are logged to console only, not tracked in production

## Backend Architecture & Data Models

### Firestore Collections Schema

#### **users** - User accounts & profiles
```
{
  id: string (Firebase Auth UID),
  email: string,
  phone: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  licenseNumber: string,
  licenseCountry?: string,
  hostType: "particulier" | "agence",
  isApproved: boolean,
  isSuspended: boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  // For agencies only:
  agencyName?: string,
  agencyAddress?: string,
  ifuNumber?: string,
}
```

#### **host_requests** - Registration applications (become a host)
```
{
  id: string,
  userId: string,
  hostType: "particulier" | "agence",
  status: "PENDING" | "APPROVED" | "REJECTED",
  email: string,
  phone: string,
  firstName: string,
  lastName: string,
  documentUrls: {
    identityDocument: string,
    drivingLicense: string,
    commercialRegistry?: string,
    ifuAttestation?: string,
  },
  reason?: string, // rejection reason
  createdAt: Timestamp,
  updatedAt: Timestamp,
}
```

#### **cars** - Vehicle listings
```
{
  id: string,
  brand: string,
  model: string,
  rating: number,
  isApproved: boolean,
  hostId: string,
  // other vehicle details...
  createdAt: Timestamp,
  updatedAt: Timestamp,
}
```

#### **inquiries** - Contact form submissions
```
{
  id: string,
  name: string,
  email: string,
  subject: string,
  message: string,
  status: "new" | "read" | "resolved",
  createdAt: Timestamp,
}
```

#### **reservations**, **reviews** - Under development
Will follow similar patterns with status tracking and timestamps.

## Environment Setup

### Prerequisites
- Node.js 18+ (check with `node --version`)
- Firebase project created and configured

### Firebase Configuration

**Client-side Firebase Config** (`lib/firebase.ts`):
- Public API key (safe to expose)
- Used by browser and client components
- Already configured in the codebase

**Server-side Firebase Admin SDK** (`lib/firebase-admin.ts`):
- Requires `.env.local` file with admin credentials (NEVER commit this)
- Only used in API routes (`/app/api/*`)
- Credentials available from Firebase Console → Project Settings → Service Accounts

### .env.local Setup

Create `.env.local` in project root with Firebase Admin SDK credentials:
```bash
FIREBASE_PROJECT_ID=locars-b5310
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@locars-b5310.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```

**⚠️ IMPORTANT**: 
- Never commit `.env.local` to Git (should be in `.gitignore`)
- Private key: Copy as-is from Firebase Console, preserve `\n` newline characters
- Without these, API routes in `/back-office` and admin approval endpoints will fail with "Missing admin credentials"

### Local Development

1. **First time setup**:
   ```bash
   npm install
   cp .env.example .env.local  # If .env.example exists, otherwise create manually
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```
   - Opens on `http://localhost:3000`
   - Hot-reload enabled for `.tsx`, `.ts` files
   - API routes available at `/api/*`

3. **Test authentication**:
   - Navigate to `/auth/login` to test Firebase auth
   - Use a test user account or create one via Firebase Console
   - Admin routes at `/back-office/*` require valid `authToken` cookie

### Path Alias (`@/`)
The `@/` alias maps to project root (configured in `tsconfig.json`):
```tsx
import { getDashboardStats } from "@/lib/firebase-utils";  // Maps to /lib/firebase-utils.ts
```

## Quick Wins / Improvement Opportunities

1. **Centralize Firebase initialization**: Move all `initializeApp()` calls to a single utility file to reduce duplication across `lib/firebase.ts`, `app/back-office/page.tsx`, and `app/auth/login/page.tsx`

2. **Add input validation layer**: Create a simple validation middleware for API endpoints using Zod or custom validators before processing requests

3. **Implement structured logging**: Add a logger utility (even console-based with context) to track errors with request IDs and user context

4. **Wire up logout UI**: Connect the existing `logoutUser()` function to a logout button in back-office navigation

5. **Add basic integration tests**: Even a few tests for auth flow and key API endpoints would catch regressions early

6. **Use JWT tokens**: Replace plaintext auth cookies with proper JWT tokens that include expiry and user info for better security

## Questions or Issues?
- Check [README.md](README.md) for Next.js basics
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for deployment details
- Examine existing API routes for endpoint patterns
- Look at back-office pages for component and styling patterns
- See "Important Gotchas" section above for common pitfalls to avoid

## Troubleshooting Local Development

### "Missing admin credentials" Error on API Routes

**Problem**: API routes in `/back-office` return 500 errors with "Missing admin credentials"

**Solution**:
1. Check `.env.local` exists in project root
2. Verify all three variables are set:
   - `FIREBASE_PROJECT_ID` (string, no quotes)
   - `FIREBASE_CLIENT_EMAIL` (full service account email)
   - `FIREBASE_PRIVATE_KEY` (starts with `-----BEGIN PRIVATE KEY-----`, preserves `\n` characters)
3. Restart dev server: `npm run dev`
4. Check console for detailed error: `console.error()` logs in `/lib/firebase-admin.ts`

### "Failed to fetch users" / Generic API Errors

**Problem**: API returns `{ error: "Failed to..." }` without details

**Solution**:
1. Check Firebase Admin SDK initialization in `/lib/firebase-admin.ts`
2. Verify Firestore security rules allow admin SDK access
3. Add temporary `console.error(error)` to API route to see actual error
4. Ensure user has `is_approved: true` field (uses snake_case)

### Hot-reload Not Working

**Problem**: Changes to files don't trigger auto-refresh

**Solution**:
1. Kill dev server (Ctrl+C)
2. Clear Next.js cache: `rm -rf .next/`
3. Restart: `npm run dev`
4. Check that file is in watched directories: `/app`, `/lib`, `/public`

### TypeScript Errors in Client Components

**Problem**: "Cannot use server-only functions in client component"

**Solution**:
- Add `"use client"` at the top of the file to mark it as a client component
- Move server-side logic to API routes or server components
- Check that imports from `firebase-admin` are only in API routes, not client code

### Authentication Not Persisting After Page Reload

**Problem**: User logged in but gets redirected to login after refresh

**Solution**:
1. Check browser DevTools → Application → Cookies for `authToken`
2. Verify middleware.ts has `matcher: ["/back-office/:path*"]`
3. Check that login endpoint sets cookie with 7-day expiry
4. Clear browser cookies and test login flow again

### Firestore Query Returns Empty Results

**Problem**: Queries return `[]` even though data exists in Firebase

**Common causes**:
1. **Field name mismatch**: Using `isApproved` instead of `is_approved` (Firestore is case-sensitive)
2. **Wrong collection name**: Verify collection name matches exactly (e.g., `users`, not `Users`)
3. **Data type mismatch**: Comparing string `"true"` to boolean `true`
4. **Collection doesn't exist yet**: First document must exist before querying

**Debugging**:
```tsx
// Log what's actually in Firestore
const snapshot = await getDocs(collection(db, "users"));
snapshot.docs.forEach(doc => {
  console.log('User data:', doc.data()); // Check field names and values
});
```

### 404 on Back-Office Routes

**Problem**: `/back-office`, `/back-office/users`, etc. return 404

**Solution**:
1. Verify route files exist: `/app/back-office/page.tsx`, `/app/back-office/users/page.tsx`
2. Check middleware isn't blocking the initial HTML load
3. Clear `.next/` cache and rebuild: `npm run build`
4. Ensure user has valid `authToken` cookie (middleware redirects to login without it)

## Code Style & Linting

The project uses ESLint with Next.js recommended config:
```bash
npm run lint  # Check for linting issues
```

No auto-fix script configured. Fix issues manually based on eslint output or use your editor's ESLint extension for inline suggestions.
