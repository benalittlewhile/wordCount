import { UUID_STRING } from '$lib/stringsAndStuff.js';

export async function load({ cookies, locals }) {
	const uuid = cookies.get(UUID_STRING);

	let projects: {
		id: string;
		user_id: string;
		project_name: string;
	}[] = [];
	if (uuid) {
		try {
			console.log(`retrieving projects for user with id ${uuid}`);

			const res = await locals.pg.query('select * from projects where user_id = $1', [uuid]);

			if (res.rows) {
				console.log(`retrieved ${res.rowCount} projects`);
				projects = res.rows;
			}
		} catch (err) {
			console.error(err);
		}
	}

	return {
		projects
	};
}
