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

app.listen(5000, () => console.log("Server running on port 5000"));
