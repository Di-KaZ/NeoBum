/* eslint-disable @typescript-eslint/no-empty-interface */
import { ModelFactory, ModelRelatedNodesI, neo4jDriver, NeogmaInstance } from 'neogma';
import { neogma } from '../neogma';
import { Sales, SalesInstance } from './Sales';
const label = 'Client';

export type ClientsProperties = {
	name: string;
	adress: string;
	postalCode: string;
	city: string;
	email: string;
	birth: neo4jDriver.Date;
};

export interface ClientsRelatedNodes {
	MADE_SALE: ModelRelatedNodesI<typeof Sales, SalesInstance>;
}

export type ClientsInstance = NeogmaInstance<ClientsProperties, ClientsRelatedNodes>;

export const Clients = ModelFactory<ClientsProperties, ClientsRelatedNodes>(
	{
		label: label,
		primaryKeyField: 'name',
		schema: {
			name: {
				type: 'string',
				minLength: 1,
				required: true
			},
			adress: {
				type: 'string',
				minLength: 1,
				required: true
			},
			postalCode: {
				type: 'string',
				minLength: 1,
				required: true
			},
			city: {
				type: 'string',
				minLength: 1,
				required: true
			},
			email: {
				type: 'string',
				format: 'email',
				minLength: 1,
				required: true
			},
			birth: {
				type: 'string',
				format: 'date'
			}
		},
		relationships: {
			MADE_SALE: {
				model: Sales,
				direction: 'out',
				name: 'MADE_SALE'
			}
		}
	},
	neogma
);
