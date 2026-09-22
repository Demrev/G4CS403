const express = require("express");

const studentController =
    require("../controllers/studentController");

const authenticateToken =
    require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/",
    authenticateToken,
    studentController.getStudents
);

router.get(
    "/:id",
    authenticateToken,
    studentController.getStudent
);

router.put(
    "/:id",
    authenticateToken,
    studentController.updateStudent
);

router.delete(
    "/:id",
    authenticateToken,
    studentController.deleteStudent
);

module.exports = router;