require('dotenv').config();
require('express-async-errors');
const express = require('express');
const hpp = require('hpp');
const helmet = require('helmet');
const cors = require('cors');
const rateLimiter = require('express-rate-limit');

const connectDatabase = require('./db/connect');
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
const authMiddleware = require('./middleware/authentication');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const app = express();

app.set('trust proxy', 1); // https://expressjs.com/en/guide/behind-proxies.html
app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100 // max requests, per IP, per amount of time above
	}),
	express.urlencoded({ extended: true, limit: '1kb' }),
	express.json({ limit: '1kb' }),
	// https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html#use-appropriate-security-headers
	helmet.hsts(),
	helmet.xssFilter(),
	helmet.frameguard(),
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ["'self'"],
			scriptSrc: ["'self'"],
			frameAncestors: ["'none'"],
			imgSrc: ["'self'"],
			styleSrc: ["'none'"]
		}
	}),
	helmet.noSniff(),
	helmet.ieNoOpen(),
	helmet.hidePoweredBy(),
	hpp(),
	cors()
);

app.get('/', (req, res) => {
	res.send('jobs api');
});

const apiRouter = express.Router();
app.use('/api/v1', apiRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/jobs', authMiddleware, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
const start = async () => {
	try {
		await connectDatabase(process.env.MONGO_URI);
		app.listen(port, err => {
			if (err) {
				console.error(`Could not start server on port ${port}.`);
				throw err;
			}
			console.log(`Server listening on port ${port}.`);
			console.log(`Access at: http://localhost:${port}`);
		});
	} catch (error) {
		console.error(error);
	}
};

start();
