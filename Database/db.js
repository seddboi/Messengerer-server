const { Client } = require('pg');

const db = new Client({
	user: 'postgres',
	host: 'containers-us-west-3.railway.app',
	database: 'railway',
	password: 'UNS7uz1swhCkO0GHRDwU',
	port: 5643,
});

module.exports = db;
