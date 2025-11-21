const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "@Kshay2005",
    database: "coneckt"
});

db.connect((err) => {
    if (err) throw err;
    console.log("Database Connected");
});

// Signup API
app.post("/signup", async (req, res) => {
    const { full_name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query("INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)",
        [full_name, email, hashedPassword],
        (err) => {
            if (err) return res.status(400).json({ message: "User already exists" });
            res.json({ message: "Signup Successful" });
        }
    );
});

// Login API
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if (err || result.length === 0) return res.status(400).json({ message: "User not found" });

        const user = result[0];
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) return res.status(401).json({ message: "Wrong Password" });

        const token = jwt.sign({ id: user.id }, "secretkey");
        res.json({ message: "Login Success", token, user_id: user.id, user_name: user.full_name });
    });
});

// Save message
app.post("/send-message", (req, res) => {
    const { sender_id, receiver_id, message_text } = req.body;

    db.query(
        "INSERT INTO messages (sender_id, receiver_id, message_text) VALUES (?, ?, ?)",
        [sender_id, receiver_id, message_text],
        (err) => {
            if (err) return res.status(500).json({ message: "Error saving message" });
            res.json({ message: "Message Saved" });
        }
    );
});

// Load chat history
app.get("/messages", (req, res) => {
    const { sender_id, receiver_id } = req.query;

    db.query(
        `SELECT sender_id, receiver_id, message_text, timestamp 
         FROM messages 
         WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
         ORDER BY timestamp`,
        [sender_id, receiver_id, receiver_id, sender_id],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Error loading messages" });
            res.json(result);
        }
    );
});


app.listen(5000, () => console.log("Server running on port 5000"));
