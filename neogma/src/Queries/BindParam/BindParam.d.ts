/**
 * the bind param which should be passed to a query. It throws an error if more than one of each key is added
 */
export declare class BindParam {
    /** acquires a BindParam, so it ensures that a BindParam is always returned. If it's passed, it will be returned as is. Else, a new one will be created and returned */
    static acquire(bindParam?: BindParam | null): BindParam;
    /** the object with the bind param */
    private bind;
    constructor(...objects: Array<BindParam['bind']>);
    /**
     * adds objects to the bind attribute, throwing an error if a given key already exists in the bind param
     */
    add(...objects: Array<BindParam['bind']>): BindParam;
    /** removes the given names from the bind param */
    remove(names: string | string[]): void;
    /**
     * returns the bind attribute
     */
    get(): BindParam['bind'];
    /** returns a name which isn't a key of bind, and starts with the suffix */
    getUniqueName(suffix: string): string;
    /** returns a name which isn't a key of bind and adds the value to the bind param with the created name */
    getUniqueNameAndAdd(suffix: Parameters<typeof BindParam['prototype']['getUniqueName']>[0], value: Parameters<typeof BindParam['prototype']['add']>[0][0]): string;
    /**
     * returns a new BindParam instance with a clone of the bind property
     */
    clone(): BindParam;
}
