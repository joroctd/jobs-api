import makeRequest from './makeRequest.js';
import handleResponse from './handleResponse.js';
import { enableInput } from '../index.js';

export default async ({
	requestOptions = {},
	shouldGetData = false,
	responseOptions,
	postError = () => {}
} = {}) => {
	enableInput(false);

	try {
		const response = await makeRequest(requestOptions);
		if (shouldGetData) responseOptions.data = await response.json();
		await handleResponse({ response, ...responseOptions });
	} catch (err) {
		console.error(err);
		message.textContent = 'A communications error occurred.';
		postError();
	}

	enableInput(true);
};
