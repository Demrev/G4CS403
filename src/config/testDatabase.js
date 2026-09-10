const pool = require("./database");

const testDatabase = async () => {
    try {
        const result = await pool.query(`
            SELECT
                current_database() AS database,
                current_user AS user,
                NOW() AS time
        `);

        console.log("Database connected successfully!");
        console.log(result.rows[0]);
    } catch (error) {
        console.error("Database connection failed:");
        console.error(error.message);
    } finally {
        await pool.end();
    }
};

testDatabase();