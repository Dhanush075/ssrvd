import { ConfigPathResolver } from "@skillmine-dev-public/config-resolver-util";
import { ErrorEntity, HttpStatus } from "@skillmine-dev-public/response-util";
import * as mongoose from "mongoose";
import * as path from "path";
import { MongoConfig } from "./Config/MongoConfig";
import { DBModels } from "./DBModels";
import { PropertyResolverMode } from "./Enums/PropertyResolverMode";

export class DbContext {
    private static dbModels: DBModels | null = null;

    static async getContextByConfig(): Promise<DBModels> {
        if (this.dbModels) {
            // Database connection already exists. Return connection object
            return Promise.resolve(this.dbModels);
        } else {
            let connectionString = "";

            // const mongoConfigFileName = process.env.MONGO_CONFIG_FILE_NAME || "mongo.json";
            // const resourcePath = ConfigPathResolver.Instance.resolveResourcePath("/configs/dbconfig");
            // const dbConfigPath = path.join(resourcePath, mongoConfigFileName);
            // const config = new MongoConfig().load(dbConfigPath);
            connectionString = process.env.MONGO_CONFIG;
            //  if(!connectionString) {
            //     return Promise.reject(new ErrorEntity({ http_code: HttpStatus.BAD_REQUEST, error: "no_db_found" }));
            // }

            try {
                this.dbModels = this.setupModels(connectionString);
                return Promise.resolve(this.dbModels);
            } catch (error) {
                return Promise.reject(new ErrorEntity({ http_code: HttpStatus.INTERNAL_SERVER_ERROR, error: "error_init_db", internal_error: error }));
            }
        }
    }

    private static setupModels(connectionString: string): DBModels {
        (mongoose as any).Promise = global.Promise;

     

        const dbC: mongoose.Connection = mongoose.createConnection(connectionString);

        dbC.on('connected', function () {
            console.info("Mongoose connection is open");
        });

        dbC.on('error', function (err: any) {
            console.error("Mongoose connection error: " + err);
        });

        dbC.on('disconnected', function () {
            console.info("Mongoose connection is disconnected");
        });

        process.on('SIGINT', function () {
            dbC.close(function () {
                console.info("Mongoose connection is disconnected due to application termination");
                // process.exit(0)
            });
        });

        return new DBModels(dbC);
    }
}

export default DbContext;
