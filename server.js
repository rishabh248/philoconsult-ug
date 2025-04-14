const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const querySchema = new mongoose.Schema({
    name: String,
    email: String,
    query: String,
    submittedAt: { type: Date, default: Date.now }
});

const Query = mongoose.model('Query', querySchema);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/submit-query', async (req, res) => {
    const { name, email, query } = req.body;

    try {
        const newQuery = new Query({ name, email, query });
        await newQuery.save();
        res.json({ message: 'Query submitted successfully!' });
    } catch (error) {
        console.error('Error saving query:', error);
        res.status(500).json({ message: 'Error submitting query.' });
    }
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/queries', async (req, res) => {
    try {
        const queries = await Query.find().sort({ submittedAt: -1 });
        res.json(queries);
    } catch (error) {
        console.error('Error fetching queries:', error);
        res.status(500).json({ message: 'Error fetching queries.' });
    }
});

app.post('/reply-query', async (req, res) => {
    const { email, reply } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reply to Your Query - PhiloConsult',
        text: reply
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: 'Reply sent successfully!' });
    } catch (error) {
        console.error('Error sending reply:', error);
        res.status(500).json({ message: 'Error sending reply.' });
    }
});

const PORT = process.env.PORT || 10001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));