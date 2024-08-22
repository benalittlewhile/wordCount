<script>
	import { PUBLIC_DISCORD_OAUTH_CLIENT_ID, PUBLIC_DISCORD_REDIRECT_URI } from '$env/static/public';

	const encodedRedirect = encodeURIComponent(PUBLIC_DISCORD_REDIRECT_URI);

	const discordLoginRedirect = `https://discord.com/oauth2/authorize?client_id=${PUBLIC_DISCORD_OAUTH_CLIENT_ID}&response_type=code&redirect_uri=${encodedRedirect}&scope=identify`;
</script>

<h1>WritLogger</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<br />

<a href="/app">Go to app!</a>

<a href={discordLoginRedirect}>Login with discord!</a>
