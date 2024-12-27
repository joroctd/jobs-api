import { inputEnabled, setDiv, message, setToken } from './index.js';
import { showLoginRegister } from './loginRegister.js';
import { showJobs } from './jobs.js';
import handleRequestResponse from './api/handleRequestResponse.js';

let registerDiv = null;
let name = null;
let email1 = null;
let password1 = null;
let password2 = null;

export const handleRegister = () => {
	registerDiv = document.getElementById('register-div');
	name = document.getElementById('name');
	email1 = document.getElementById('email1');
	password1 = document.getElementById('password1');
	password2 = document.getElementById('password2');
	const registerButton = document.getElementById('register-button');
	const registerCancel = document.getElementById('register-cancel');

	registerDiv.addEventListener('click', async e => {
		if (!inputEnabled || e.target.nodeName !== 'BUTTON') {
			return;
		}

		if (e.target === registerCancel) {
			name.value = '';
			email1.value = '';
			password1.value = '';
			password2.value = '';
			showLoginRegister();
			return;
		}

		if (e.target === registerButton) {
			if (password1.value != password2.value) {
				message.textContent = 'The passwords entered do not match.';
				return;
			}

			await handleRequestResponse({
				requestOptions: {
					endpoint: 'auth/register',
					method: 'POST',
					body: {
						name: name.value,
						email: email1.value,
						password: password1.value
					}
				},
				shouldGetData: true,
				responseOptions: {
					statusActions: {
						201: data => {
							message.textContent = `Registration successful.  Welcome ${data.user.name}`;
							setToken(data.token);

							name.value = '';
							email1.value = '';
							password1.value = '';
							password2.value = '';

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

export const showRegister = () => {
	email1.value = null;
	password1.value = null;
	password2.value = null;
	setDiv(registerDiv);
};
