const express = require("express");

const {
    register,
    login,
    refresh,
    logout
} = require("../controllers/authController");

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a student
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, course, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: Test Student
 *               course:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 example: BSCS
 *               email:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 150
 *                 example: student@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 1
 *                 description: Nonblank password, at most 72 UTF-8 bytes.
 *                 example: TestPassword123!
 *     responses:
 *       '201':
 *         description: Student registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 student:
 *                   $ref: '#/components/schemas/RegisteredStudent'
 *       '400':
 *         description: Required fields missing or invalid, or malformed JSON
 *       '409':
 *         description: Email is already registered
 *       '500':
 *         description: Registration failed
 * components:
 *   schemas:
 *     RegisteredStudent:
 *       allOf:
 *         - $ref: '#/components/schemas/Student'
 *         - type: object
 *           properties:
 *             email:
 *               type: string
 *               example: student@example.com
 *     TokenPair:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         accessToken:
 *           type: string
 *           description: Paste this token into Authorize without the Bearer prefix.
 *         refreshToken:
 *           type: string
 *           description: Send this token in the JSON body for refresh or logout.
 *   requestBodies:
 *     RefreshToken:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: paste-your-refresh-token-here
 */
router.post(
    "/register",
    register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in and get access and refresh tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 150
 *                 example: student@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 1
 *                 description: Nonblank password, at most 72 UTF-8 bytes.
 *                 example: TestPassword123!
 *     responses:
 *       '200':
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/TokenPair'
 *                 - type: object
 *                   properties:
 *                     student:
 *                       $ref: '#/components/schemas/RegisteredStudent'
 *       '400':
 *         description: Email or password missing or invalid, or malformed JSON
 *       '401':
 *         description: Invalid email or password
 *       '500':
 *         description: Login failed
 */
router.post(
    "/login",
    login
);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Exchange a refresh token for new tokens
 *     description: Use the returned refresh token for subsequent refresh and logout requests.
 *     tags: [Authentication]
 *     requestBody:
 *       $ref: '#/components/requestBodies/RefreshToken'
 *     responses:
 *       '200':
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenPair'
 *       '400':
 *         description: Refresh token missing or not a nonblank string, or malformed JSON
 *       '401':
 *         description: Invalid, expired, or revoked token, or missing student
 *       '500':
 *         description: Token refresh failed
 */
router.post(
    "/refresh",
    refresh
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Revoke a refresh token
 *     description: Existing access tokens remain usable until they expire.
 *     tags: [Authentication]
 *     requestBody:
 *       $ref: '#/components/requestBodies/RefreshToken'
 *     responses:
 *       '200':
 *         description: Logout successful
 *         content:
 *           application/json:
 *             example:
 *               message: Logout successful
 *       '400':
 *         description: Refresh token missing or not a nonblank string, or malformed JSON
 *       '500':
 *         description: Logout failed
 */
router.post(
    "/logout",
    logout
);

module.exports = router;
