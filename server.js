const express = require('express');
const path = require('path');
const app = express();

// Serve static files (CSS, JS, images, node_modules)
app.use(express.static(path.join(__dirname)));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API route for form submission
app.use(express.json());
app.post('/api/submit-query', (req, res) => {
    const { name, email, category, query } = req.body;
    if (name && email && category && query) {
        console.log('Query received:', { name, email, category, query });
        res.json({ message: 'Query submitted successfully!' });
    } else {
        res.status(400).json({ message: 'All fields are required.' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});