import { exchangeCodeForToken, getUserDetails } from '$lib/discord';
import { getProjectsById } from '$lib/pg/projects.js';
import { getUserWithId, addUserWithId } from '$lib/pg/users';
import { UUID_STRING } from '$lib/stringsAndStuff.js';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies, locals, url }) {
	const code = url.searchParams.get('code');

	// if redirected from discord login
	if (code) {
		let redirectToOnboard = false;
		try {
			console.log('exchanging code for token');
			const res = await exchangeCodeForToken(code);
			if (res.access_token) {
				const token = res.access_token;
				const userDetails = await getUserDetails(token);

				if (userDetails.id) {
					// TODO: type this
					const id: string = userDetails.id;
					console.log('retrieved discord id ' + id);

					cookies.set('uuid', id, {
						path: '/',
						httpOnly: true,
						secure: true,
						expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14)
					});

					// get any user rows matching the given id
					const res = await getUserWithId(locals.pg, id);

					// if the user does not exist, add them
					if (res?.rowCount === 0) {
						console.log(`no user with id ${id} found, adding`);
						const addedUser = await addUserWithId(locals.pg, id);
						if (addedUser) {
							console.log('user added successfully, redirecting to onboard');
							redirectToOnboard = true;
						}
					}

					// after setting the cookie, need to redirect if user doesn't have any
					// projects
					if (redirectToOnboard === false) {
						console.log(`checking if user with id ${id} has no projects`);
						const userProjectsRes = await getProjectsById(locals.pg, id);
						if (userProjectsRes?.rowCount === 0) {
							console.log(`user with id ${id} has no projects, redirecting to onboard`);
							redirectToOnboard = true;
						}
					}
				}
			}
		} catch (error) {
			console.error(error);
		}

		if (redirectToOnboard && !url.href.includes('onboard')) {
			console.log('redirecting from app/layout.server:91');
			throw redirect(307, '/app/onboard');
		}
		// if a code was not supplied we skip the discord handshake and user creation,
		// going straight to checking if the user needs to onboard
	} else if (!url.href.includes('onboard')) {
		const uuid = cookies.get(UUID_STRING);
		if (uuid) {
			// after setting the cookie, need to redirect if user doesn't have any
			// projects
			const userProjectRows = await getProjectsById(locals.pg, uuid);

			if (userProjectRows?.rowCount === 0) {
				console.log('redirecting from app/server.layout:103');
				redirect(307, '/app/onboard');
			}
		}
	}

	let projects: {
		id: string;
		user_id: string;
		project_name: string;
	}[] = [];

	const uuid = cookies.get(UUID_STRING);

	if (uuid) {
		const res = await getProjectsById(locals.pg, uuid);
		if (res?.rows) {
			console.log(`retrieved ${res.rowCount} projects`);
			projects = res.rows;
		}
	}

	return {
		projects,
		uuid
	};
}
