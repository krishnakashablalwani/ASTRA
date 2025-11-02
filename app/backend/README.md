# CampusHive Backend

Express.js server for CampusHive. Handles API, authentication, MongoDB connection. Some AI-assisted features remain optional.

## Prerequisites

- Node.js 18+ (recommended LTS)
- MongoDB (local or Atlas)
- Optional: SambaNova API key for Llama chat completions (only for AI features you choose to enable)

## Environment Variables

Create a `.env` file based on `.env.example`:

```
MONGODB_URI=mongodb://localhost:27017/campushive
JWT_SECRET=your_jwt_secret
PORT=5000
# Web Push (required for push notifications)
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
# Only required if using AI features
LLAMA_API_KEY=your_sambanova_api_key
```

Notes:
- `LLAMA_API_KEY` is required only for AI-assisted endpoints. Without it, calls to `/api/ai/chat` will return 401.
- `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` are required for web push notifications.
	Generate using the `web-push` CLI: `npx web-push generate-vapid-keys`.
- You can use MongoDB Atlas for `MONGODB_URI` if you don't have a local Mongo running.

## Install & Run

```bash
cd app/backend
npm install
npm start
```

The server listens on `http://localhost:5000` by default. A health check is available at `/`.

## Key Routes

- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `PUT /api/auth/me`
- Events: `GET /api/events`, CRUD
- Clubs: `GET /api/club`, CRUD, `POST /api/club/:id/members` (AI tag suggestion removed)
- Push: `GET /api/push/public-key`, `POST /api/push/subscribe`, `DELETE /api/push/unsubscribe`, `POST /api/push/test`
- Notifications: `GET /api/notifications`, `GET /api/notifications/ai/summary`
- Collaborative Spaces: removed
- Leave: CRUD, `POST /api/leaves/ai/improve-reason`
- Timetables: CRUD (AI generation removed; manual-only)
- Tasks: CRUD, `POST /api/tasks/ai/prioritize`
- AI Proxy: `POST /api/ai/chat`

## Troubleshooting

- Port already in use (EADDRINUSE): another instance is running on port 5000. Stop it or change `PORT` in `.env`.
- AI chat returns 401: set `LLAMA_API_KEY` in `.env` and restart the server.
- Push notifications not working: ensure VAPID keys are set, run `npm install` to install `web-push`, and restart the server. Check the browser permission status and service worker registration in Application tab.
- MongoDB connection errors: verify `MONGODB_URI`, ensure Mongo is reachable.
