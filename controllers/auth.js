const { BadRequestError, UnauthenticatedError } = require('../errors');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');

module.exports = {
	register: async (req, res) => {
		const user = await User.create({ ...req.body });
		const token = user.createJwt();
		res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
	},
	login: async (req, res) => {
		const { email, password } = req.body;

		if (!email || !password) {
			throw new BadRequestError('Email and password are required.');
		}

		const user = await User.findOne({ email });

		if (!user) {
			throw new UnauthenticatedError('Invalid credentials provided.');
		}

		const isCorrect = await user.comparePassword(password);
		if (!isCorrect) {
			throw new UnauthenticatedError('Invalid credentials provided.');
		}

		const token = user.createJwt();
		res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
	}
};
