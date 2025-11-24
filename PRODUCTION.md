Deployment notes — make the app run in production

This repository contains a React frontend (Vite) and a Node/Express backend.

Important production steps

1) Backend (hostable on Render / Railway / Fly / Heroku / DigitalOcean / etc.)

- Create a MongoDB cluster (MongoDB Atlas) and copy the connection string.
- In your chosen host, set an environment variable named `MONGODB_URI` to the
  connection string (example: `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net`).
- Make sure `NODE_ENV=production` is set by the host by default for production
  deployments (most hosts do this automatically), or set it explicitly.
- Start command: `node src/server.js` (already defined as `start` in
  `backend/package.json`).

2) Frontend (Vercel recommended)

- Deploy the `frontend` folder on Vercel (it looks like you already have a deployment).
- If the backend is hosted at `https://api.example.com`, set a Vercel environment
  variable for the frontend:

  Vercel Dashboard > Project > Settings > Environment Variables
  - Key: `VITE_API_URL`
  - Value: `https://api.example.com/api`
  - Apply to Production

  The frontend will then call `${VITE_API_URL}/vehicles` etc. If the backend is
  served from the same origin (e.g., you proxy or host both on the same domain),
  you do not need to set `VITE_API_URL` — the frontend will default to a
  relative `/api` path.

3) Recommended architecture for production

- Host the backend on Render/Railway/Fly/Heroku with `MONGODB_URI` pointing to
  MongoDB Atlas.
- Host the frontend on Vercel. Set `VITE_API_URL` to point to your backend API
  (e.g., `https://your-backend.example.com/api`).

4) Notes about serverless and Vercel

- The backend in this repository is a long-running Express server and is not
  set up as Vercel Serverless Functions. You can either:
  - Deploy the backend to a server host (Render/Railway/etc.) and set
    `VITE_API_URL` to its URL, OR
  - Refactor the backend into Vercel serverless functions under `api/` (larger
    change) if you want both frontend & API on Vercel.

5) Troubleshooting

- If the frontend shows no vehicles in production, check browser console network
  requests — likely it's calling `http://localhost:4000` (old behavior). With the
  change in this repo the frontend now defaults to `/api` and will not call
  localhost by default.
- If the backend crashes at startup in production with a MONGODB_URI error,
  make sure you set `MONGODB_URI` in your host settings.

If you tell me the backend URL (if already deployed) I can set the exact value
for `VITE_API_URL` and help test the deployed site. If you prefer, I can also
prepare a `vercel.json` or small serverless refactor so both parts run under
Vercel — tell me which you prefer and I'll implement it.