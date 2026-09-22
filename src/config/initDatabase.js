const pool = require("./database");

const initDatabase = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS students (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                course VARCHAR(50) NOT NULL
            )
        `);

        await pool.query(`
            ALTER TABLE students
            ADD COLUMN IF NOT EXISTS email VARCHAR(150)
        `);

        await pool.query(`
            ALTER TABLE students
            ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)
        `);

        await pool.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS students_email_unique
            ON students(email)
            WHERE email IS NOT NULL
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS refresh_tokens (
                id SERIAL PRIMARY KEY,
                student_id INTEGER NOT NULL
                    REFERENCES students(id)
                    ON DELETE CASCADE,

                token_hash VARCHAR(64) UNIQUE NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("Database initialized successfully.");

    } catch (error) {
        console.error("Database initialization failed:");
        console.error(error);

        throw error;
    }
};

module.exports = initDatabase;