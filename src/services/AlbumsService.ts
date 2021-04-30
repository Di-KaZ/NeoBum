import { Albums, AlbumsInstance } from '../Models/Albums';

/**
 * Get an album via it's name
 * @param name name of the album
 */
export const getAlbumByName = async (name: string): Promise<AlbumsInstance> => {
	return Albums.findOne({ where: { name } });
};

export const getAlbumById = async (id: number): Promise<AlbumsInstance> => {
	return Albums.findOne({ where: { id } });
};

export const getAllbumAll = async (limit = 15): Promise<AlbumsInstance[]> => {
	return Albums.findMany({ limit });
};
