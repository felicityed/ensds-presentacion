// Servidor estático sin dependencias para la presentación ENSDS.
// Railway inyecta el puerto en process.env.PORT.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const INDEX = 'Presentacion_ENSDS_v3.html';
const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.svg':  'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.ico':  'image/x-icon',
  '.mp4':  'video/mp4',
  '.webm': 'video/webm',
  '.mov':  'video/quicktime'
};

http.createServer((req, res) => {
  try {
    let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    if (urlPath === '/' || urlPath === '') urlPath = '/' + INDEX;

    // Evita salir de la carpeta del proyecto (path traversal).
    const safe = path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(ROOT, safe);
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403); return res.end('Forbidden');
    }

    fs.stat(filePath, (err, st) => {
      if (err || !st.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('404 · No encontrado');
      }
      const ext = path.extname(filePath).toLowerCase();
      const type = MIME[ext] || 'application/octet-stream';
      const cache = (ext === '.html') ? 'no-store, no-cache, must-revalidate' : 'public, max-age=86400';
      const total = st.size;
      const range = req.headers.range;

      // Soporte de peticiones de rango (imprescindible para vídeo en iOS Safari)
      if (range) {
        const m = /bytes=(\d*)-(\d*)/.exec(range);
        let start = m && m[1] !== '' ? parseInt(m[1], 10) : 0;
        let end = m && m[2] !== '' ? parseInt(m[2], 10) : total - 1;
        if (isNaN(start)) start = 0;
        if (isNaN(end) || end >= total) end = total - 1;
        if (start > end || start >= total) {
          res.writeHead(416, { 'Content-Range': 'bytes */' + total });
          return res.end();
        }
        res.writeHead(206, {
          'Content-Type': type,
          'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
          'Accept-Ranges': 'bytes',
          'Content-Length': end - start + 1,
          'Cache-Control': cache
        });
        return fs.createReadStream(filePath, { start: start, end: end }).pipe(res);
      }

      res.writeHead(200, {
        'Content-Type': type,
        'Content-Length': total,
        'Accept-Ranges': 'bytes',
        'Cache-Control': cache
      });
      fs.createReadStream(filePath).pipe(res);
    });
  } catch (e) {
    res.writeHead(500); res.end('Error interno');
  }
}).listen(PORT, () => console.log('Presentación ENSDS sirviéndose en el puerto ' + PORT));
