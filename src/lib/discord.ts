import { DISCORD_OAUTH_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_DISCORD_OAUTH_CLIENT_ID, PUBLIC_DISCORD_REDIRECT_URI } from '$env/static/public';

export async function exchangeCodeForToken(code: string) {
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

	return res;
}

export async function getUserDetails(token: string) {
	// const userDetails = await fetch('https://discord.com/api/users/@me', {
	return fetch('https://discord.com/api/users/@me', {
		headers: {
			Authorization: `Bearer ${token}`
		}
	}).then((res) => res.json());
}
