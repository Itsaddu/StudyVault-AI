# StudyVault AI Runtime Test Report

## Date/time

2026-05-07 09:16:18 IST

## Commands run

- `npm install`
- `node --version`
- `npm --version`
- `npm ls --workspaces --all --depth=0`
- `npm run build`
- `npm run build:frontend`
- `npm run dev:backend`
- `PORT=5001 npm run dev:backend`
- `PORT=5000 npm run start:backend`
- `PORT=5001 npm run start:backend`
- `npm run dev:frontend`
- `npm run demo:seed`
- `curl -i http://localhost:5000/health`
- `curl -i http://localhost:5001/health`
- `curl -i http://localhost:5001/api/v1`
- `curl -i http://localhost:5001/api/v1/auth/profile`
- Scripted backend flow test for auth, uploads, notes, search, delete, AI activity, and AI generation endpoints.
- Vite route-serving checks for `/`, `/login`, `/dashboard`, and an unknown route.

## What passed

- Dependencies are installed and importable through the workspace install.
- Root workspace scripts are wired correctly for frontend build, backend start, frontend dev, backend dev, and demo seed.
- Frontend production build passes through both `npm run build` and `npm run build:frontend`.
- Backend connects to MongoDB when network access is available.
- Backend starts successfully on a free port.
- `/health` returns `200`.
- `/api/v1` base route returns `200`.
- Protected routes reject missing JWTs with `401`.
- Register, login, and profile APIs work.
- Passwords are not returned in auth user payloads.
- TXT, PDF, and DOCX uploads all return `201` and extract non-empty text.
- Notes list, note detail, note delete, and deleted-note `404` behavior work.
- Notes search works after the fix in this pass.
- AI activity endpoint works.
- AI generation endpoints call the provider and now return a safe `429` when the configured OpenAI account is quota-limited.
- Demo seed script works and no longer prints the configured demo password.
- Frontend Vite dev server starts when local binding is allowed.
- Vite serves SPA fallback HTML for core routes and unknown routes.
- `frontend/vercel.json` contains the expected SPA rewrite.
- `render.yaml` contains the expected backend service, root directory, start command, and health check path.

## What failed

- Local shell is running Node `v24.14.0`, but the project declares `>=20 <23` and `.nvmrc` specifies `22`. `npm install` completes but prints `EBADENGINE` warnings.
- `PORT=5000` is occupied by another local service that responds as Python Werkzeug. StudyVault cannot bind to port `5000` until that process is stopped.
- Default sandbox blocks MongoDB DNS/network access and local server binding; network/local binding checks required elevated execution.
- OpenAI generation cannot complete with the current configured account because the provider returns quota/rate-limit `429`.
- Full browser-click manual testing was not performed in this terminal-only environment; route serving and production compilation were verified instead.

## Bugs found

- Backend `app.listen()` emitted an unhandled server error when the configured port was already in use.
- Note search used `$regex` query operator objects while Mongoose global `sanitizeFilter` was enabled, causing search requests to fail with `400 Invalid resource identifier`.
- Raw OpenAI provider errors were returned as backend `500` responses, including provider text.
- Demo seed script printed `DEMO_PASSWORD` from the environment.

## Bugs fixed

- Added a server `error` handler so port conflicts produce a clear startup failure message.
- Reworked note search to use escaped `RegExp` values instead of `$regex/$options` objects.
- Mapped OpenAI provider failures to client-safe API errors: quota/rate-limit returns `429`; provider auth and other provider failures return safe `502` messages.
- Stopped `demo:seed` from printing the configured demo password.

## Remaining issues

- Free port `5000` or change both `PORT` and `VITE_API_BASE_URL` together for local development.
- Use Node 22 locally to match `.nvmrc` and the declared engine range.
- Resolve OpenAI account quota/billing before verifying successful summary, quiz, and flashcard content generation.
- Perform interactive browser QA for dashboard layout, mobile sidebar, quiz scoring interaction, flashcard flipping, logout, and session persistence.

## Manual testing checklist

- [x] Dependency install
- [x] Workspace script verification
- [x] Backend MongoDB connection
- [x] Backend startup on a free port
- [x] `/health`
- [x] `/api/v1`
- [x] Auth register
- [x] Auth login
- [x] Auth profile
- [x] Protected route behavior
- [x] TXT upload
- [x] PDF upload
- [x] DOCX upload
- [x] Notes list
- [x] Notes search
- [x] Note detail
- [x] Note delete
- [x] AI activity
- [x] AI provider error handling
- [ ] Successful AI summary generation
- [ ] Successful AI quiz generation
- [ ] Successful AI flashcard generation
- [ ] Browser-click dashboard walkthrough
- [ ] Mobile sidebar interaction
- [ ] Logout/login session persistence in browser

## Deployment readiness status

Conditionally ready.

The code builds, backend production startup works on a free port, MongoDB connectivity works, upload/extraction flows work, and deployment config files are present. Deployment should wait until the OpenAI quota issue is resolved and production environment variables are configured. Local development with the documented `PORT=5000` also requires stopping the unrelated Werkzeug/Python service currently occupying port `5000`.
