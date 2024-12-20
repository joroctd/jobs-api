const { CustomAPIError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const mongoErrors = {
	DUPLICATE: 11000,
	VALIDATION: 'ValidationError',
	CAST: 'CastError'
};

const errorHandlerMiddleware = (err, req, res, next) => {
	const customError = {
		status: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || 'A server error has occurred.'
	};

	if (err instanceof CustomAPIError) {
		return res.status(err.statusCode).json({ message: err.message });
	}

	if (err.name === mongoErrors.VALIDATION) {
		customError.msg = Object.values(err.errors).reduce(
			(message, error) => `${message} ${error.message}`
		);
		customError.status = 400;
	}

	if (err.name === mongoErrors.CAST) {
		customError.msg = `Incorrect id provided: ${err.value}`;
		customError.status = 404;
	}

	if (err.code === mongoErrors.DUPLICATE) {
		customError.msg = `Duplicate value entered for ${Object.keys(
			err.keyValue
		)}.`;
		customError.status = 400;
	}

	return res.status(customError.status).json({ message: customError.msg });
};

module.exports = errorHandlerMiddleware;
