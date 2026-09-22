const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const generateAccessToken = (student) => {
    return jwt.sign(
        {
            sub: student.id,
            email: student.email
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m"
        }
    );
};

const generateRefreshToken = (student) => {
    return jwt.sign(
        {
            sub: student.id
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d"
        }
    );
};

const verifyRefreshToken = (token) => {
    return jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET
    );
};

const hashToken = (token) => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    hashToken,
};