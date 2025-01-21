const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

module.exports = async function auth(req, res, next) {
	const { authorization } = req.headers;

	// check for JSON Web Token
	if (!authorization?.startsWith('Bearer ')) {
		throw new UnauthenticatedError('Authentication invalid.');
	}

	const token = authorization.split(' ')[1];
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(payload.userId).select('name');
		if (user?.name !== payload.name) {
			throw new UnauthenticatedError('Authentication invalid.');
		}

		req.user = { userId: payload.userId, name: payload.name };
		next();
	} catch (error) {
		throw new UnauthenticatedError('Authentication invalid.');
	}
};
