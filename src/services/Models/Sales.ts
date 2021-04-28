/* eslint-disable @typescript-eslint/no-empty-interface */
import { ModelFactory, ModelRelatedNodesI, neo4jDriver, NeogmaInstance } from 'neogma';
import { neogma } from '../neogma';
import { Albums, AlbumsInstance } from './Albums';

const label = 'Sale';

export type SalesProperties = {
	id: number;
	date: neo4jDriver.Date;
	sum: number;
};

export interface SalesRelatedNodes {
	SOLD: ModelRelatedNodesI<typeof Albums, AlbumsInstance>;
}

export type SalesInstance = NeogmaInstance<SalesProperties, SalesRelatedNodes>;

export const Sales = ModelFactory<SalesProperties, SalesRelatedNodes>(
	{
		label: label,
		primaryKeyField: 'id',
		schema: {
			id: {
				type: 'number',
				minimum: 0,
				required: true
			},
			date: {
				type: 'number',
				format: 'date'
			},
			sum: {
				type: 'number',
				minimum: 0,
				required: true
			}
		},
		relationships: {
			SOLD: {
				model: Albums,
				direction: 'out',
				name: 'SOLD'
			}
		}
	},
	neogma
);
