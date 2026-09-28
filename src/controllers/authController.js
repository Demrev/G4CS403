const { isText, isEmail, isPassword } = require("../validations/input");
const bcrypt = require("bcryptjs");

const authModel = require("../models/authModel");

const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    hashToken,
} = require("../services/tokenService");


const createTokenPair = async (student) => {

    const accessToken =
        generateAccessToken(student);

    const refreshToken =
        generateRefreshToken(student);

    const refreshTokenHash =
        hashToken(refreshToken);

    const decoded = verifyRefreshToken(
        refreshToken
    );

    const expiresAt =
        new Date(decoded.exp * 1000);

    await authModel.saveRefreshToken(
        student.id,
        refreshTokenHash,
        expiresAt
    );

    return {
        accessToken,
        refreshToken
    };
};


// REGISTER
const register = async (request, response) => {

    try {

        const {
            name,
            course,
            email,
            password
        } = request.body || {};


        if (
            !isText(name, 100) ||
            !isText(course, 50) ||
            !isEmail(email) ||
            !isPassword(password)
        ) {
            return response.status(400).send({
                message:
                    "Provide nonblank name (max 100 characters), course (max 50), valid email (max 150), and password (max 72 UTF-8 bytes)"
            });
        }


        const existingStudent =
            await authModel.findStudentByEmail(
                email
            );


        if (existingStudent) {
            return response.status(409).send({
                message:
                    "Email is already registered"
            });
        }


        const passwordHash =
            await bcrypt.hash(
                password,
                12
            );


        const student =
            await authModel.createStudent(
                name,
                course,
                email.toLowerCase(),
                passwordHash
            );


        response.status(201).send({
            message:
                "Student registered successfully",

            student
        });

    } catch (error) {
        if (error.code === "23505" && error.constraint === "students_email_unique") {
            return response.status(409).send({ message: "Email is already registered" });
        }

        console.error(
            "REGISTER ERROR:",
            error
        );

        response.status(500).send({
            message:
                "Registration failed"
        });
    }
};


// LOGIN
const login = async (request, response) => {

    try {

        const {
            email,
            password
        } = request.body || {};


        if (!isEmail(email) || !isPassword(password)) {
            return response.status(400).send({
                message:
                    "A valid email and nonblank password (max 72 UTF-8 bytes) are required"
            });
        }


        const student =
            await authModel.findStudentByEmail(
                email
            );


        if (!student || typeof student.password_hash !== "string") {
            return response.status(401).send({
                message:
                    "Invalid email or password"
            });
        }


        const passwordIsValid =
            await bcrypt.compare(
                password,
                student.password_hash
            );


        if (!passwordIsValid) {
            return response.status(401).send({
                message:
                    "Invalid email or password"
            });
        }


        const {
            accessToken,
            refreshToken
        } = await createTokenPair(student);


        response.send({

            message:
                "Login successful",

            accessToken,

            refreshToken,

            student: {
                id: student.id,
                name: student.name,
                course: student.course,
                email: student.email
            }
        });

    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );

        response.status(500).send({
            message:
                "Login failed"
        });
    }
};


// REFRESH TOKEN
const refresh = async (
    request,
    response
) => {

    try {

        const {
            refreshToken
        } = request.body || {};


        if (!isText(refreshToken)) {
            return response.status(400).send({
                message:
                    "Refresh token must be a nonblank string"
            });
        }


        const payload =
            verifyRefreshToken(
                refreshToken
            );


        const tokenHash =
            hashToken(
                refreshToken
            );


        const savedToken =
            await authModel.findRefreshToken(
                tokenHash
            );


        if (!savedToken) {
            return response.status(401).send({
                message:
                    "Invalid or revoked refresh token"
            });
        }


        const student =
            await authModel.findStudentById(
                payload.sub
            );


        if (!student) {
            return response.status(401).send({
                message:
                    "Student no longer exists"
            });
        }


        // Refresh-token rotation
        await authModel.deleteRefreshToken(
            tokenHash
        );


        const newTokens =
            await createTokenPair(
                student
            );


        response.send({
            message:
                "Token refreshed successfully",

            ...newTokens
        });

    } catch (error) {

        console.error(
            "REFRESH ERROR:",
            error
        );

        const invalidToken = ["JsonWebTokenError", "TokenExpiredError", "NotBeforeError"]
            .includes(error.name);
        response.status(invalidToken ? 401 : 500).send({
            message: invalidToken ? "Invalid or expired refresh token" : "Token refresh failed"
        });
    }
};


// LOGOUT
const logout = async (
    request,
    response
) => {

    try {

        const {
            refreshToken
        } = request.body || {};


        if (!isText(refreshToken)) {
            return response.status(400).send({
                message:
                    "Refresh token must be a nonblank string"
            });
        }


        const tokenHash =
            hashToken(
                refreshToken
            );


        await authModel.deleteRefreshToken(
            tokenHash
        );


        response.send({
            message:
                "Logout successful"
        });

    } catch (error) {

        console.error(
            "LOGOUT ERROR:",
            error
        );

        response.status(500).send({
            message:
                "Logout failed"
        });
    }
};


module.exports = {
    register,
    login,
    refresh,
    logout
};