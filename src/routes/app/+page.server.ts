import { exchangeCodeForToken, getUserDetails } from '$lib/discord';
import { getProjectsByUserId } from '$lib/pg/projects.js';
import { getUserWithId, addUserWithId } from '$lib/pg/users';
import { getWordCountsByProjectId, updateCountForDate } from '$lib/pg/wordCounts.js';
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
						const userProjectsRes = await getProjectsByUserId(locals.pg, id);
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
			const userProjectRows = await getProjectsByUserId(locals.pg, uuid);

			if (userProjectRows?.rowCount === 0) {
				console.log('redirecting from app/server.layout:103');
				redirect(307, '/app/onboard');
			}
		}
	}

	let projects: {
		project_id: string;
		user_id: string;
		project_name: string;
		counts: { date_counted: Date; minutes_written: number }[];
	}[] = [];

	const uuid = cookies.get(UUID_STRING);

	if (uuid) {
		const res = await getProjectsByUserId(locals.pg, uuid);
		if (res?.rows) {
			projects = res.rows.map(
				(row: {
					id: string;
					user_id: string;
					project_name: string;
					color: string;
					deleted_on: string;
				}) => ({
					project_id: row.id,
					user_id: row.user_id,
					project_name: row.project_name,
					counts: []
				})
			);
		}
	}

	await Promise.all(
		projects.map(async (proj) => {
			const counts = await getWordCountsByProjectId(locals.pg, proj.project_id);

			if (counts.length > 0) {
				proj.counts = counts;
			} else {
				proj.counts = [];
			}
		})
	);

	console.log(JSON.stringify(projects));

	return {
		projects,
		uuid
	};
}

export const actions = {
	updateCount: async (event) => {
		const formData = await event.request.formData();
		const projectId = formData.get('project_id') as string;
		console.log(`project id: ${projectId}`);
		const dateString = formData.get('date_counted') as string;
		const minutes = Number(formData.get('minutes_written') as string);
		const uuid = event.cookies.get(UUID_STRING);

		console.log('?updateCount');

		if (projectId && uuid && dateString && minutes) {
			console.log(
				`Received request to update wordcount on project ${projectId} by user ${uuid} with value date: ${dateString}, count: ${minutes}`
			);

			const successId = await updateCountForDate(
				event.locals.pg,
				uuid,
				projectId,
				dateString,
				minutes
			);

			if (successId !== -1) {
				console.log(
					`Successfully updated wordCount ${successId} with value date: ${dateString}, count: ${minutes}`
				);
			}

			// TODO: probably need to return data for app to render here
		}
	}
};
