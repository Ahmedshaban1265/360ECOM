Ecom Backend (Express + Mongo + JWT)

Prerequisites
- Node.js 18+
- MongoDB running locally or a connection string

Setup
1) Copy env and edit values
   cp .env.example .env
   - MONGODB_URI=mongodb://127.0.0.1:27017
   - JWT_SECRET=your_strong_secret
   - CORS_ORIGIN=http://localhost:5173

2) Install deps
   pnpm install

3) Seed admin (dev only)
   Start server: pnpm start
   Then POST to http://localhost:4000/api/auth/seed with JSON {"email":"admin@example.com","password":"secret"}

4) Docs
   Open Swagger UI at http://localhost:4000/api/docs

Run
pnpm start

Endpoints (summary)
- POST /api/auth/login -> { token }
- GET /api/templates/:id/draft [auth]
- PUT /api/templates/:id/draft [auth]
- GET /api/templates/:id/published
- PUT /api/templates/:id/publish [auth]
- GET /api/settings/global
- PUT /api/settings/global [auth]
- GET /api/media [auth]
- POST /api/media/upload [auth, form-data: file]
- DELETE /api/media/:name [auth]

Deploy (Render/Railway/Vercel)
- Set env: PORT, MONGODB_URI, JWT_SECRET, CORS_ORIGIN, SWAGGER_SERVER_URL
- Ensure persistent storage if you rely on local uploads. For serverless, replace local uploads with S3/Cloudinary.

