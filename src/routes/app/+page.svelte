<script>
	export let data;
</script>

<h2 color={'blue'}>Pika!</h2>

<h3>{data.uuid}</h3>

{#each data.projects as project}
	<h2>{project.project_name}</h2>
	{project.id}
{/each}
