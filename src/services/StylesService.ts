import { QueryBuilder, QueryRunner } from 'neogma';
import type { AlbumsInstance } from '../Models/Albums';
import { Artists, ArtistsInstance } from '../Models/Artists';
import { Groups, GroupsInstance } from '../Models/Groups';
import { Styles, StylesProperties } from '../Models/Styles';
import { neogma } from './neogma';

export const getArtistStyle = async (group: ArtistsInstance): Promise<StylesProperties> => {
  const queryResult = await new QueryBuilder()
    .match({
      related: [
        {
          model: Artists,
          where: {
            ...group.dataValues
          }
        },
        Artists.getRelationshipByAlias('HAS_STYLE'),
        {
          model: Styles,
          identifier: 'style'
        }
      ]
    })
    .return('style')
    .run(neogma.queryRunner);
  return QueryRunner.getResultProperties<StylesProperties>(queryResult, 'style')[0];
};

export const getGroupStyle = async (group: GroupsInstance): Promise<StylesProperties> => {
  const queryResult = await new QueryBuilder()
    .match({
      related: [
        {
          model: Groups,
          where: {
            ...group.dataValues
          }
        },
        Artists.getRelationshipByAlias('HAS_STYLE'),
        {
          model: Styles,
          identifier: 'style'
        }
      ]
    })
    .return('style')
    .run(neogma.queryRunner);
  return QueryRunner.getResultProperties<StylesProperties>(queryResult, 'style')[0];
};

export const getAlbumStyle = async (album: AlbumsInstance): Promise<StylesProperties> => {
  const queryResult = await neogma.queryRunner.run(
    // we pass directly via the driver since it's a bit complicated with neogma
    'MATCH (:`Album` {id: $id})<-[:HAS_MADE]-()-[:HAS_STYLE]->(s) RETURN s',
    {
      id: album.id
    }
  );
  return QueryRunner.getResultProperties<StylesProperties>(queryResult, 's')[0];
};
