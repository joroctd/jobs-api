const { UnauthenticatedError, BadRequestError } = require('../errors');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');

module.exports = {
	register: async (req, res) => {
		// create user
		const user = await User.create({ ...req.body });

		// create jwt
		const token = user.createJwt();

		// send needed user info and jwt
		res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
	},
	login: async (req, res) => {}
};
