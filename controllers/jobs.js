const { StatusCodes } = require('http-status-codes');
const Job = require('../models/Job');
const { BadRequestError, NotFoundError } = require('../errors');

module.exports = {
	getAllJobs: async (req, res) => {
		res.send('get all jobs');
	},
	getJob: async (req, res) => {
		res.send('get job');
	},
	createJob: async (req, res) => {
		const newJob = { ...req.body };
		newJob.createdBy = req.user.userId;
		const job = await Job.create(newJob);
		res.status(StatusCodes.CREATED).json({ job });
	},
	updateJob: async (req, res) => {
		res.send('update job');
	},
	deleteJob: async (req, res) => {
		res.send('delete job');
	}
};
