import { Repository } from 'triplecheck-core';
export declare function createNewFaunaRepository(): FaunaRepository;
declare class FaunaRepository implements Repository {
    client: any;
    constructor(client: any);
    getData(key: string): Promise<any>;
    updateData(key: string, data: any): Promise<void>;
    deleteData(key: string): Promise<void>;
}
export {};
