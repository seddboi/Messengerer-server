const express = require('express');
// const mysql = require('mysql2');
const { Client } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();

require('dotenv').config();

app.use(express.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', 'https://localhost:5173/');
	next();
});

app.use(cors());

const db = new Client({
	user: 'postgres',
	host: 'containers-us-west-3.railway.app',
	database: 'railway',
	password: 'UNS7uz1swhCkO0GHRDwU',
	port: 5643,
});

db.connect((err) => {
	if (err) throw err;
	console.log('Connected to database!');
});

app.post('/signup', async (req, res) => {
	const username = req.body.username;
	const email = req.body.email;
	const hashedPassword = await bcrypt.hash(req.body.password, 10);

	db.query(`SELECT * FROM users WHERE email = '${email}'`, (err, result) => {
		// console.log(result);

		if (result.rows.length > 0) {
			console.log('duplicate email error triggered');
			res.send({ message: 'Email already exists. Please login.' });
		} else {
			db.query(
				`INSERT INTO users (username, password, email) VALUES ('${username}', '${hashedPassword}', '${email}')`,
				(err, result) => {
					if (err) {
						res.send({ err: err, message: 'Signup error, please try again.' });
					} else {
						db.query('SELECT MAX(id) from users', (err, result) => {
							const userID = result.rows[0].max;
							const token = jwt.sign({ userID }, process.env.ACCESS_TOKEN);

							res.json({
								auth: true,
								token: token,
								result: { id: userID, username: username },
							});
						});

						console.log('User signed up!');
					}
				}
			);
		}
	});
});

app.post('/login', async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	console.log(username, password);
	db.query(`SELECT * FROM users WHERE username = '${username}'`, (err, result) => {
		if (result.rows.length > 0) {
			bcrypt.compare(password, result.rows[0].password, async (error, response) => {
				if (response) {
					const userID = result.rows[0].id;
					const token = jwt.sign({ userID }, process.env.ACCESS_TOKEN);

					res.json({
						auth: true,
						token: token,
						result: { id: userID, username: result.rows[0].username },
					});
				} else {
					res.send({ err: err, message: 'Wrong username or password.' });
				}
			});
		} else {
			res.send({ message: 'No user found.' });
		}
	});
});

app.listen(`${process.env.PORT}`, () => {
	console.log(`running server on port ${process.env.PORT}`);
});
