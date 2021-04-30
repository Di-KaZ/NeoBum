import { QueryRunner } from 'neogma';
import type { GroupsProperties } from 'src/Models/Groups';
import { Albums, AlbumsInstance } from '../Models/Albums';
import type { ArtistsProperties } from '../Models/Artists';
import { neogma } from './neogma';

//FIXME sveltekit doesnt like classes ATM just revert the change made here to make it functional
export default class AlbumsService {
  /**
   * Get an album via it's name
   * @param name name of the album
   */
  public static getAlbumByName = async (name: string): Promise<AlbumsInstance> => {
    return Albums.findOne({ where: { name } });
  };

  public static getAlbumById = async (id: number): Promise<AlbumsInstance> => {
    return Albums.findOne({ where: { id } });
  };

  public static getAllbumAll = async (page = 1, limit = 14): Promise<AlbumsInstance[]> => {
    return Albums.findMany({ limit, skip: limit * (page - 1) });
  };

  public static getAlbumGroupOrArtist = async (
    album: AlbumsInstance
  ): Promise<ArtistsProperties> => {
    const queryResult = await neogma.queryRunner.run(
      // we pass directly via the driver since it's a bit complicated with neogma
      'MATCH (:`Album` {id: $id})<-[:HAS_MADE]-(grpOrArt) RETURN grpOrArt',
      {
        id: album.id
      }
    );
    return QueryRunner.getResultProperties<GroupsProperties | ArtistsProperties>(
      queryResult,
      'grpOrArt'
    )[0];
  };
}
