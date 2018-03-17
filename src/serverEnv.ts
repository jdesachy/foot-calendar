export class ServerEnv{

    static getMongoDBConnection(): string {
        let MONGODB_CONNECTION: string = "mongodb://localhost:27017/test";

        if(process.env.OPENSHIFT_MONGODB_DB_URL){
            MONGODB_CONNECTION = process.env.OPENSHIFT_MONGODB_DB_URL + process.env.MONGODB_DATABASE;
        }
        return MONGODB_CONNECTION;
    }
}