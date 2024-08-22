import { DISCORD_OAUTH_CLIENT_ID, DISCORD_OAUTH_CLIENT_SECRET } from '$env/static/private';

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
					client_id: DISCORD_OAUTH_CLIENT_ID,
					client_secret: DISCORD_OAUTH_CLIENT_SECRET,
					redirect_uri: 'http://localhost:5173/app'
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

					cookies.set('uuid', id, { path: '/' });
				}
			}
		} catch (error) {
			console.error(error);
		}
	}

	return {
		uuid: cookies.get('uuid'),
		primaryColor: '#396fe2'
	};
}
