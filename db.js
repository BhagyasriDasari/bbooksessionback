// db.js
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error connecting to the database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

db.serialize(() => {
    // Create Students table
    db.run(`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            area_of_interest TEXT NOT NULL
        )
    `);

    // Create Mentors table
    db.run(`
        CREATE TABLE IF NOT EXISTS mentors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            area_of_expertise TEXT NOT NULL,
            is_premium INTEGER DEFAULT 0,
            company_name TEXT
        )
    `);

    // Create Sessions table
    db.run(`
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER,
            mentor_id INTEGER,
            duration INTEGER,
            session_time TEXT,
            FOREIGN KEY (student_id) REFERENCES students(id),
            FOREIGN KEY (mentor_id) REFERENCES mentors(id)
        )
    `);

    // Create Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            company_name TEXT,
            role TEXT NOT NULL,
            password TEXT NOT NULL
        )
    `);
});

module.exports = db;
