import { DISCORD_OAUTH_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_DISCORD_OAUTH_CLIENT_ID, PUBLIC_DISCORD_REDIRECT_URI } from '$env/static/public';
import { UUID_STRING } from '$lib/stringsAndStuff.js';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies, url, locals }) {
	const code = url.searchParams.get('code');

	// if redirected from discord login
	if (code) {
		let redirectToOnboard = false;
		try {
			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams({
					grant_type: 'authorization_code',
					code: code,
					client_id: PUBLIC_DISCORD_OAUTH_CLIENT_ID,
					client_secret: DISCORD_OAUTH_CLIENT_SECRET,
					redirect_uri: PUBLIC_DISCORD_REDIRECT_URI
				})
			};

			const res = await fetch('https://discord.com/api/oauth2/token', options).then((response) =>
				response.json()
			);

			if (res.access_token) {
				const token = res.access_token;

				const userDetails = await fetch('https://discord.com/api/users/@me', {
					headers: {
						Authorization: `Bearer ${token}`
					}
				}).then((res) => res.json());

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

					// add the user if they don't exist already
					try {
						console.log(`retrieving user rows with id ${id}`);
						const res = await locals.pg.query('select (id) from users where id = $1', [id]);
						// if the user does not exist, add them
						if (res.rowCount === 0) {
							console.log(`no user with id ${id} found, adding`);
							try {
								const addRes = await locals.pg.query(
									'insert into users (id) values ($1) returning *',
									[id]
								);
								// if we successfully added the user, redirect to onboarding
								if (addRes.rows[0].id === id) {
									console.log('user added successfully, redirecting to onboard');
									redirectToOnboard = true;
								}
							} catch (addErr) {
								console.error(addErr);
							}
						}
					} catch (err) {
						console.error(err);
					}

					// after setting the cookie, need to redirect if user doesn't have any
					// projects
					if (redirectToOnboard === false) {
						console.log(`checking if user with id ${id}        has no projects`);
						try {
							const res = await locals.pg.query('select * from projects where user_id = $1', [id]);
							if (res.rowCount === 0) {
								console.log(`user with id ${id.trim()} has no projects, redirecting to onboard`);
								redirectToOnboard = true;
							}
						} catch (err) {
							console.error(err);
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
	} else if (!url.href.includes('onboard')) {
		const uuid = cookies.get(UUID_STRING);
		if (uuid) {
			let redirectToOnboard = false;
			// after setting the cookie, need to redirect if user doesn't have any
			// projects
			try {
				const res = await locals.pg.query('select * from projects where user_id = $1', [uuid]);
				if (res.rowCount === 0) {
					redirectToOnboard = true;
				}
			} catch (err) {
				console.error(err);
			}

			if (redirectToOnboard) {
				console.log('redirecting from app/server.layout:103');
				redirect(307, '/app/onboard');
			}
		}
	}

	return {
		uuid: cookies.get(UUID_STRING),
		primaryColor: '#396fe2'
	};
}
