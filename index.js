// index.js

const app = require("./src/app");

const port = 3000;

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});