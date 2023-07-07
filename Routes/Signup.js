const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db = require('../Database/db');

router.post('/', async (req, res) => {
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

module.exports = router;
