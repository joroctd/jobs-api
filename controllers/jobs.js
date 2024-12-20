const { StatusCodes } = require('http-status-codes');
const Job = require('../models/Job');
const { BadRequestError, NotFoundError } = require('../errors');

module.exports = {
	getAllJobs: async (req, res) => {
		const jobs = await Job.find({ createdBy: req.user?.userId }).sort(
			'createdAt'
		);
		res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
	},
	getJob: async (req, res) => {
		const job = await Job.findOne({
			createdBy: req.user?.userId,
			_id: req.params.id
		});

		if (!job) {
			throw new NotFoundError('Job not found.');
		}

		res.status(StatusCodes.OK).json({ job });
	},
	createJob: async (req, res) => {
		const newJob = { ...req.body };
		newJob.createdBy = req.user.userId;
		const job = await Job.create(newJob);
		res.status(StatusCodes.CREATED).json({ job });
	},
	updateJob: async (req, res) => {
		const { company, position } = req.body;
		if (company === '' || position === '') {
			throw new BadRequestError(
				'Company or position cannot be an empty string.'
			);
		}

		const job = await Job.findOneAndUpdate(
			{
				createdBy: req.user?.userId,
				_id: req.params.id
			},
			{ company, position },
			{ new: true, runValidators: true }
		);

		if (!job) {
			throw new NotFoundError('Job not found.');
		}

		res.status(StatusCodes.OK).json({ job });
	},
	deleteJob: async (req, res) => {
		const job = await Job.findOneAndDelete({
			createdBy: req.user?.userId,
			_id: req.params.id
		});

		if (!job) {
			throw new NotFoundError('Job not found.');
		}

		res.status(StatusCodes.NO_CONTENT).send();
	}
};
