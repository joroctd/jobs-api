require('dotenv').config();
require('express-async-errors');
const express = require('express');

const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const cors = require('cors');

const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerYaml = YAML.load('./swagger.yaml');

const connectDB = require('./db/connect');
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
const authMiddleware = require('./middleware/authentication');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const app = express();

// How "app.get('env')" works:
// app.get('env') = process.env.NODE_ENV ? process.env.NODE_ENV || 'development'
const isProduction = app.get('env') === 'production';
if (isProduction) {
	app.set('trust proxy', 1);
}

// security middleware
app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100 // max requests, per IP, per amount of time above
	}),
	express.json(),
	helmet(),
	hpp()
);

if (isProduction) {
	app.use(cors());
}

// routes
app.get('/', (req, res) => {
	res.send('jobs api');
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerYaml));

const apiRouter = express.Router();
app.use('/api/v1', apiRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/jobs', authMiddleware, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(port, () => {
			console.log(`Server is listening on port ${port}...`);
			console.log(`Access at: http://localhost:${port}`);
		});
	} catch (error) {
		console.log(error);
	}
};

start();
