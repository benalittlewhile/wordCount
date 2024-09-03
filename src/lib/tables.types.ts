export interface User {
	// JS can't do 64-bit numbers, so leave this as a string
	id: string;
}

export interface Project {
	// ditto the precision issue
	id: string;
	user: string;
	name: string;
	// this should always be checked for conversion
	color: string;
}

export interface Wordcount {
	id: string;
	user: string;
	project: string;
	// contains more precision than needed, but we can parse the postgres date
	// into this easily and manipulate it into whatever shape
	date_counted: Date;
	count_for_day: number;
}
