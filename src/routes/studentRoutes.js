const express = require("express");

const studentController =
    require("../controllers/studentController");

const authenticateToken =
    require("../middleware/authMiddleware");

const router = express.Router();


/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   course:
 *                     type: string
 *       '401':
 *         description: Missing, invalid, or expired access token
 *       '500':
 *         description: Database error
 */

router.get(
    "/",
    authenticateToken,
    studentController.getStudents
);

/**
 * @swagger
 * /students/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *         minimum: 1
 *         maximum: 2147483647
 *       description: Student ID returned by registration or the student list
 *   get:
 *     summary: Get one student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Student found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       '400':
 *         description: Invalid student ID
 *       '401':
 *         description: Missing, invalid, or expired access token
 *       '404':
 *         description: Student not found
 *       '500':
 *         description: Database error
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Test Student
 *         course:
 *           type: string
 *           example: BSCS
 */
router.get(
    "/:id",
    authenticateToken,
    studentController.getStudent
);

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Update a student
 *     description: Provide at least one nonblank name or course. Omitted fields retain their current values; null is rejected.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             anyOf:
 *               - required: [name]
 *               - required: [course]
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *                 minLength: 1
 *               course:
 *                 type: string
 *                 maxLength: 50
 *                 minLength: 1
 *           example:
 *             name: Updated Student
 *             course: BSIT
 *     responses:
 *       '200':
 *         description: Updated student
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       '400':
 *         description: Invalid student ID, missing or invalid fields, or malformed JSON
 *       '401':
 *         description: Missing, invalid, or expired access token
 *       '404':
 *         description: Student not found
 *       '500':
 *         description: Database error
 */
router.put(
    "/:id",
    authenticateToken,
    studentController.updateStudent
);

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Delete a student
 *     description: Deletes the student and their saved refresh tokens.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Deleted student
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       '400':
 *         description: Invalid student ID
 *       '401':
 *         description: Missing, invalid, or expired access token
 *       '404':
 *         description: Student not found
 *       '500':
 *         description: Database error
 */
router.delete(
    "/:id",
    authenticateToken,
    studentController.deleteStudent
);

module.exports = router;
