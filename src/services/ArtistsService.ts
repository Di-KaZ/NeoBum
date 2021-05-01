import { Artists, ArtistsInstance } from '../Models/Artists';

/**
 * Get an album via it's name
 * @param name name of the album
 */
export const getArtistsByName = async (name: string): Promise<ArtistsInstance> => {
  return Artists.findOne({ where: { name } });
};

export const getArtistsById = async (id: number): Promise<ArtistsInstance> => {
  return Artists.findOne({ where: { id } });
};

export const getArtistsAll = async (page = 1, limit = 14): Promise<ArtistsInstance[]> => {
  return Artists.findMany({ limit, skip: limit * (page - 1) });
};
