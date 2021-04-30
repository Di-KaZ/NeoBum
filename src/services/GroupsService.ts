import { Groups, GroupsInstance } from '../Models/Groups';

export default class GroupsService {
  /**
   * Get an album via it's name
   * @param name name of the album
   */
  public static getGroupsByName = async (name: string): Promise<GroupsInstance> => {
    return Groups.findOne({ where: { name } });
  };

  public static getGroupsById = async (id: number): Promise<GroupsInstance> => {
    return Groups.findOne({ where: { id } });
  };

  public static getGroupsAll = async (limit = 15): Promise<GroupsInstance[]> => {
    return Groups.findMany({ limit });
  };
}
