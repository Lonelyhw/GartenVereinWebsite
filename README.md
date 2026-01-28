# Gartenverein Website

## Docker Setup

Starten:

```bash
docker compose up --build
```

Aufrufe:
- Frontend: http://localhost
- API: http://localhost/api/...
- Health: http://localhost/api/actuator/health

Hinweis:
- Backend nutzt im Docker-Profil Postgres aus dem `db` Service.
- CORS ist fuer http://localhost:4200 freigegeben (lokale Entwicklung ohne Docker).