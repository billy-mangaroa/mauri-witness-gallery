
const http = require('http');
const fs = require('fs');
const path = require('path');

const loadEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath, 'utf8');
  raw.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const index = trimmed.indexOf('=');
    if (index === -1) return;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value.replace(/^"|"$/g, '');
    }
  });
};

const envPath = path.join(__dirname, '.env.local');
loadEnvFile(envPath);
console.log(`Loaded env file: ${fs.existsSync(envPath) ? envPath : 'not found'}`);
console.log(`CLAUDE_API_KEY present: ${process.env.CLAUDE_API_KEY ? 'yes' : 'no'}`);

const port = process.env.PORT || 8080;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.ts': 'application/typescript',
  '.tsx': 'text/typescript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

const readBody = (req) => new Promise((resolve, reject) => {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => resolve(body));
  req.on('error', reject);
});

const sendJson = (res, status, payload) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
};

const server = http.createServer(async (req, res) => {
  const url = req.url || '/';

  if (url.startsWith('/api/chat') && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const data = body ? JSON.parse(body) : {};
      const prompt = data.prompt;
      const system = data.system;

      if (!prompt) {
        sendJson(res, 400, { error: 'Missing prompt.' });
        return;
      }

      const apiKey = process.env.CLAUDE_API_KEY;
      if (!apiKey) {
        sendJson(res, 500, { error: 'Missing CLAUDE_API_KEY.' });
        return;
      }

      const response = await fetch(
        'https://api.anthropic.com/v1/messages',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 400,
            system: typeof system === 'string' && system.trim().length > 0 ? system : undefined,
            messages: [{
              role: 'user',
              content: prompt
            }]
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Claude request failed', response.status, errorText);
        sendJson(res, 502, {
          error: 'Claude request failed.',
          status: response.status,
          details: errorText
        });
        return;
      }

      const json = await response.json();
      const text = json?.content?.[0]?.text || '';
      sendJson(res, 200, { text });
      return;
    } catch (error) {
      sendJson(res, 500, { error: 'Chat service error.' });
      return;
    }
  }

  // Simple routing for static files
  const rootPath = fs.existsSync(path.join(__dirname, 'dist'))
    ? path.join(__dirname, 'dist')
    : __dirname;
  let filePath = path.join(rootPath, url === '/' ? 'index.html' : url);

  // Clean up URL parameters/fragments for file lookup
  const cleanPath = filePath.split('?')[0].split('#')[0];
  const extname = path.extname(cleanPath);
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(cleanPath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // Fallback to index.html for SPA-style routing or missing files
        fs.readFile(path.join(rootPath, 'index.html'), (err, fallback) => {
          if (err) {
            res.writeHead(500);
            res.end(`Fatal Server Error: ${err.code}`);
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(fallback, 'utf-8');
        });
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(port, () => {
  console.log(`Mauri Gallery Server listening on port ${port}`);
});
