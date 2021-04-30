/* eslint-disable @typescript-eslint/no-empty-interface */
import { ModelFactory, NeogmaInstance } from 'neogma';
import { neogma } from '../services/neogma';

const label = 'Pays';

export type PaysProperties = {
  name: string;
};

export interface PaysRelatedNodes {}

export type PaysInstance = NeogmaInstance<PaysProperties, PaysRelatedNodes>;

export const Pays = ModelFactory<PaysProperties, PaysRelatedNodes>(
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
