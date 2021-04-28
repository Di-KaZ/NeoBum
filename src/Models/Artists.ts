import { ModelFactory, ModelRelatedNodesI, NeogmaInstance } from 'neogma';
import { neogma } from '../services/neogma';
import { Albums, AlbumsInstance } from './Albums';
import { Instruments, InstrumentsInstance } from './Instruments';
import { Pays, PaysInstance } from './Pays';
import { Styles, StylesInstance } from './Styles';

const label = 'Artist';

export type ArtistsProperties = {
	name: string;
};

export interface ArtistsRelatedNodes {
	HAS_MADE: ModelRelatedNodesI<typeof Albums, AlbumsInstance>;
	HAS_STYLE: ModelRelatedNodesI<typeof Styles, StylesInstance>;
	HAIL_FROM: ModelRelatedNodesI<typeof Pays, PaysInstance>;
	PLAY: ModelRelatedNodesI<typeof Instruments, InstrumentsInstance>;
}

export type ArtistsInstance = NeogmaInstance<ArtistsProperties, ArtistsRelatedNodes>;

export const Artists = ModelFactory<ArtistsProperties, ArtistsRelatedNodes>(
	{
		label: label,
		primaryKeyField: 'name',
		schema: {
			name: {
				type: 'string',
				minLength: 1,
				required: true
			}
		},
		relationships: {
			HAS_MADE: {
				model: Albums,
				direction: 'out',
				name: 'HAS_MADE'
			},
			HAS_STYLE: {
				model: Styles,
				direction: 'out',
				name: 'HAS_STYLE'
			},
			HAIL_FROM: {
				model: Pays,
				direction: 'out',
				name: 'HAIL_FROM'
			},
			PLAY: {
				model: Instruments,
				direction: 'out',
				name: 'PLAY'
			}
		}
	},
	neogma
);
