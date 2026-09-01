const express = require("express");
const port = 3000;

let nextId = 1;
const students = [
    { id: nextId++, name: "Alice", course: "BSCS" },
    { id: nextId++, name: "Bob", course: "BSIT" },
    { id: nextId++, name: "Cara", course: "BSCS" },
];

const app = express();

app.use(express.json());

// GET all students
app.get("/students", (request, response) => {
    response.send(students);
});

// GET a single student by ID
app.get("/students/:id", (request, response) => {
    const id = parseInt(request.params.id);
    const student = students.find((s) => s.id === id);

    if (!student) {
        return response.status(404).send({ message: "Student not found" });
    }

    response.send(student);
});

// POST - Create a new student
app.post("/students", (request, response) => {
    const newName = request.body.name;
    const newCourse = request.body.course;

    const newStudent = { id: nextId++, name: newName, course: newCourse };

    students.push(newStudent);

    response.send(newStudent);
});

// PUT - Update an existing student by ID
app.put("/students/:id", (request, response) => {
    const id = parseInt(request.params.id);
    const student = students.find((s) => s.id === id);

    if (!student) {
        return response.status(404).send({ message: "Student not found" });
    }

    if (request.body.name) {
        student.name = request.body.name;
    }

    if (request.body.course) {
        student.course = request.body.course;
    }

    response.send(student);
});

// DELETE - Remove a student by ID
app.delete("/students/:id", (request, response) => {
    const id = parseInt(request.params.id);
    const index = students.findIndex((s) => s.id === id);

    if (index === -1) {
        return response.status(404).send({ message: "Student not found" });
    }

    const deletedStudent = students.splice(index, 1)[0];

    response.send(deletedStudent);
});

app.listen(port, () => {
    console.log(`App is listening to port ${port}`);
});
