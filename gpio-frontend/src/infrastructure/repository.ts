import { IPouchDbContext } from './pouchdb.context';
import { trackPromise } from "react-promise-tracker";
import { IToaster } from '../shared';

export interface IRepository {
    get<TEntity>(
        options: PouchDB.Core.AllDocsOptions
         | PouchDB.Core.AllDocsWithKeyOptions
         | PouchDB.Core.AllDocsWithinRangeOptions): Promise<void | TEntity[]>
    getAll<TEntity>() : Promise<any>;
    getPage<TEntity>(pageNumber: number, pageSize: number) : Promise<void | TEntity[]>;
    getById(id: string) : Promise<any>;
    find(request: PouchDB.Find.FindRequest<{}>): Promise<void | PouchDB.Find.FindResponse<{}>>;
    findByField(field: string, value: string): Promise<any>;
    create<TEntity>(entity: TEntity): Promise<void | PouchDB.Core.Response>;
    update<TEntity>(entity: TEntity): Promise<void | PouchDB.Core.Response>;
    delete(id: string): Promise<void | PouchDB.Core.Response>;
    getContext(): IPouchDbContext;
    sync(): Promise<any>;
    syncFrom(): Promise<any>;
    syncTo(): Promise<any>;
}

export class Repository implements IRepository {
    private readonly context: IPouchDbContext;
    private readonly toaster: IToaster;

    constructor(context: IPouchDbContext) {
        this.context = context;
        this.toaster = this.context.getToaster();
    }

    public async get<TEntity>(
        options: PouchDB.Core.AllDocsOptions
         | PouchDB.Core.AllDocsWithKeyOptions
         | PouchDB.Core.AllDocsWithinRangeOptions): Promise<void | TEntity[]> {
        try {
            return await trackPromise(this.context.ExecuteWithDb(db => db.allDocs(options).then((response) => {
                  this.context.showVerbose(`${response.total_rows} row(s) retreived.`)
                  return response.rows.map(row => row.doc as unknown as TEntity);
                })));
            } catch(err) {
                this.toaster.showError(err);
            }        
    }

    public async getAll<TEntity>() : Promise<any> {
        try{
            return await trackPromise(this.context.ExecuteWithDb(db =>
                db.createIndex({index: {fields: ['_id']}}).then(() => 
                    new Promise((resolve, reject) => 
                        db.find({ selector: { _id: { $ne: null } } }, (error, result) => {
                            if(error) {
                                reject(error);
                            } else {
                                resolve(result!.docs);
                            }
            })))));
        }
        catch (err) {
            console.error(err);
            this.toaster.showError('An error has occured. Please check the log.');
        }
    }

    public async getPage<TEntity>(pageNumber: number, pageSize: number) : Promise<void | TEntity[]> {
        return this.get({
            descending: false,
            include_docs: true,
            attachments: true,
            skip: (pageNumber - 1) * pageSize,
            limit: pageSize
          });
    }

    public async getById(id: string) : Promise<any> {
        try {
            return await trackPromise(this.context.ExecuteWithDb(db => db.get(id).then(response => {
                this.context.showVerbose(`${response._id}`);
                return response;
            })));
        }
        catch (err) {
            this.toaster.showError(err);
        }
    }

    public async findByField(field: string, value: string): Promise<any> {
        try{
            return await trackPromise(this.context.ExecuteWithDb(db => {
                return db.createIndex({index: {fields: [field]}}).then(() => {
                    var selector: any = {};
                    selector['_id'] = {$gte: null};
                    selector[field] = {$regex: new RegExp(value, 'i')};
                    return new Promise((resolve, reject) => {
                        db.find({ selector: selector }, (error, result) =>{
                            if(error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        });
                    });
                });
            }));
        }
        catch (err) {
            this.toaster.showError(err);
        }
    }

    public async find(request: PouchDB.Find.FindRequest<{}>): Promise<void | PouchDB.Find.FindResponse<{}>> {
        try {
            return await trackPromise(this.context.ExecuteWithDb(db => new Promise((resolve, reject) => {
                db.find(request, (error, response) => {
                    if(error) {
                        reject(error);
                    } else {
                        resolve(response!);
                    }
                });
            })));
        }
        catch (err) {
            console.error(err);
            this.toaster.showError('Error! Check the log.');
        }
    }

    public async create<TEntity>(entity: TEntity): Promise<void | PouchDB.Core.Response> {
        try {
            return await trackPromise(this.context.ExecuteWithDb( db => db.post(entity).then(response => {
                this.context.showVerbose(`${response.ok? 'Item created' : 'An error ocured trying to create item.'}`);
                this.context.syncTo();
                return response;
            })));
        } catch(err) {
            this.toaster.showError(err);
        }
    }

    public async update<TEntity>(entity: TEntity): Promise<void | PouchDB.Core.Response> {
        return await trackPromise(this.context.ExecuteWithDb( db => db.put(entity)
        .then(response => {
            this.context.showVerbose(`${response.ok ? 'Item updated' : 'An error ocured trying to update item.'}`);
            this.context.syncTo();
            return response;
        })
        .catch(err => this.toaster.showError(err))));
    }

    public async delete(id: string): Promise<void | PouchDB.Core.Response> {
        return await trackPromise(this.context.ExecuteWithDb( db => db.get(id)
        .then(async doc => {
            if(!doc) {
                this.toaster.showError('Document not found.');
                return;
            }
            return await db.remove(doc._id, doc._rev)
            .then(response => {
                this.context.showVerbose(`${response.ok ? 'Item deleted' : 'An error ocured trying to delete an item.'}`);
                this.context.syncTo();
                return response;
            })
            .catch(err => this.toaster.showError(err));
        }).catch(err => this.toaster.showError(err))));
    }

    public getContext(): IPouchDbContext {
        return this.context;
    }

    public async sync(): Promise<any> {
        return await this.context.sync();
    }

    public async syncFrom(): Promise<any> {
        return await this.context.syncFrom();
    }

    public async syncTo(): Promise<any> {
        return await this.context.syncTo();
    }
}