// app.js
const express = require('express');
const app = express();

const PORT = 4000;
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const cors = require('cors');

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

app.use(bodyParser.json());
app.use(cors());


const SECRET_KEY = 'your_secret_key';

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'foodie finder',
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Register API
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input (basic validation for demonstration)
    if (!username || !email || !password) {
        return res.status(400).send({ message: 'All fields are required!' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, hashedPassword], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).send({ message: 'Email or username already exists!' });
            }
            return res.status(500).send(err);
        }
        res.status(201).send({ message: 'User registered successfully!' });
    });
});

// Login API
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], async (err, results) => {
        if (err) return res.status(500).send(err);

        if (results.length === 0) {
            return res.status(401).send({ message: 'User not found!' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send({ message: 'Invalid credentials!' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
            expiresIn: '1h',
        });

        res.status(200).send({
            token,
            redirectURL: 'main.html', // Add this field
        });
    });
});

// Verify Token Middleware
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send({ message: 'Token required!' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).send({ message: 'Invalid token!' });
        req.user = decoded;
        next();
    });
};



app.listen(3000, () => {
    console.log('Server running on http://localhost:4000');
});

