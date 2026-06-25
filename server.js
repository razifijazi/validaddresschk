const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const AUTH_ID = '3cd021cf-908d-fba8-d044-faca9855d4dc';
const AUTH_TOKEN = 'O83kIaUZDmXsAPyC9CnP';

// Helper function to make HTTPS requests
function httpsGet(urlString) {
    return new Promise((resolve, reject) => {
        https.get(urlString, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(new Error('Invalid JSON response'));
                }
            });
        }).on('error', reject);
    });
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    // Serve HTML page
    if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/address-validator.html') {
        fs.readFile(path.join(__dirname, 'address-validator.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading file');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
        return;
    }
    
    // API endpoint for address validation
    if (parsedUrl.pathname === '/api/validate' && req.method === 'POST') {
        let body = '';
        
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { street, city, state, zipcode } = JSON.parse(body);
                
                if (!street || !city || !state || !zipcode) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Missing required fields' }));
                    return;
                }
                
                const apiUrl = `https://us-street.api.smarty.com/street-address?auth-id=${AUTH_ID}&auth-token=${AUTH_TOKEN}&street=${encodeURIComponent(street)}&city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&zipcode=${encodeURIComponent(zipcode)}`;
                
                const data = await httpsGet(apiUrl);
                
                res.writeHead(200, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify(data));
                
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }
        });
        return;
    }
    
    // 404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Address Validator live on http://localhost:${PORT}`);
    console.log(`🌐 Access via: http://<your-vps-ip>:${PORT}`);
});
