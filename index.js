const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Welcome to our application!');
});

app.get('/welcome', (req, res) => {
    res.send('<h1>Welcome!</h1><p>We are glad you are here, We are the Group 2.</p>');
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
