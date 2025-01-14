require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
const authMiddleware = require('./middleware/authentication');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages

// routes
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
