const { StatusCodes } = require('http-status-codes');
const Job = require('../models/Job');
const { BadRequestError, NotFoundError } = require('../errors');

module.exports = {
	getAllJobs: async (req, res) => {
		const jobs = await Job.find({ createdBy: req.user?.userId }).sort(
			'createdAt'
		);
		res.json({ jobs, count: jobs.length });
	},
	getJob: async (req, res) => {},
	createJob: async (req, res) => {
		const newJob = { ...req.body };
		newJob.createdBy = req.user.userId;
		const job = await Job.create(newJob);
		res.status(StatusCodes.CREATED).json({ job });
	},
	updateJob: async (req, res) => {},
	deleteJob: async (req, res) => {}
};
