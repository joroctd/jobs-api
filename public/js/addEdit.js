import { inputEnabled, message, setDiv } from './index.js';
import { showJobs } from './jobs.js';
import handleRequestResponse from './api/handleRequestResponse.js';

let addEditDiv = null;
let company = null;
let position = null;
let status = null;
let addingJob = null;

export const handleAddEdit = () => {
	addEditDiv = document.getElementById('edit-job');
	company = document.getElementById('company');
	position = document.getElementById('position');
	status = document.getElementById('status');
	addingJob = document.getElementById('adding-job');
	const editCancel = document.getElementById('edit-cancel');

	addEditDiv.addEventListener('click', async e => {
		if (!inputEnabled || e.target.nodeName !== 'BUTTON') return;

		if (e.target === editCancel) {
			showJobs();
			return;
		}

		if (e.target === addingJob) {
			let method = 'POST';
			let id = null;
			if (addingJob.textContent === 'update') {
				method = 'PATCH';
				id = addEditDiv.dataset.id;
			}
			await handleRequestResponse({
				requestOptions: {
					method,
					id,
					body: {
						company: company.value,
						position: position.value,
						status: status.value
					}
				},
				responseOptions: {
					statusActions: {
						200: () => {
							message.textContent = 'The job entry was updated.';
						},
						201: () => {
							message.textContent = 'The job entry was created.';
						}
					},
					onSuccess: () => {
						company.value = '';
						position.value = '';
						status.value = 'pending';
						showJobs();
					},
					onFail: async response => {
						const data = await response.json();
						message.textContent = data.msg;
					}
				}
			});
		}
	});
};

export const showAddEdit = async jobId => {
	if (!jobId) {
		company.value = '';
		position.value = '';
		status.value = 'pending';
		addingJob.textContent = 'add';
		message.textContent = '';

		setDiv(addEditDiv);
		return;
	}

	await handleRequestResponse({
		requestOptions: {
			id: jobId
		},
		responseOptions: {
			statusActions: {
				200: async response => {
					const { job } = await response.json();
					company.value = job.company;
					position.value = job.position;
					status.value = job.status;
					addingJob.textContent = 'update';
					message.textContent = '';
					addEditDiv.dataset.id = jobId;
					setDiv(addEditDiv);
				},
				onFail: () => {
					message.textContent = 'The jobs entry was not found';
					showJobs();
				}
			}
		},
		postError: showJobs
	});
};
