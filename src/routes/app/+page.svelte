<script>
	export let data;
</script>

<h3>Hello! How is your writing?</h3>

{#each data.projects as project}
	<div style:border="2px solid white">
		<h2>{project.project_name}</h2>
		<h3>{project.project_id}</h3>
		{#each project.counts as count}
			<form method="POST" action="?/updateCount">
				<input type="hidden" name="project_id" value={project.project_id} />
				<input
					type="date"
					name="date_counted"
					readonly
					value={count.date_counted.toLocaleDateString('en-ca')}
				/>
				<input type="number" name="minutes_written" value={count.minutes_written} />
				<button type="submit">update</button>
			</form>
		{/each}
		<hr style:width="50%" style:margin-left="0" />
		<form method="POST" action="?/updateCount">
			<input type="hidden" name="project_id" value={project.project_id} />
			<input type="date" name="date_counted" value={new Date().toLocaleDateString('en-ca')} />
			<input type="number" name="minutes_written" value={0} />
			<button type="submit">add</button>
		</form>
	</div>
{/each}
