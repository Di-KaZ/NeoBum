/* eslint-disable @typescript-eslint/no-empty-interface */
import { ModelFactory, NeogmaInstance } from 'neogma';
import { neogma } from '../services/neogma';

const label = 'Intrument';

export type InstrumentsProperties = {
	name: string;
};

export interface InstrumentsRelatedNodes {}

export type InstrumentsInstance = NeogmaInstance<InstrumentsProperties, InstrumentsRelatedNodes>;

export const Instruments = ModelFactory<InstrumentsProperties, InstrumentsRelatedNodes>(
	{
		label: label,
		primaryKeyField: 'name',
		schema: {
			name: {
				type: 'string',
				minLength: 1,
				required: true
			}
		}
	},
	neogma
);
