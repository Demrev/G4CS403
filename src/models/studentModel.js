// src/models/studentModel.js

let nextId = 1;

const students = [
    { id: nextId++, name: "Alice", course: "BSCS" },
    { id: nextId++, name: "Bob", course: "BSIT" },
    { id: nextId++, name: "Cara", course: "BSCS" },
];

const getAllStudents = () => {
    return students;
};

const getStudentById = (id) => {
    return students.find((student) => student.id === id);
};

const createStudent = (name, course) => {
    const newStudent = {
        id: nextId++,
        name,
        course,
    };

    students.push(newStudent);

    return newStudent;
};

const updateStudent = (id, name, course) => {
    const student = students.find((student) => student.id === id);

    if (!student) {
        return null;
    }

    if (name) {
        student.name = name;
    }

    if (course) {
        student.course = course;
    }

    return student;
};

const deleteStudent = (id) => {
    const index = students.findIndex((student) => student.id === id);

    if (index === -1) {
        return null;
    }

    return students.splice(index, 1)[0];
};

module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
};