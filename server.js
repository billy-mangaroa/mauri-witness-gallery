
const http = require('http');
const fs = require('fs');
const path = require('path');

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

const server = http.createServer((req, res) => {
  // Simple routing for static files
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  
  // Clean up URL parameters/fragments for file lookup
  const cleanPath = filePath.split('?')[0].split('#')[0];
  const extname = path.extname(cleanPath);
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(cleanPath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // Fallback to index.html for SPA-style routing or missing files
        fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
          if (err) {
            res.writeHead(500);
            res.end(`Fatal Server Error: ${err.code}`);
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content, 'utf-8');
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
