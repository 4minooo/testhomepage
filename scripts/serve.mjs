import http from 'node:http';
import { readFile } from 'node:fs/promises';
const root = new URL('../public/', import.meta.url);
const allowed = new Set(['index.html', 'app.js', 'content.js', 'styles.css', 'favicon.svg']);
const types = { html: 'text/html; charset=utf-8', js: 'text/javascript; charset=utf-8', css: 'text/css; charset=utf-8', svg: 'image/svg+xml' };
const port = Number(process.env.PORT || 5173);
http.createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url, 'http://localhost').pathname;
    const filename = pathname === '/' ? 'index.html' : pathname.slice(1);
    if (!allowed.has(filename)) { response.writeHead(404); response.end('Not found'); return; }
    const content = await readFile(new URL(filename, root));
    response.writeHead(200, { 'Content-Type': types[filename.split('.').pop()], 'Cache-Control': 'no-store' });
    response.end(content);
  } catch { response.writeHead(500); response.end('Server error'); }
}).listen(port, '127.0.0.1', () => console.log(`TEST homepage: http://127.0.0.1:${port}`));
