import {
	POSTGRES_USER,
	POSTGRES_HOST,
	POSTGRES_PASSWORD,
	POSTGRES_DATABASE,
	POSTGRES_USE_SSL,
	POSTGRES_CA
} from '$env/static/private';
import pg from 'pg';

const pool = new pg.Pool({
	user: POSTGRES_USER,
	host: POSTGRES_HOST,
	database: POSTGRES_DATABASE,
	password: POSTGRES_PASSWORD,
	port: 5432,
	ssl: Boolean(POSTGRES_USE_SSL) ? { rejectUnauthorized: true, ca: POSTGRES_CA } : false
});
export const connectDb = async () => await pool.connect();

export const handle = async ({ event, resolve }) => {
	// handle modifies the locals on the event as a sort of middleware
	const conn = await connectDb();
	event.locals = {
		pg: conn
	};
	const response = await resolve(event);
	conn.release();
	return response;
};
