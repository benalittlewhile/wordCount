import { UUID_STRING } from '$lib/stringsAndStuff.js';

export async function load({ cookies }) {
	// if the user has already logged in, we don't need to have them do so again
	const existingToken = cookies.get(UUID_STRING);

	return {
		loggedIn: !!existingToken
	};
}
