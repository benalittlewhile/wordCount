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
			let redirectToApp = false;
			try {
				const res = await event.locals.pg.query(
					'insert into projects (user_id, name) values ($1, $2) returning *',
					[uuid, projectName]
				);
				if (res.rows[0].user_id === uuid) {
					console.log(
						`successfully added project ${projectName} with id ${res.rows[0].id} for user with id ${res.rows[0].user_id}`
					);
					redirectToApp = true;
				}
			} catch (err) {
				console.error(err);
			}
			if (redirectToApp) {
				redirect(303, '/app');
			}
		}
	}
};
