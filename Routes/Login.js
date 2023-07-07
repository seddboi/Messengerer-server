const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db = require('../Database/db');

router.post('/', async (req, res) => {
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

module.exports = router;
