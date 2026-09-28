const express = require("express");

const studentRoutes =
    require("./routes/studentRoutes");

const authRoutes =
    require("./routes/authRoutes");


const app = express();

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = swaggerJsdoc({
    failOnErrors: true,
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Group 4 Students API",
            version: "1.0.0",
            description: "Student management and JWT authentication",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: ["./src/routes/*.js"],
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(express.json());


app.use(
    "/auth",
    authRoutes
);


app.use(
    "/students",
    studentRoutes
);


app.use((request, response) => {
    response.status(404).send({ message: "Route not found" });
});

app.use((error, request, response, next) => {
    if (response.headersSent) return next(error);
    if (error.type === "entity.parse.failed") {
        return response.status(400).send({ message: "Invalid JSON body" });
    }
    if (error.status >= 400 && error.status < 500) {
        return response.status(error.status).send({ message: "Invalid request body" });
    }
    console.error(error);
    response.status(500).send({ message: "Internal server error" });
});

module.exports = app;
