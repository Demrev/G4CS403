const studentModel = require("../models/studentModel");

const getStudents = async (request, response) => {
    try {
        const students = await studentModel.getAllStudents();

        response.send(students);
    } catch (error) {
        console.error(error);

        response.status(500).send({
            message: "Database error",
        });
    }
};

const getStudent = async (request, response) => {
    try {
        const id = Number(request.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return response.status(400).send({
                message: "Invalid student ID",
            });
        }

        const student = await studentModel.getStudentById(id);

        if (!student) {
            return response.status(404).send({
                message: "Student not found",
            });
        }

        response.send(student);
    } catch (error) {
        console.error(error);

        response.status(500).send({
            message: "Database error",
        });
    }
};

const createStudent = async (request, response) => {
    try {
        const { name, course } = request.body || {};

        console.log("REQUEST BODY:", request.body);

        if (!name || !course) {
            return response.status(400).send({
                message: "Name and course are required",
            });
        }

        const newStudent = await studentModel.createStudent(
            name,
            course
        );

        response.status(201).send(newStudent);

    } catch (error) {
        console.error("CREATE STUDENT ERROR:");
        console.error("Message:", error.message);
        console.error("Code:", error.code);
        console.error("Detail:", error.detail);
        console.error("Table:", error.table);
        console.error("Constraint:", error.constraint);
        console.error("Stack:", error.stack);

        response.status(500).send({
            message: "Database error",
            error: error.message,
            code: error.code,
            detail: error.detail,
        });
    }
};

const updateStudent = async (request, response) => {
    try {
        const id = Number(request.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return response.status(400).send({
                message: "Invalid student ID",
            });
        }

        const { name, course } = request.body;

        const updatedStudent = await studentModel.updateStudent(
            id,
            name ?? null,
            course ?? null
        );

        if (!updatedStudent) {
            return response.status(404).send({
                message: "Student not found",
            });
        }

        response.send(updatedStudent);
    } catch (error) {
        console.error(error);

        response.status(500).send({
            message: "Database error",
        });
    }
};

const deleteStudent = async (request, response) => {
    try {
        const id = Number(request.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return response.status(400).send({
                message: "Invalid student ID",
            });
        }

        const deletedStudent = await studentModel.deleteStudent(id);

        if (!deletedStudent) {
            return response.status(404).send({
                message: "Student not found",
            });
        }

        response.send(deletedStudent);
    } catch (error) {
        console.error(error);

        response.status(500).send({
            message: "Database error",
        });
    }
};

module.exports = {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
};