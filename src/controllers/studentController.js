// src/controllers/studentController.js

const studentModel = require("../models/studentModel");

const getStudents = (request, response) => {
    const students = studentModel.getAllStudents();

    response.send(students);
};

const getStudent = (request, response) => {
    const id = parseInt(request.params.id);

    const student = studentModel.getStudentById(id);

    if (!student) {
        return response.status(404).send({
            message: "Student not found",
        });
    }

    response.send(student);
};

const createStudent = (request, response) => {
    const { name, course } = request.body;

    const newStudent = studentModel.createStudent(name, course);

    response.status(201).send(newStudent);
};

const updateStudent = (request, response) => {
    const id = parseInt(request.params.id);
    const { name, course } = request.body;

    const updatedStudent = studentModel.updateStudent(
        id,
        name,
        course
    );

    if (!updatedStudent) {
        return response.status(404).send({
            message: "Student not found",
        });
    }

    response.send(updatedStudent);
};

const deleteStudent = (request, response) => {
    const id = parseInt(request.params.id);

    const deletedStudent = studentModel.deleteStudent(id);

    if (!deletedStudent) {
        return response.status(404).send({
            message: "Student not found",
        });
    }

    response.send(deletedStudent);
};

module.exports = {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
};