"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServerEnv {
    static getMongoDBConnection() {
        let MONGODB_CONNECTION = "mongodb://localhost:27017/test";
        if (process.env.OPENSHIFT_MONGODB_DB_URL) {
            MONGODB_CONNECTION = process.env.OPENSHIFT_MONGODB_DB_URL + process.env.MONGODB_DATABASE;
        }
        return MONGODB_CONNECTION;
    }
}
exports.ServerEnv = ServerEnv;
