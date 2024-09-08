import { createProjectByNameAndUserId } from '$lib/pg/projects.js';
import { UUID_STRING } from '$lib/stringsAndStuff.js';
import { redirect } from '@sveltejs/kit';

export const actions = {
	createProject: async (event) => {
		const formdata = await event.request.formData();
		const projectName = formdata.get('projectName');
		const uuid = event.cookies.get(UUID_STRING);

		if (projectName && uuid) {
			console.log(
				`onboard action received request to create project with name ${projectName} for user with id ${uuid} `
			);

			const res = await createProjectByNameAndUserId(event.locals.pg, projectName.toString(), uuid);

			if (res?.rows[0].user_id === uuid) {
				console.log(
					`successfully added project ${projectName} with id ${res.rows[0].id} for user with id ${res.rows[0].user_id}`
				);
				redirect(303, '/app');
			}
		}
	}
};
