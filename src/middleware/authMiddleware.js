const jwt = require("jsonwebtoken");

const authenticateToken = (request, response, next) => {
    try {
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            return response.status(401).send({
                message: "Access token is required"
            });
        }

        const parts = authHeader.split(" ");

        if (
            parts.length !== 2 ||
            parts[0] !== "Bearer"
        ) {
            return response.status(401).send({
                message: "Invalid authorization format"
            });
        }

        const token = parts[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        );

        request.user = {
            id: decoded.sub,
            email: decoded.email
        };

        next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return response.status(401).send({
                message: "Access token expired"
            });
        }

        return response.status(401).send({
            message: "Invalid access token"
        });
    }
};

module.exports = authenticateToken;