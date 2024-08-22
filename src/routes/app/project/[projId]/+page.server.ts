import { error, type Load } from '@sveltejs/kit';

export function load({ params, setHeaders }) {
	if (!params.projId) {
		error(401, 'no project provided');
	}

	if (isNaN(Number(params.projId))) {
		error(404, 'invalid project id');
	}

	setHeaders({
		'content-type': 'text/json'
	});
	return {
		text: `requested data for project ${params.projId}`
	};
}
