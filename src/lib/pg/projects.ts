import type { PoolClient } from 'pg';

export async function getProjectsById(pg: PoolClient, id: string) {
	try {
		const res = await pg.query('select * from projects where user_id = $1', [id]);
		// TODO: parse into a more usable object
		return res;
	} catch (err) {
		console.error(err);
	}
}

export async function createProjectByNameAndId(pg: PoolClient, name: string, uuid: string) {
	try {
		const res = await pg.query(
			'insert into projects (user_id, project_name) values ($1, $2) returning *',
			[uuid, name]
		);
		return res;
	} catch (err) {
		console.error(err);
	}
}
