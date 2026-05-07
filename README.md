# StudyVault AI

> Upload notes. Generate summaries. Practice with quizzes. Revise with flashcards.

StudyVault AI is a full-stack study companion built for modern cloud deployment, demos, and portfolio presentation. It combines secure note uploads, structured OpenAI-powered study generation, and a polished dashboard designed for project showcase quality.

## Badges

![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react&logoColor=06141B)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=ffffff)
![Tailwind CSS](https://img.shields.io/badge/UI-Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=ffffff)
![Node.js](https://img.shields.io/badge/Backend-Node.js_Express-339933?style=for-the-badge&logo=node.js&logoColor=ffffff)
![MongoDB](https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=ffffff)
![OpenAI](https://img.shields.io/badge/AI-OpenAI-111827?style=for-the-badge&logo=openai&logoColor=ffffff)
![Gemini](https://img.shields.io/badge/AI-Gemini-4285F4?style=for-the-badge&logo=googlegemini&logoColor=ffffff)
![OpenRouter](https://img.shields.io/badge/AI-OpenRouter-7C3AED?style=for-the-badge)
![JWT](https://img.shields.io/badge/Auth-JWT-F59E0B?style=for-the-badge)
![Deploy](https://img.shields.io/badge/Deploy-Vercel_+_Render-0F172A?style=for-the-badge)

## Banner

Add a project banner image or GIF here for GitHub showcase mode.

```text
[ Banner Placeholder ]
StudyVault AI Dashboard + AI Study Workflow
```

## Features Overview

### Core product

- Secure JWT authentication with persisted login state
- Drag-and-drop upload flow for `PDF`, `TXT`, and `DOCX` notes
- MongoDB-backed note storage with extracted searchable text
- User-scoped notes, AI materials, and protected routes

### AI study tools

- AI summaries with concise overview, key concepts, important points, and exam-focused explanation
- AI quiz generation with 10 MCQs, 4 options each, answer review, scoring, and timer
- AI flashcards with flip animation, navigation, and study mode
- Multi-provider AI generation with OpenAI, Gemini, OpenRouter, provider selection, model selection, and automatic fallback
- AI activity feed and generation counters inside the dashboard

### Production polish

- Lazy-loaded routes with Suspense
- Toast feedback and route-level fallback UI
- Rate limiting, security headers, request sanitization, and safer error handling
- Deployment assets for Vercel and Render
- Demo seed script with sample content and a demo account

## Screenshots

Add screenshots or GIFs here after local capture:

- `docs/screenshots/dashboard-overview.png`
- `docs/screenshots/upload-flow.png`
- `docs/screenshots/ai-summary.png`
- `docs/screenshots/quiz-results.png`
- `docs/screenshots/flashcards.png`

## Tech Stack

### Frontend

- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- jsPDF

### Backend

- Node.js
- Express
- Mongoose
- JWT
- bcryptjs
- Multer
- pdf-parse
- mammoth
- OpenAI SDK
- Google Gemini SDK
- OpenRouter via OpenAI-compatible API
- Helmet
- express-rate-limit
- compression

## Architecture Overview

StudyVault AI uses a split frontend/backend architecture:

- `frontend/`
  React SPA served separately and deployed to Vercel
- `backend/`
  Express API deployed to Render
- `MongoDB Atlas`
  Stores users, notes, summaries, quizzes, and flashcards
- `OpenAI API`
  Generates structured study materials from extracted note text
- `Google Gemini API`
  Provides an alternate AI provider and fallback path
- `OpenRouter API`
  Provides access to OpenRouter-compatible models such as GPT-OSS-120B and NVIDIA Nemotron

### Flow

1. User authenticates and receives a JWT.
2. User uploads a note through the protected dashboard.
3. Backend validates the file, extracts text, and saves the note.
4. User requests a summary, quiz, or flashcard set by `noteId`.
5. Backend verifies ownership, routes the request through the AI Provider Manager, stores the generated material, and returns structured JSON.
6. Frontend renders the material in polished study views.

## Multi-Provider AI Setup

StudyVault AI supports OpenAI, Google Gemini, and OpenRouter behind a single provider manager. The frontend can request `auto`, `openai`, `gemini`, or `openrouter`; the backend validates provider/model input and keeps all API keys server-side.

```text
Frontend
  ↓
Backend API
  ↓
AI Provider Manager
  ├── Gemini
  ├── OpenAI
  └── OpenRouter
       ├── GPT-OSS-120B
       └── NVIDIA Nemotron 3 Super
```

Provider behavior:

- `auto` uses `AI_FALLBACK_CHAIN`, defaulting to `gemini,openai,openrouter`.
- `openai`, `gemini`, or `openrouter` try the selected provider first, then continue through the remaining fallback chain for retryable failures.
- OpenRouter accepts an optional `model`, defaulting to `OPENROUTER_DEFAULT_MODEL`.
- Generated summaries, quizzes, and flashcards store `providerRequested`, `providerUsed`, `modelUsed`, `fallbackUsed`, and `fallbackReason` for dashboard visibility.

Setup:

- OpenAI: set `OPENAI_API_KEY` and optionally `OPENAI_MODEL`.
- Gemini: set `GEMINI_API_KEY` and optionally `GEMINI_MODEL`.
- OpenRouter: set `OPENROUTER_API_KEY`, `OPENROUTER_BASE_URL`, and `OPENROUTER_DEFAULT_MODEL`.
- GPT-OSS-120B model value: `openai/gpt-oss-120b`.
- NVIDIA Nemotron model value: `nvidia/nemotron-3-super`.

Backend provider files:

- `backend/src/providers/aiProviderManager.js`
- `backend/src/providers/openai.provider.js`
- `backend/src/providers/gemini.provider.js`
- `backend/src/providers/openrouter.provider.js`

## Folder Structure

```text
studyvault-ai/
├── backend/
│   ├── demo/
│   ├── scripts/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── validators/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── vercel.json
├── .env.example
├── .gitignore
├── .nvmrc
├── LICENSE
├── package.json
└── render.yaml
```

## Installation Guide

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd studyvault-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment variables

```bash
cp .env.example .env
```

### 4. Configure your `.env`

Required:

- `MONGODB_URI`
- `JWT_SECRET`
- At least one AI key: `OPENAI_API_KEY`, `GEMINI_API_KEY`, or `OPENROUTER_API_KEY`

Recommended:

- `CLIENT_URL=http://localhost:5173`
- `VITE_API_BASE_URL=http://localhost:5000/api/v1`
- `OPENAI_MODEL=gpt-4o-mini`
- `GEMINI_MODEL=gemini-1.5-flash`
- `OPENROUTER_DEFAULT_MODEL=openai/gpt-oss-120b`
- `DEFAULT_AI_PROVIDER=auto`
- `AI_FALLBACK_CHAIN=gemini,openai,openrouter`

### 5. Start the backend

```bash
npm run dev:backend
```

### 6. Start the frontend

```bash
npm run dev:frontend
```

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | No | Backend port, defaults to `5000` |
| `NODE_ENV` | No | Environment mode |
| `CLIENT_URL` | Yes | Allowed frontend origin(s) for CORS |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | JWT signing secret |
| `JWT_EXPIRES_IN` | No | Token lifetime, default `7d` |
| `MAX_UPLOAD_SIZE_MB` | No | Upload size cap, default `10` |
| `UPLOAD_DIR` | No | Upload directory path, default `uploads` |
| `OPENAI_API_KEY` | No | Server-side OpenAI API key |
| `OPENAI_MODEL` | No | OpenAI model, default `gpt-4o-mini` |
| `GEMINI_API_KEY` | No | Server-side Gemini API key for Gemini generation and fallback |
| `GEMINI_MODEL` | No | Gemini model, default `gemini-1.5-flash` |
| `OPENROUTER_API_KEY` | No | Server-side OpenRouter API key |
| `OPENROUTER_BASE_URL` | No | OpenRouter API base URL, default `https://openrouter.ai/api/v1` |
| `OPENROUTER_DEFAULT_MODEL` | No | OpenRouter model, default `openai/gpt-oss-120b` |
| `DEFAULT_AI_PROVIDER` | No | `auto`, `openai`, `gemini`, or `openrouter`; default `auto` |
| `AI_FALLBACK_CHAIN` | No | Comma-separated auto fallback order, default `gemini,openai,openrouter` |
| `AI_PROVIDER_TIMEOUT_MS` | No | AI provider request timeout, default `45000` |
| `DEMO_EMAIL` | No | Demo account email for seed script |
| `DEMO_PASSWORD` | No | Demo account password for seed script |
| `DEMO_NAME` | No | Demo account display name |
| `VITE_API_BASE_URL` | Yes | Frontend API base URL |

## Demo Mode

### Seed demo data

```bash
npm run demo:seed
```

This creates:

- A demo user account
- Sample uploaded notes
- A stored summary
- A stored quiz
- A stored flashcard deck

### Suggested demo walkthrough

1. Log in with the demo account.
2. Open the dashboard overview.
3. Show the uploaded notes list.
4. Open AI Summary and export it.
5. Run through the Quiz screen and results.
6. End on the Flashcards page for a visual finish.

## API Routes

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/profile`

### Notes

- `POST /api/v1/notes/upload`
- `GET /api/v1/notes`
- `GET /api/v1/notes/:id`
- `DELETE /api/v1/notes/:id`

### AI

- `GET /api/v1/ai/activity`
- `POST /api/v1/ai/summarize`
- `POST /api/v1/ai/quiz`
- `POST /api/v1/ai/flashcards`

AI generation routes accept an optional provider:

```json
{
  "noteId": "NOTE_ID",
  "provider": "openrouter",
  "model": "openai/gpt-oss-120b"
}
```

Allowed provider values are `auto`, `openai`, `gemini`, and `openrouter`. The `model` field is optional and only used by OpenRouter.

Provider smoke tests:

- OpenAI: select `OpenAI` in the AI Provider dropdown and generate a summary.
- Gemini: select `Gemini` in the AI Provider dropdown and generate a quiz.
- OpenRouter GPT-OSS-120B: select `OpenRouter`, then `GPT-OSS-120B`.
- OpenRouter NVIDIA Nemotron: select `OpenRouter`, then `NVIDIA Nemotron 3 Super`.
- Fallback: set `AI_FALLBACK_CHAIN=gemini,openai,openrouter`, choose `Auto`, and temporarily make the first provider unavailable while another provider has a valid key.

## Deployment Guide

### Frontend on Vercel

1. Import the repository into Vercel.
2. Set the project root directory to `frontend`.
3. Add `VITE_API_BASE_URL` pointing to the deployed backend.
4. Keep the included `frontend/vercel.json` rewrite so client-side routes resolve to `index.html`.

### Backend on Render

1. Create a Render web service from this repository.
2. Use the provided `render.yaml` blueprint or configure the service manually.
3. Set the root directory to `backend`.
4. Add the production environment variables:
   - `CLIENT_URL`
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `OPENAI_API_KEY`
5. Confirm the health endpoint at `/health`.

### Production scripts

- `npm run build:frontend`
- `npm run start:backend`
- `npm run demo:seed`

## Security Notes

- OpenAI API keys remain server-side only.
- JWT-protected routes validate note ownership before access.
- Uploads are validated for file type and size.
- API routes use security headers, request sanitization, and rate limiting.

## Troubleshooting

### `OPENAI_API_KEY is not configured`

Add `OPENAI_API_KEY` to the root `.env` file and restart the backend.

### `Network error`

Confirm both frontend and backend are running and that `VITE_API_BASE_URL` points to the backend.

### `This origin is not allowed to access the API`

Make sure `CLIENT_URL` matches the frontend origin exactly.

### `This note does not contain extracted text for AI generation`

Re-upload the note in a supported format and confirm extraction completed successfully.

### `AI generation limit reached`

Wait a few minutes and retry. AI endpoints are rate-limited for protection.

## Future Improvements

- Real chart visualizations for note and AI usage analytics
- Multi-note summary mode
- Folder/tag organization for notes
- Collaboration and sharing
- Export quiz results as PDF
- Offline flashcard review mode

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE).

## Author

Built by **Adwaith** as a full-stack cloud and AI portfolio project.

## Final Project Positioning

StudyVault AI is prepared to serve as:

- A deployment-ready full-stack project
- A portfolio-quality GitHub showcase
- A demo-friendly cloud application
- A resume-worthy AI product build
- A polished final submission for academic or professional review
