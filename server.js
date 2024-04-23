const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const publicDir = path.join(__dirname, '/');

const server = http.createServer((req, res) => {
    const filePath = path.join(publicDir, req.url === '/' ? 'index.html' : req.url);

    if (req.url === '/files') {
        // Get the list of files in the directory
        fs.readdir(publicDir, (err, files) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(files));
            }
        });
    } else {
        // Serve static files
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                res.writeHead(200, { 'Content-Type': getContentType(filePath) });
                res.end(data);
            }
        });
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

// Function to determine the Content-Type header based on file extension
function getContentType(filePath) {
    const extname = path.extname(filePath);
    switch (extname) {
        case '.html':
            return 'text/html';
        case '.css':
            return 'text/css';
        case '.js':
            return 'text/javascript';
        case '.png':
            return 'image/png';
        case '.jpg':
            return 'image/jpg';
        case '.jpeg':
            return 'image/jpeg';
        case '.svg':
            return 'image/svg+xml';
        default:
            return 'application/octet-stream';
    }
}
