export default async ({
	response,
	data,
	statusActions = {},
	onSuccess = () => {},
	onFail = () => {}
} = {}) => {
	const argument = data ? data : response;
	if (!statusActions.hasOwnProperty(response?.status)) {
		await onFail(argument);
		return;
	}

	await statusActions[response.status](argument);
	await onSuccess(argument);
};
