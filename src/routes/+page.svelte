<script>
	export let data;
	import { PUBLIC_DISCORD_OAUTH_CLIENT_ID, PUBLIC_DISCORD_REDIRECT_URI } from '$env/static/public';

	const encodedRedirect = encodeURIComponent(PUBLIC_DISCORD_REDIRECT_URI);

	const discordLoginRedirect = `https://discord.com/oauth2/authorize?client_id=${PUBLIC_DISCORD_OAUTH_CLIENT_ID}&response_type=code&redirect_uri=${encodedRedirect}&scope=identify&prompt=none`;
</script>

<h1>WritLogger</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<br />

{#if data.loggedIn === false}
	<a href={discordLoginRedirect}>Login with discord!</a>
{:else}
	<a href="/app">Go to app!</a>
{/if}
