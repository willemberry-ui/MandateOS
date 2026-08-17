# MandateOS

MandateOS is a Create React App frontend backed by Supabase for private markets
workflow, LP/GP matching, and demo workspace flows.

## Local Development

1. Install dependencies with `npm install`
2. Run the app with `npm start`

## Production Build

Run `npm run build` to create the production bundle in `build/`.

## Environment Variables

This app expects these public client-side variables:

- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_PUBLISHABLE_KEY`
- `REACT_APP_SUPABASE_ANON_KEY`

The frontend uses the publishable key when present and falls back to the anon
key.

## Deploy

Any static host that supports Create React App output will work:

- Vercel
- Netlify
- Render static sites
- AWS S3 + CloudFront

Build command:

```bash
npm run build
```

Output directory:

```bash
build
```
