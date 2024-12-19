const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcryptjs');

module.exports = {
	register: async (req, res) => {
		const { name, email, password } = req.body;
		const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS) || 10);
		const passwordHash = await bcrypt.hash(password, salt);

		const user = await User.create({ name, email, password: passwordHash });
		res.status(StatusCodes.CREATED).json({ user });
	},
	login: async (req, res) => {
		res.send('login');
	}
};
