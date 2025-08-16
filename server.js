require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise'); // Using promise-based version
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create HTTP server
const server = http.createServer(app);

// Database connection pool (better than single connection)
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'vehicle',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
pool.getConnection()
    .then(conn => {
        console.log('Connected to MySQL Database');
        conn.release();
    })
    .catch(err => {
        console.error('Database connection failed:', err.message);
    });

// Signup API Route
app.post('/signup', async (req, res) => {
    try {
        const { username, email, mobile, password } = req.body;

        // Check if email exists
        const [rows] = await pool.execute(
            "SELECT * FROM users WHERE email = ?", 
            [email]
        );

        if (rows.length > 0) {
            return res.status(409).json({ message: "Email already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const [result] = await pool.execute(
            "INSERT INTO users (username, email, mobile_number, password_hash) VALUES (?, ?, ?, ?)",
            [username, email, mobile, hashedPassword]
        );

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ message: "Error registering user", error: err.message });
    }
});

// Login API Route
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        // Find user
        const [rows] = await pool.execute(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        res.status(200).json({ 
            message: "Login successful!",
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Error during login", error: err.message });
    }
});
// Payment Processing API
app.post("/process-payment", async (req, res) => {
    try {
        const { 
            name, email, phone, age, location, vehicleType, model, 
            duration, durationValue, totalPrice 
        } = req.body;

        console.log("Received data:", req.body);  // Log the request data

        // Validation
        if (!name || !email || !phone || !age || !location || 
            !vehicleType || !model || !duration || !durationValue || !totalPrice) {
            console.log("Validation failed: Missing required fields.");
            return res.status(400).json({ success: false, error: "All fields are required." });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log("Validation failed: Invalid email format.");
            return res.status(400).json({ success: false, error: "Invalid email format." });
        }

        // Phone validation
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            console.log("Validation failed: Invalid phone format.");
            return res.status(400).json({ success: false, error: "Invalid phone number format." });
        }

        // Age validation
        const ageValue = parseInt(age);
        if (isNaN(ageValue) || ageValue < 18 || ageValue > 110) {
            console.log("Validation failed: Invalid age.");
            return res.status(400).json({ success: false, error: "Age must be between 18 and 100." });
        }

        // Database insertion
        console.log("Inserting payment into database...");
        const [result] = await pool.execute(
            `INSERT INTO payments 
            (name, email, phone, age, location, vehicle_type, model, duration, duration_value, total_price) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, email, phone, age, location, vehicleType, model, duration, durationValue, totalPrice]
        );
        console.log("Payment inserted with ID:", result.insertId);

        // Send success response
        res.status(200).json({
            success: true,
            message: "Payment recorded successfully",
            paymentId: result.insertId,
            redirectUrl: `/manualpayment.html?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&age=${encodeURIComponent(age)}&location=${encodeURIComponent(location)}&vehicleType=${encodeURIComponent(vehicleType)}&model=${encodeURIComponent(model)}&duration=${encodeURIComponent(duration)}&durationValue=${encodeURIComponent(durationValue)}&totalPrice=${encodeURIComponent(totalPrice)}`
        });
    } catch (err) {
        console.error("Payment processing failed:", err);
        res.status(500).json({ success: false, error: "Database error", details: err.message });
    }
});


// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server with port handling
const port = process.env.PORT || 5000;

server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.log(`Port ${port} in use, retrying with ${parseInt(port) + 1}...`);
        server.listen(parseInt(port) + 1);
    }
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        pool.end()
            .then(() => {
                console.log('Database pool closed');
                process.exit(0);
            })
            .catch(err => {
                console.error('Error closing database pool:', err);
                process.exit(1);
            });
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    server.close(() => {
        pool.end()
            .then(() => {
                console.log('Database pool closed');
                process.exit(0);
            })
            .catch(err => {
                console.error('Error closing database pool:', err);
                process.exit(1);
            });
    });
});