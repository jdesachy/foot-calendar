export class ServerEnv{

    static getMongoDBConnection(): string {
        return this.getMongoDBUrl();
    }

    static getMongoDBUrl(): string {
        let mongoURL = "";

        if (process.env.DATABASE_SERVICE_NAME) {
            var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
                mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
                mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
                mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
                mongoPassword = process.env[mongoServiceName + '_PASSWORD'],
                mongoUser = process.env[mongoServiceName + '_USER'];
          
            if (mongoHost && mongoPort && mongoDatabase) {
              if (mongoUser && mongoPassword) {
                mongoURL += mongoUser + ':' + mongoPassword + '@';
              }
              mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;          
            } 
        }else{
            mongoURL = "mongodb://localhost:27017/test";
        }
        console.log("connecting to " + mongoURL);
        return mongoURL;
    }
}