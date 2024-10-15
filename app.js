require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const connectDb = require("./config/dbConnection");
const bodyParser = require('body-parser');

connectDb();

const app = express();
const http = require('http').Server(app);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', './views');

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', userRoutes);

http.listen(3000, function () {
    console.log('Server is running');
});
