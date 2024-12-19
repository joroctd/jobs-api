const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');

module.exports = {
	register: async (req, res) => {
		const user = await User.create({ ...req.body });
		const token = user.createJwt();
		res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
	},
	login: async (req, res) => {
		res.send('login');
	}
};
