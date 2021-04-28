import { dev } from '$app/env';
import { Neogma } from 'neogma';
export const neogma = new Neogma(
	{
		url: import.meta.env.NEO4J_URL,
		username: import.meta.env.NEO4J_USERNAME,
		password: import.meta.env.NEO4J_PASSWORD
	},
	{
		logger: dev && console.log
	}
);
