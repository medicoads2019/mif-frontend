# MIF Frontend (Vite + React)

## Local Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` from `.env.example` and set backend URL:

   ```env
   VITE_API_BASE_URL=http://localhost:8058
   ```

3. Start dev server:

   ```bash
   npm run dev
   ```

## Production Build

```bash
npm run build
```

## Deploy to Vercel from GitHub

1. Push this repository to GitHub.
2. In Vercel, click **Add New Project** and import the GitHub repo.
3. Set **Root Directory** to `frontEnd`.
4. Keep defaults:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variable in Vercel Project Settings:
   - `VITE_API_BASE_URL=https://your-backend-domain.com`
6. Deploy.

`vercel.json` includes SPA rewrite rules so deep routes (React Router) work after refresh.
