require("dotenv").config();

const app = require("./src/app");
const pool = require("./src/config/database");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        
        await pool.query("SELECT 1");

        console.log("Database connected successfully");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Database connection failed:");
        console.error(error.message);

        process.exit(1);
    }
};

startServer();