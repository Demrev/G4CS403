const pool = require("../config/database");

const findStudentByEmail = async (email) => {
    const result = await pool.query(
        `
        SELECT
            id,
            name,
            course,
            email,
            password_hash
        FROM students
        WHERE LOWER(email) = LOWER($1)
        `,
        [email]
    );

    return result.rows[0] || null;
};

const findStudentById = async (id) => {
    const result = await pool.query(
        `
        SELECT
            id,
            name,
            course,
            email
        FROM students
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0] || null;
};

const createStudent = async (
    name,
    course,
    email,
    passwordHash
) => {
    const result = await pool.query(
        `
        INSERT INTO students (
            name,
            course,
            email,
            password_hash
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
            id,
            name,
            course,
            email
        `,
        [
            name,
            course,
            email,
            passwordHash
        ]
    );

    return result.rows[0];
};

const saveRefreshToken = async (
    studentId,
    tokenHash,
    expiresAt
) => {
    await pool.query(
        `
        INSERT INTO refresh_tokens (
            student_id,
            token_hash,
            expires_at
        )
        VALUES ($1, $2, $3)
        `,
        [
            studentId,
            tokenHash,
            expiresAt
        ]
    );
};

const findRefreshToken = async (tokenHash) => {
    const result = await pool.query(
        `
        SELECT
            id,
            student_id,
            token_hash,
            expires_at
        FROM refresh_tokens
        WHERE token_hash = $1
          AND expires_at > NOW()
        `,
        [tokenHash]
    );

    return result.rows[0] || null;
};

const deleteRefreshToken = async (tokenHash) => {
    await pool.query(
        `
        DELETE FROM refresh_tokens
        WHERE token_hash = $1
        `,
        [tokenHash]
    );
};

module.exports = {
    findStudentByEmail,
    findStudentById,
    createStudent,
    saveRefreshToken,
    findRefreshToken,
    deleteRefreshToken,
};