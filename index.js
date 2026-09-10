require("dotenv").config();

const app = require("./src/app");

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});