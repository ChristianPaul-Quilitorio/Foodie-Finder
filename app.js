// app.js
const express = require('express');
const app = express();
const PORT = 4000;
const path = require('path');

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname)));


// Route for the homepage
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'landing.html'));
});

app.use('/api', (req, res, next) => {
    if (req.url.endsWith('.css') || req.url.endsWith('.js') || req.url.includes('assets/')) {
        const filePath = path.join(__dirname, req.url);
        console.log(`Attempting to serve file from: ${filePath}`);
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error(`Error serving file: ${err}`);
                res.status(404).end();
            }
        });
    } else {
        next();
    }
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Server root directory: ${__dirname}`);
});
