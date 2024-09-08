import type { PoolClient } from 'pg';

export async function getProjectsByUserId(pg: PoolClient, user_id: string) {
	try {
		const res = await pg.query('select * from projects where user_id = $1', [user_id]);
		// TODO: parse into a more usable object
		return res;
	} catch (err) {
		console.error(err);
	}
}

export async function createProjectByNameAndUserId(pg: PoolClient, name: string, user_id: string) {
	try {
		const res = await pg.query(
			'insert into projects (user_id, project_name) values ($1, $2) returning *',
			[user_id, name]
		);
		return res;
	} catch (err) {
		console.error(err);
	}
}
