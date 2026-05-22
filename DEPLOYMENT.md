# Locars Web - Deployment Guide

## Current Status

✅ **Application Built Successfully**

- 25 static routes prerendered
- 13 server-side API routes
- Zero TypeScript errors
- All features implemented and working

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

Vercel is optimized for Next.js and will automatically handle server components, API routes, and middleware.

```bash
npm i -g vercel
vercel --prod
```

### Option 2: Firebase with Cloud Run

Firebase Cloud Run supports server-side rendering. Requires Docker and gcloud setup.

```bash
# Deploy to Cloud Run
firebase deploy --only functions
```

### Option 3: Self-hosted with Docker

Use the provided Dockerfile to run on any Docker-compatible platform:

```bash
docker build -t locars-web .
docker run -p 3000:3000 locars-web
```

### Option 4: Railway / Render / Other

These platforms support Next.js natively:

- Railway: `railway up`
- Render: Connect repository for auto-deployment
- Fly.io: `flyctl deploy`

## Current Firebase Setup

- **Project**: locars-b5310 (Locars)
- **Static Hosting**: Configured at https://locars-b5310.web.app
- **Issue**: Firebase static hosting only serves static files, not server-rendered pages or API routes

## Next Steps to Deploy

1. Choose deployment platform
2. Set Firebase environment variables if needed:
   - Firebase Config (auto-included in build)
   - Any custom environment variables

## Environment Variables Needed

All environment variables are already in `.env.local`:

- Firebase configuration (automatically used)
- API keys and secrets are secure in Firebase

## Build Command

```bash
npm run build
```

## Start Command (for server deployments)

```bash
npm start
```

## Troubleshooting

**Q: Why doesn't Firebase static hosting work?**
A: Next.js 16+ uses server components by default, which require a runtime to execute. Static hosting can't run these components.

**Q: Can I use Firebase App Hosting?**
A: Yes, but it requires building a Docker image and pushing to Artifact Registry (paid services).

**Q: What about dynamic routes?**
A: The app has dynamic routes like `/back-office/cars/[carId]` which require server-side rendering.

## Quick Deployment to Vercel

```bash
npm i -g vercel
vercel login
vercel --prod
```

This will automatically:

- Build the Next.js app
- Deploy all pages and API routes
- Set up automatic deployments from git
- Provide a production URL
