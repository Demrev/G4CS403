const pool = require("./database");

const initializeDatabase = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS students (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                course VARCHAR(50) NOT NULL
            )
        `);

        console.log("Students table created successfully.");
    } catch (error) {
        console.error("Database initialization failed:");
        console.error(error.message);
    } finally {
        await pool.end();
    }
};

initializeDatabase();