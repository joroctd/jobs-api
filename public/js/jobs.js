import { inputEnabled, setDiv, message, setToken } from './index.js';
import { showLoginRegister } from './loginRegister.js';
import { showAddEdit } from './addEdit.js';
import handleRequestResponse from './api/handleRequestResponse.js';

let jobsDiv = null;
let jobsTable = null;
let jobsTableHeader = null;

export const handleJobs = () => {
	jobsDiv = document.getElementById('jobs');
	const logoff = document.getElementById('logoff');
	const addJob = document.getElementById('add-job');
	jobsTable = document.getElementById('jobs-table');
	jobsTableHeader = document.getElementById('jobs-table-header');

	jobsDiv.addEventListener('click', e => {
		if (!inputEnabled || e.target.nodeName !== 'BUTTON') {
			return;
		}

		if (e.target === addJob) {
			showAddEdit(null);
			return;
		}

		if (e.target === logoff) {
			setToken(null);
			message.textContent = 'You have been logged off.';
			jobsTable.replaceChildren([jobsTableHeader]);
			showLoginRegister();
			return;
		}

		if (e.target.classList.contains('editButton')) {
			message.textContent = '';
			showAddEdit(e.target.dataset.id);
			return;
		}

		if (e.target.classList.contains('deleteButton')) {
			message.textContent = '';
			deleteJob(e.target.dataset.id);
		}
	});
};

const deleteJob = async jobId => {
	await handleRequestResponse({
		requestOptions: {
			method: 'DELETE',
			id: jobId
		},
		responseOptions: {
			statusActions: {
				204: async () => {
					message.textContent = `Deleton of job with the id of "${jobId}" was successful.`;
					await showJobs();
				}
			},
			onFail: async response => {
				const data = await response.json();
				message.textContent = data.msg;
			}
		}
	});
};

const tdButton = (purpose, id) =>
	`<td><button type="button" class="${purpose}Button" data-id=${id}>${purpose}</button></td>`;
export const showJobs = async () => {
	const children = [jobsTableHeader];
	await handleRequestResponse({
		shouldGetData: true,
		responseOptions: {
			statusActions: {
				200: data => {
					if (data.count === 0) {
						jobsTable.replaceChildren(...children); // clear this for safety
						return;
					}

					for (let job of data.jobs) {
						let rowEntry = document.createElement('tr');

						let editButton = tdButton('edit', job._id);
						let deleteButton = tdButton('delete', job._id);
						let rowHTML = `
						  <td>${job.company}</td>
						  <td>${job.position}</td>
						  <td>${job.status}</td>
						  <div>${editButton}${deleteButton}</div>`;

						rowEntry.innerHTML = rowHTML;
						children.push(rowEntry);
					}
					jobsTable.replaceChildren(...children);
				}
			},
			onFail: data => {
				message.textContent = data.msg;
			}
		}
	});

	setDiv(jobsDiv);
};
