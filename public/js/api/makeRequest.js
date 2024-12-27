import { token } from '../index.js';

export default async ({
	method = 'GET',
	endpoint = 'jobs',
	id = null,
	body = null
} = {}) => {
	let url = `/api/v1/${endpoint}`;
	if (id) url += `/${id}`;

	const options = {
		method,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	};
	if (body) options.body = JSON.stringify(body);

	return await fetch(url, options);
};
