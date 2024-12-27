import { inputEnabled, setDiv, message, setToken } from './index.js';
import { showLoginRegister } from './loginRegister.js';
import { showJobs } from './jobs.js';
import handleRequestResponse from './api/handleRequestResponse.js';

let loginDiv = null;
let email = null;
let password = null;

export const handleLogin = () => {
	loginDiv = document.getElementById('logon-div');
	email = document.getElementById('email');
	password = document.getElementById('password');
	const logonButton = document.getElementById('logon-button');
	const logonCancel = document.getElementById('logon-cancel');

	loginDiv.addEventListener('click', async e => {
		if (!inputEnabled || e.target.nodeName !== 'BUTTON') {
			return;
		}

		if (e.target === logonCancel) {
			email.value = '';
			password.value = '';
			showLoginRegister();
			return;
		}

		if (e.target === logonButton) {
			await handleRequestResponse({
				requestOptions: {
					endpoint: 'auth/login',
					method: 'POST',
					body: {
						email: email.value,
						password: password.value
					}
				},
				shouldGetData: true,
				responseOptions: {
					statusActions: {
						200: data => {
							message.textContent = `Logon successful.  Welcome ${data.user.name}`;
							setToken(data.token);

							email.value = '';
							password.value = '';

							showJobs();
						}
					},
					onFail: data => {
						message.textContent = data.msg;
					}
				}
			});
		}
	});
};

export const showLogin = () => {
	email.value = null;
	password.value = null;
	setDiv(loginDiv);
};
