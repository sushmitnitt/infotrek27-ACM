# Infotrek'27 Registration (MERN)

React (Vite) + Express + MongoDB. Registration form, events list, admin page with CSV export.

## Run locally
1. Create a free MongoDB Atlas cluster, copy the connection string.
2. `cd server && cp .env.example .env` and fill in MONGO_URI and ADMIN_KEY.
3. `npm install && npm run dev` (API on http://localhost:5000)
4. In another terminal: `cd client && npm install && npm run dev` (site on http://localhost:5173)
5. Admin page: http://localhost:5173/#admin (enter your ADMIN_KEY)

## Deploy
- Server: Render (root `server`, build `npm install`, start `npm start`). Set env vars from `.env.example`; CLIENT_URL = your Vercel URL.
- Client: Vercel (root `client`). Set env var VITE_API_URL = your Render URL.
- In MongoDB Atlas > Network Access, allow your host (0.0.0.0/0 for simplicity).

## Edit content
Events, dates and venue text are at the top of `client/src/App.jsx`.
