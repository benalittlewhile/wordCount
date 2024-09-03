import type { PoolClient } from 'pg';

export async function getUserWithId(pg: PoolClient, id: string) {
	try {
		console.log(`retrieving user rows with id ${id}`);
		const res = await pg.query('select (id) from users where id = $1', [id]);
		return res;
	} catch (err) {
		console.error(err);
	}
}

export async function addUserWithId(pg: PoolClient, id: string) {
	try {
		const addRes = await pg.query('insert into users (id) values ($1) returning *', [id]);
		// if we successfully added the user, redirect to onboarding
		if (addRes.rows[0].id === id) {
			return true;
		}
	} catch (addErr) {
		console.error(addErr);
		return false;
	}
}
