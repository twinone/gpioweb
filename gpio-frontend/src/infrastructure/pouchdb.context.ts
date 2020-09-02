import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
import Axios from 'axios';
import { IToaster } from '../shared';

export interface IPouchDbContext {
    getDatabase(): PouchDB.Database;
    ExecuteWithDb<TResponse>(action: (db: PouchDB.Database) => TResponse): TResponse;
    createIndex(index: PouchDB.Find.CreateIndexOptions): Promise<PouchDB.Find.CreateIndexResponse<{}>>;
    getIndexes(): Promise<PouchDB.Find.GetIndexesResponse<{}>>;
    deleteIndex(index: PouchDB.Find.DeleteIndexOptions): Promise<PouchDB.Find.DeleteIndexResponse<{}>>
    checkSyncServer(): Promise<boolean>;
    sync(): void | Promise<any>;
    syncFrom(): void | Promise<any>;
    syncTo(): void | Promise<any>;
    showVerbose(message: string): void;
    getToaster(): IToaster;
}

export interface IContextSettings {
    database: string;
    syncUrl: string;
    verbose: boolean;
}

export class PouchDbContext implements IPouchDbContext {
    private readonly settings: IContextSettings;
    private readonly toaster: IToaster;
    private isSynching: boolean = false;
    private replicateOptions: PouchDB.Replication.SyncOptions = {
        live: true,
        retry: true
    };

    constructor(settings: IContextSettings, toaster: IToaster) {
        this.settings = settings;
        this.toaster = toaster;
        PouchDB.plugin(PouchFind);
        this.syncFrom();
    }

    public getDatabase(): PouchDB.Database {
        return new PouchDB(this.settings.database);
    }

    public ExecuteWithDb<TResponse>(action: (db: PouchDB.Database) => TResponse): TResponse {
        return action(this.getDatabase());
    }

    public async createIndex(index: PouchDB.Find.CreateIndexOptions): Promise<PouchDB.Find.CreateIndexResponse<{}>> {
        return await this.ExecuteWithDb(db => new Promise((resolve, reject) => {
            db.createIndex(index, (error, response) => {
                if (error) {
                    this.toaster.showError(`${error.message} reason ${error.reason}`);
                    reject(error);
                } else {
                    resolve(response as PouchDB.Find.CreateIndexResponse<{}>);
                }
            });
        }));
    }

    public async getIndexes(): Promise<PouchDB.Find.GetIndexesResponse<{}>> {
        return await this.ExecuteWithDb(db => new Promise((resolve, reject) => {
            db.getIndexes((error, response) => {
                if (error) {
                    this.toaster.showError(`${error.message} reason: ${error.reason}`);
                    reject(error);
                } else {
                    resolve(response!);
                }
            });
        }));
    }

    public async deleteIndex(index: PouchDB.Find.DeleteIndexOptions): Promise<PouchDB.Find.DeleteIndexResponse<{}>> {
        return await this.ExecuteWithDb(db => new Promise((resolve, reject) => {
            db.deleteIndex(index, (error, response) => {
                if (error) {
                    this.toaster.showError(`${error.message} reason ${error.reason}`);
                    reject(error);
                } else {
                    resolve(response!);
                }
            });
        }));
    }

    public async find(request: PouchDB.Find.FindRequest<{}>): Promise<PouchDB.Find.FindResponse<{}>> {
        return await this.ExecuteWithDb(db => new Promise((resolve, reject) =>{
            db.find(request, (error, response) => {
                if (error) {
                    reject(error);
                } else {
                    if(response!.warning) {
                        reject(response!.warning);
                    } else {
                    resolve(response!);
                    }
                }
            });
        }));
    }

    public async checkSyncServer(): Promise<boolean> {
        return await Axios.get(`${this.settings.syncUrl}/_up`).then(response => {
            return response.status === 200;
        });
    }

    public async sync(): Promise<any> {
        if (this.isSynching) {
            return;
        }

        this.isSynching = true;
        try {
            return await PouchDB.sync(
                this.settings.database,
                `${this.settings.syncUrl}/${this.settings.database}`,
                this.replicateOptions)
                .then(response => {
                    this.showVerbose(`Sync done.`);
                    return response;
                });
        } catch (err) {
            console.error(err);
            this.toaster.showError(`${err}`);
        } finally {
            this.isSynching = false;
        }
    }

    public async syncFrom(): Promise<any> {
        if (this.isSynching) {
            return;
        }

        try {
            return await PouchDB.replicate(
                `${this.settings.syncUrl}/${this.settings.database}`,
                this.settings.database,
                this.replicateOptions)
                .then(response => {
                    this.showVerbose(`Replicate to done.`)
                    return response;
                });
        } catch (err) {
            this.toaster.showError(`${err}`);
        } finally {
            this.isSynching = false;
        }
    }

    public async syncTo(): Promise<any> {
        if (this.isSynching) {
            return;
        }

        try {
            return await PouchDB.replicate(this.settings.database, `${this.settings.syncUrl}/${this.settings.database}`, this.replicateOptions)
                .then(response => {
                    this.showVerbose(`Replicate from done.`)
                    return response;
                });
        } catch (err) {
            this.toaster.showError(`${err}`);
        } finally {
            this.isSynching = false;
        }
    }

    public showVerbose(message: string): void {
        if (!this.settings.verbose) {
            return;
        }

        this.toaster.showInfo(message);
    }

    public getToaster(): IToaster {
        return this.toaster;
    }
}