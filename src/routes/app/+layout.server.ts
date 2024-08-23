import { DISCORD_OAUTH_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_DISCORD_OAUTH_CLIENT_ID, PUBLIC_DISCORD_REDIRECT_URI } from '$env/static/public';
import { UUID_STRING } from '$lib/stringsAndStuff.js';

export async function load({ cookies, url }) {
	const code = url.searchParams.get('code');

	// if redirected from discord login
	if (code) {
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
					const id = userDetails.id;

					cookies.set('uuid', id, {
						path: '/',
						httpOnly: true,
						secure: true,
						expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14)
					});
				}
			}
		} catch (error) {
			console.error(error);
		}
	}

	return {
		uuid: cookies.get(UUID_STRING),
		primaryColor: '#396fe2'
	};
}
