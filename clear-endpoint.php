<?php
/**
 * CLEAR-SITE-DATA ENDPOINT
 * This endpoint uses the Clear-Site-Data HTTP header to instruct
 * browsers to clear cache, cookies, storage, and execution contexts.
 * 
 * USAGE: Redirect to this page when user clicks "Clear All Data"
 */

// Set the Clear-Site-Data header
// This is a W3C standard that browsers must respect
header('Clear-Site-Data: "cache", "cookies", "storage", "executionContexts"');

// Also set cache control headers to prevent caching of this page
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

// Optional: Add CORS headers if needed
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');

// Return a simple HTML page that confirms clearing and redirects back
?>
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
        <h1>🗑️ Clearing All Data...</h1>
        <div class="spinner"></div>
        <p>Browser cache, cookies, and storage cleared!</p>
        <p>Redirecting back...</p>
    </div>
    
    <script>
        // Wait 2 seconds then redirect back to the main app
        setTimeout(() => {
            // Use replace to avoid adding to history
            window.location.replace('index.html');
        }, 2000);
    </script>
</body>
</html>
