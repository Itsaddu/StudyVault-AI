StudyVault AI — Project Context
Project Type

Full-stack AI-powered study assistant platform.

Tech Stack
Frontend
React 18
Vite
Tailwind CSS
React Router
Axios
Backend
Node.js
Express
MongoDB Atlas
Mongoose
JWT Authentication
Multer uploads
OpenAI API
Deployment
Frontend → Vercel
Backend → Render
Current Features Implemented
Authentication System
JWT authentication
bcrypt password hashing
Register/Login/Profile APIs
Protected routes
Auth middleware
Persisted login state
Logout support
Auth context provider
Notes Upload System
PDF/TXT/DOCX uploads
Multer file handling
File validation
Upload progress UI
Text extraction:
pdf-parse
mammoth
MongoDB note storage
Search/filter notes
Delete notes
Dashboard
SaaS-style dark UI
Responsive layout
Sidebar/topbar
Upload stats
Recent uploads
AI activity widgets
Skeleton loading states
Toast notifications
AI Features

Uses OpenAI API.

Implemented:

AI summaries
AI quizzes
AI flashcards

Routes:

POST /api/v1/ai/summarize
POST /api/v1/ai/quiz
POST /api/v1/ai/flashcards

Features:

Structured JSON responses
Quiz scoring
Flashcard animations
Summary export/copy
Security + Production

Implemented:

Helmet
Compression
Rate limiting
Request sanitization
Upload validation
JWT expiration handling
Error middleware
Deployment Assets

Implemented:

render.yaml
frontend/vercel.json
.env.example
README.md
LICENSE
Demo Features

Implemented:

Seed demo script
Demo account support
Sample AI content

Command:

npm run demo:seed
Important Architecture Rules

DO NOT:

Rewrite working auth system
Rewrite routing structure
Rewrite contexts unnecessarily
Replace Tailwind setup
Change backend architecture drastically

Maintain:

Existing folder structure
Existing naming conventions
Existing API routes
Existing dashboard styling
Current Environment Variables
MONGODB_URI=
JWT_SECRET=
OPENAI_API_KEY=
CLIENT_URL=
VITE_API_BASE_URL=
Current Status

Completed:

Authentication
Upload system
Dashboard
AI features
Production polish
Deployment configs

Pending:

Final runtime testing
Deployment
Bug fixing after local run
Current Goal

Stabilize project, fix runtime bugs, verify deployment, and improve production readiness without rewriting existing architecture.
