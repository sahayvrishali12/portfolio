const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname)));

// Route all other GET requests to the main index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 Portfolio server is running!`);
    console.log(`🌐 Local: http://localhost:${PORT}`);
    console.log(`=================================================`);
});
