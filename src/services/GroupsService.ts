import { Groups, GroupsInstance } from '../Models/Groups';

/**
 * Get an album via it's name
 * @param name name of the album
 */
export const getGroupsByName = async (name: string): Promise<GroupsInstance> => {
  return Groups.findOne({ where: { name } });
};

export const getGroupsById = async (id: number): Promise<GroupsInstance> => {
  return Groups.findOne({ where: { id } });
};

export const getGroupsAll = async (page = 1, limit = 15): Promise<GroupsInstance[]> => {
  return Groups.findMany({ limit, skip: limit * (page - 1) });
};
