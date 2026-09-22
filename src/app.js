const express = require("express");

const studentRoutes =
    require("./routes/studentRoutes");

const authRoutes =
    require("./routes/authRoutes");


const app = express();


app.use(express.json());


app.use(
    "/auth",
    authRoutes
);


app.use(
    "/students",
    studentRoutes
);


module.exports = app;