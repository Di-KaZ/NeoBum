import { ModelFactory, ModelRelatedNodesI, NeogmaInstance } from 'neogma';
import { neogma } from '../services/neogma';
import { Albums, AlbumsInstance } from './Albums';
import { Artists, ArtistsInstance } from './Artists';
import { Pays, PaysInstance } from './Pays';

const label = 'Group';

export type GroupsProperties = {
  name: string;
};

export interface GroupsRelatedNodes {
  HAS_MADE: ModelRelatedNodesI<typeof Albums, AlbumsInstance>;
  COMPOSED_OF: ModelRelatedNodesI<typeof Artists, ArtistsInstance>;
  HAIL_FROM: ModelRelatedNodesI<typeof Pays, PaysInstance>;
}

export type GroupsInstance = NeogmaInstance<GroupsProperties, GroupsRelatedNodes>;

export const Groups = ModelFactory<GroupsProperties, GroupsRelatedNodes>(
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
      COMPOSED_OF: {
        model: Artists,
        direction: 'out',
        name: 'COMPOSED_OF'
      },
      HAS_MADE: {
        model: Albums,
        direction: 'out',
        name: 'HAS_MADE'
      },
      HAIL_FROM: {
        model: Pays,
        direction: 'out',
        name: 'HAIL_FROM'
      }
    }
  },
  neogma
);
