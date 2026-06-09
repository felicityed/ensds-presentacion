# Deploy de la presentación ENSDS en Railway

Presentación: `Presentacion_ENSDS_v3.html` (se sirve en la raíz `/`).
Servidor: Node sin dependencias (`server.js`), arranca con `npm start`.

---

## 0. Requisitos (una sola vez)
- Tener instalado **Git** y **Node 18+**.
- Cuenta en **GitHub** (https://github.com) y en **Railway** (https://railway.app, entra con GitHub).
- (Opcional pero cómodo) la **GitHub CLI** `gh`: https://cli.github.com

## 1. Probar en local (opcional, recomendado)
Abre una terminal **en esta carpeta** y ejecuta:

```bash
npm start
```

Abre `http://localhost:3000` en el navegador. Deberías ver la presentación con los mapas reales. Para parar: `Ctrl + C`.

## 2. Inicializar el repositorio Git

```bash
git init
git add .
git commit -m "Presentación ENSDS España–Marruecos (TFM ISSEP)"
git branch -M main
```

> El `.gitignore` ya excluye los Word/PDF/PowerPoint y las versiones antiguas, así el repo va ligero. Si quieres subir también esos documentos, borra esas líneas del `.gitignore`.

## 3. Crear el repo en GitHub y subirlo

**Opción A — con GitHub CLI (lo más rápido):**
```bash
gh repo create ensds-presentacion --public --source=. --push
```

**Opción B — manual:**
1. Crea un repositorio vacío en https://github.com/new (por ejemplo `ensds-presentacion`).
2. Conéctalo y sube:
```bash
git remote add origin https://github.com/TU_USUARIO/ensds-presentacion.git
git push -u origin main
```

## 4. Desplegar en Railway
1. Entra en https://railway.app → **New Project** → **Deploy from GitHub repo**.
2. Autoriza Railway en GitHub si te lo pide y selecciona el repo `ensds-presentacion`.
3. Railway detecta Node automáticamente y ejecuta `npm start`. No hay que configurar nada más (el puerto se inyecta solo vía `PORT`).
4. Cuando termine el build, ve a la pestaña **Settings → Networking → Generate Domain**.
5. Railway te da una URL pública del tipo `https://ensds-presentacion-production.up.railway.app` → ¡esa es tu presentación accesible desde cualquier navegador!

## 5. Actualizar la presentación más adelante
Cada vez que cambies el HTML:
```bash
git add .
git commit -m "Ajustes presentación"
git push
```
Railway redibuja y publica solo en unos segundos.

---

### Notas
- La presentación usa internet para: fuentes (Google Fonts), Leaflet (unpkg) y los mapas (teselas de CARTO/OpenStreetMap). En Railway todo va por HTTPS, así que cargará sin problemas.
- Controles: `→` avanzar · `←` atrás · `F` pantalla completa · `Esc` índice.
