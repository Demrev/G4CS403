require("dotenv").config();

const app = require("./src/app");
const pool = require("./src/config/database");
const initDatabase = require("./src/config/initDatabase");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Check database connection
        await pool.query("SELECT 1");

        console.log("Database connected successfully");

        // Create/update required tables
        await initDatabase();

        console.log("Database initialized successfully");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:");
        console.error(error.message);

        process.exit(1);
    }
};

startServer();