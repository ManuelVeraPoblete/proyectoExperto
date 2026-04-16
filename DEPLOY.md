# Guía de Deploy — Hogar Experto Fácil

**Stack:** Vercel (frontend) + Render (API) + Aiven (MySQL)

---

## Arquitectura

```
Usuario
  │
  ▼
Vercel (React)  ──VITE_API_URL──►  Render (Express API)  ──►  Aiven (MySQL)
```

---

## Paso 1 — Preparar el código

### 1.1 Frontend: variable de entorno para la URL de la API

Editar `hogar-experto-facil/src/lib/api-config.ts`:

```ts
// Antes:
export const API_BASE_URL = 'http://localhost:3001/api';

// Después:
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';
```

Crear `hogar-experto-facil/.env.example`:

```
VITE_API_URL=https://tu-api.onrender.com/api
```

### 1.2 Servidor: ajustar CORS

En `server/app.js` el CORS debe leer el origen desde variable de entorno:

```js
// Antes (solo localhost):
cors({ origin: 'http://localhost:8080' })

// Después:
cors({
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:8080'
})
```

### 1.3 Crear `server/.env.example`

```
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
PORT=3001
JWT_SECRET=
CORS_ORIGIN=
NODE_ENV=production
```

---

## Paso 2 — Base de datos MySQL en Aiven (gratis)

1. Crear cuenta en https://console.aiven.io
2. **Create service** → MySQL → Plan **Hobbyist** (gratis)
3. Esperar ~2 min hasta que esté `Running`
4. Copiar las credenciales: host, port, user, password, database

---

## Paso 3 — Deploy del servidor en Render

1. Ir a https://render.com → **New → Web Service**
2. Conectar el repositorio de GitHub
3. Configurar:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
4. Agregar **Environment Variables:**

| Variable | Valor |
|---|---|
| `DB_HOST` | host de Aiven |
| `DB_PORT` | puerto de Aiven |
| `DB_USER` | user de Aiven |
| `DB_PASSWORD` | password de Aiven |
| `DB_NAME` | db de Aiven |
| `JWT_SECRET` | clave larga y aleatoria |
| `CORS_ORIGIN` | https://tu-app.vercel.app |
| `NODE_ENV` | production |

5. Click **Create Web Service**
6. Anotar la URL: `https://tu-api.onrender.com`

---

## Paso 4 — Deploy del frontend en Vercel

1. Ir a https://vercel.com → **Add New → Project**
2. Conectar el repositorio de GitHub
3. Configurar:
   - **Root Directory:** `hogar-experto-facil`
   - **Framework Preset:** Vite (se detecta automáticamente)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Agregar **Environment Variables:**

| Variable | Valor |
|---|---|
| `VITE_API_URL` | https://tu-api.onrender.com/api |

5. Click **Deploy**

---

## Paso 5 — Migrar la base de datos

Desde la máquina local, apuntando temporalmente a las credenciales de producción:

```bash
cd server

# Ejecutar migraciones
DB_HOST=<aiven-host> DB_PORT=<puerto> DB_USER=<user> DB_PASSWORD=<pass> DB_NAME=<db> \
  npx sequelize-cli db:migrate

# (Opcional) Cargar datos iniciales
DB_HOST=<aiven-host> DB_PORT=<puerto> DB_USER=<user> DB_PASSWORD=<pass> DB_NAME=<db> \
  npx sequelize-cli db:seed:all
```

---

## Notas importantes

- **Render free tier** duerme el servicio tras 15 minutos sin tráfico. La primera petición tarda ~30 segundos en despertar.
- **Aiven Hobbyist** tiene límite de almacenamiento (5 GB). Suficiente para empezar.
- El archivo `.env` nunca debe subirse al repositorio (ya está en `.gitignore`).
- El `JWT_SECRET` de producción debe ser una cadena larga y aleatoria, distinta a la de desarrollo.

---

## Checklist antes del deploy

- [ ] `api-config.ts` usa `import.meta.env.VITE_API_URL`
- [ ] CORS en `app.js` lee desde `process.env.CORS_ORIGIN`
- [ ] `.env` no está en el repositorio
- [ ] Variables de entorno cargadas en Render
- [ ] Variables de entorno cargadas en Vercel
- [ ] Migraciones ejecutadas contra Aiven
- [ ] URL de Render actualizada en `CORS_ORIGIN` de Render
- [ ] URL de Vercel actualizada en `VITE_API_URL` de Vercel
