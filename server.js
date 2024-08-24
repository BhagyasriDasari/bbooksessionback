const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

// Route to create a new student
app.post('/api/students', (req, res) => {
    const { name, area_of_interest } = req.body;
    const query = `INSERT INTO students (name, area_of_interest) VALUES (?, ?)`;

    db.run(query, [name, area_of_interest], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
});

// Route to get all students
app.get('/api/students', (req, res) => {
    const query = `SELECT * FROM students`;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});

// Route to create a new mentor
app.post('/api/mentors', (req, res) => {
    console.log("Attempting to add mentor:", req.body);
    const { name, area_of_expertise, is_premium = 0, company_name } = req.body;
    const query = `INSERT INTO mentors (name, area_of_expertise, is_premium, company_name) VALUES (?, ?, ?, ?)`;

    db.run(query, [name, area_of_expertise, is_premium, company_name], function(err) {
        if (err) {
            console.error("Error inserting mentor:", err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log("Mentor added successfully with ID:", this.lastID);
        res.status(201).json({ id: this.lastID });
    });
});

// Route to get all mentors by area of expertise
app.get('/api/mentors', (req, res) => {
    const { area_of_expertise } = req.query;

    let query = 'SELECT * FROM mentors';
    const params = [];

    if (area_of_expertise) {
        query += ' WHERE area_of_expertise = ?';
        params.push(area_of_expertise);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Error fetching mentors:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});


// Route to create a new session
app.post('/api/sessions', (req, res) => {
    const { student_id, mentor_id, duration, session_time } = req.body;
    const query = `
        INSERT INTO sessions (student_id, mentor_id, duration, session_time)
        VALUES (?, ?, ?, ?)
    `;

    db.run(query, [student_id, mentor_id, duration, session_time], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
});

// Route to get all sessions
app.get('/api/sessions', (req, res) => {
    const query = `
        SELECT s.id, s.duration, s.session_time, st.name AS student_name, m.name AS mentor_name
        FROM sessions s
        JOIN students st ON s.student_id = st.id
        JOIN mentors m ON s.mentor_id = m.id
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
