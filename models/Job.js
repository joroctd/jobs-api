const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
	{
		company: {
			type: String,
			required: [true, 'Company required.'],
			maxLength: 50
		},
		position: {
			type: String,
			required: [true, 'Position required.'],
			maxLength: 100
		},
		status: {
			type: String,
			enum: ['previous', 'current', 'future', 'pending'],
			default: 'pending'
		},
		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: [true, 'Created by user required.']
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Job', JobSchema);
