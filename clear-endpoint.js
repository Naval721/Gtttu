/**
 * NODE.JS / EXPRESS ENDPOINT
 * Use this if you're using a Node.js backend
 * 
 * Install: npm install express
 * Run: node clear-endpoint.js
 */

const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static('.'));

// Clear data endpoint
app.get('/clear-data', (req, res) => {
    // Set Clear-Site-Data header
    res.set({
        'Clear-Site-Data': '"cache", "cookies", "storage", "executionContexts"',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*'
    });

    // Send HTML response
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Clearing Data...</title>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            text-align: center;
            padding: 40px;
            background: rgba(255,255,255,0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        .spinner {
            border: 4px solid rgba(255,255,255,0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🗑️ All Data Cleared!</h1>
        <div class="spinner"></div>
        <p>✅ Cache cleared<br>
           ✅ Cookies cleared<br>
           ✅ Storage cleared<br>
           ✅ Execution contexts cleared</p>
        <p>Redirecting...</p>
    </div>
    <script>
        setTimeout(() => {
            window.location.replace('/');
        }, 2000);
    </script>
</body>
</html>
    `);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📝 Clear endpoint: http://localhost:${PORT}/clear-data`);
});
