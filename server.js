const express = require('express');
// const mysql = require('mysql2');
const cors = require('cors');
const db = require('./Database/db');

const app = express();

require('dotenv').config();

app.use(express.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', 'https://localhost:5173/');
	next();
});

app.use(cors());

db.connect((err) => {
	if (err) throw err;
	console.log('Connected to database!');
});

const signupRoute = require('./Routes/Signup');
const loginRoute = require('./Routes/Login');

app.use('/signup', signupRoute);
app.use('/login', loginRoute);

app.listen(`${process.env.PORT}`, () => {
	console.log(`running server on port ${process.env.PORT}`);
});
