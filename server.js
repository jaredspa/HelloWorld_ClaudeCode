const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// In-memory storage for submissions
const submissions = [];

const server = http.createServer((req, res) => {
  // Serve the homepage
  if ((req.url === '/' || req.url === '/index.html') && req.method === 'GET') {
    const htmlPath = path.join(__dirname, 'index.html');
    fs.readFile(htmlPath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading page');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });

  // Handle form submissions
  } else if (req.url === '/submit' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const { name, flavor } = JSON.parse(body);
      submissions.push({ name, flavor, timestamp: new Date() });
      console.log('New submission:', { name, flavor });
      console.log('Total submissions:', submissions.length);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `Thanks ${name}! We recorded your love for ${flavor} ice cream.` }));
    });

  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
