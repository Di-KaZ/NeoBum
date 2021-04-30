/* eslint-disable @typescript-eslint/no-empty-interface */
import { ModelFactory, NeogmaInstance } from 'neogma';
import { neogma } from '../services/neogma';

const label = 'Album';

export type AlbumProperties = {
	id: number;
	name: string;
	prodYear: number;
	price: number;
	cover: string;
};

export interface AlbumsRelatedNodes {}

export type AlbumsInstance = NeogmaInstance<AlbumProperties, AlbumsRelatedNodes>;

export const Albums = ModelFactory<AlbumProperties, AlbumsRelatedNodes>(
	{
		label: label,
		primaryKeyField: 'id',
		schema: {
			id: {
				type: 'number',
				minimum: 1,
				required: true
			},
			name: {
				type: 'string',
				minLength: 1,
				required: true
			},
			prodYear: {
				type: 'number',
				minimum: 1800,
				required: true
			},
			price: {
				type: 'number',
				minimum: 0,
				required: true
			},
			cover: {
				type: 'string',
				format: 'url',
				minLength: 0,
				required: true
			}
		}
	},
	neogma
);
