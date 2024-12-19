module.exports = {
	getAllJobs: async (req, res) => {
		res.send('get all jobs');
	},
	getJob: async (req, res) => {
		res.send('get job');
	},
	createJob: async (req, res) => {
		res.send('create job');
	},
	updateJob: async (req, res) => {
		res.send('update job');
	},
	deleteJob: async (req, res) => {
		res.send('delete job');
	}
};
