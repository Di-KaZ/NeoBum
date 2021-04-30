import { QueryBuilder, QueryRunner } from 'neogma';
import { Artists, ArtistsInstance } from '../Models/Artists';
import { Groups, GroupsInstance } from '../Models/Groups';
import { Styles, StylesProperties } from '../Models/Styles';
import { neogma } from './neogma';

export default class AlbumService {
  public static getArtistStyle = async (group: ArtistsInstance): Promise<StylesProperties> => {
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

  public static getGroupStyle = async (group: GroupsInstance): Promise<StylesProperties> => {
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
}
