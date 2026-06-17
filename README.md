# GartenVereinWebsite

Website und Verwaltung fuer einen Kleingartenverein (Frontend + Backend + Datenbank).

## Stack
- Frontend: Angular 21 + Tailwind
- Backend: Spring Boot 3 (REST API, Security, JPA)
- Datenbank: Postgres (Docker) oder H2 (lokal)
- Proxy: Nginx

## Projektstruktur
- `frontend` Angular SPA
- `backend` Spring Boot API
- `infra/nginx` Nginx Konfiguration
- `docker-compose.yml` Lokale Gesamtumgebung

## Schnellstart (Docker)
```bash
docker compose up --build
```

Aufrufe (vorläufig):
- Frontend: http://localhost
- API: http://localhost/api/...
- Health: http://localhost/api/actuator/health

Hinweise:
- Backend nutzt im Docker-Profil Postgres aus dem `db` Service.
- Uploads werden in `uploads_data` gemountet.

## Lokale Entwicklung (ohne Docker)

### Backend
```bash
cd backend
./mvnw spring-boot:run
```

Defaults im `dev` Profil:
- H2 In-Memory DB
- Admin User: `admin` / `admin`
- API Base: `http://localhost:8080/api`

### Frontend
```bash
cd frontend
npm install
npm start
```

Frontend laeuft auf `http://localhost:4200`. CORS ist fuer `http://localhost:4200` freigegeben.

## Konfiguration (Backend)
Umgebungsvariablen:
- `ADMIN_USER`, `ADMIN_PASSWORD` (Standard: `admin` / `admin`)
- `SPRING_PROFILES_ACTIVE` (`dev` oder `docker`)
- `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `DB_URL` (optional, ueberschreibt Host/Name)

## Tests
Backend:
```bash
cd backend
./mvnw test
```

Frontend:
```bash
cd frontend
npm test
```

## Deployment (Produktion)
Automatischer Deploy via GitHub Actions (`.github/workflows/deploy.yml`):
Sobald die CI auf `main` erfolgreich ist, verbindet sich der Workflow per SSH mit dem
Server, holt den neuesten Stand (`git reset --hard origin/main`), baut die Container neu
(`docker compose up -d --build`) und prueft die Health.

Voraussetzung: Auf dem Server ist dieses Repo geklont und laeuft per Docker Compose.
Der Deploy-User muss Docker ausfuehren duerfen (Mitglied der `docker`-Gruppe).

Benoetigte GitHub-Secrets (Settings → Secrets and variables → Actions):
- `DEPLOY_HOST` – Server-Hostname oder IP
- `DEPLOY_USER` – SSH-Benutzer
- `DEPLOY_SSH_KEY` – privater SSH-Key (PEM), dessen Public Key in `~/.ssh/authorized_keys` des Servers liegt
- `DEPLOY_PATH` – absoluter Pfad zum Repo auf dem Server
- `DEPLOY_PORT` – optional, SSH-Port (Standard `22`)

Solange die Secrets fehlen, ueberspringt sich der Workflow ohne Fehler.
Manuell ausloesen: Actions → „Deploy" → „Run workflow".

## API Endpoints (Auszug)
Public GET:
- `/api/news`, `/api/notices`, `/api/documents`, `/api/board`, `/api/rental`, `/api/gardens`, `/api/events`

Admin (ROLE_ADMIN):
- Alle weiteren `/api/**` Endpoints inkl. POST/PUT/DELETE
