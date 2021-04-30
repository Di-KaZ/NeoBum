import { QueryBuilder, QueryRunner } from 'neogma';
import { Groups, GroupsInstance } from '../Models/Groups';
import { Pays, PaysProperties } from '../Models/Pays';
import type { StylesProperties } from '../Models/Styles';
import { neogma } from './neogma';

export default class PaysService {
  public static getGroupPays = async (group: GroupsInstance): Promise<PaysProperties> => {
    const queryResult = await new QueryBuilder()
      .match({
        related: [
          {
            model: Groups,
            where: {
              ...group.dataValues
            }
          },
          Groups.getRelationshipByAlias('HAIL_FROM'),
          {
            model: Pays,
            identifier: 'pays'
          }
        ]
      })
      .return('pays')
      .run(neogma.queryRunner);
    return QueryRunner.getResultProperties<StylesProperties>(queryResult, 'pays')[0];
  };
}
