/* eslint-disable @typescript-eslint/no-empty-interface */
import { ModelFactory, NeogmaInstance } from 'neogma';
import { neogma } from '../services/neogma';

const label = 'Style';

export type StylesProperties = {
  name: string;
};

export interface StylesRelatedNodes {}

export type StylesInstance = NeogmaInstance<StylesProperties, StylesRelatedNodes>;

export const Styles = ModelFactory<StylesProperties, StylesRelatedNodes>(
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
