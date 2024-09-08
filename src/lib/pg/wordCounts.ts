import type { PoolClient } from 'pg';

export async function getWordCountsByProjectId(pg: PoolClient, project_id: string) {
	try {
		const res = await pg.query<{ date_counted: Date; minutes_written: number }>(
			'select date_counted, minutes_written from wordcounts where project_id = $1',
			[project_id]
		);

		if (res.rows.length > 0 && res.rows[0].date_counted && res.rows[0].minutes_written) {
			return res.rows;
		} else {
			return [];
		}
	} catch (err) {
		// TODO: actual error handling
		console.error(err);
		return [];
	}
}

export async function updateCountForDate(
	pg: PoolClient,
	user_id: string,
	project_id: string,
	date_counted: string,
	minutes_written: number
): Promise<number> {
	try {
		const res = await pg.query(
			'insert into wordcounts (user_id, project_id, date_counted, minutes_written) values ($1, $2, $3, $4) on conflict (project_id, date_counted) do update set minutes_written = excluded.minutes_written returning id',
			[user_id, project_id, date_counted, minutes_written]
		);
		if (res.rows.length > 0 && res.rows[0].minutes_written) {
			return res.rows[0].id;
		} else return -1;
	} catch (err) {
		// TODO: actual error handling
		console.error(err);
		return -1;
	}
}
