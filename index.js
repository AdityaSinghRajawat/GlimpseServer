const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const postRoutes = require('./routes/posts.js');
const userRoutes = require('./routes/users.js');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

PORT = process.env.PORT || 5000;

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use('/posts', postRoutes);
app.use('/user', userRoutes);


const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Database Connected');
    })
    .catch(e => {
        console.log(e.message);
    });

app.get('/', (req, res) => {
    res.send('<h1>Server is Running</h1>')
})

app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});
