import * as fs from "fs";
import * as path from "path";

export class MongoConfig {
    public tenantKey?: string;
    public database?: string;
    public replicaSet?: string;
    public hosts?: string;
    public username?: string;
    public pw?: string;
    public ssl?: boolean;
    public connectTimeoutMS?: number;
    public socketTimeoutMS?: number;
    public maxPoolSize?: number;
    public minPoolSize?: number;
    public maxIdleTimeMS?: number;
    public waitQueueMultiple?: number;
    public waitQueueTimeoutMS?: number;
    public readPreference?: string;
    public maxStalenessSeconds?: number;
    public readPreferenceTags?: string;
    public authSource?: string;
    public authMechanism?: string;
    public gssapiServiceName?: string;
    public localThresholdMS?: number;
    public serverSelectionTimeoutMS?: number;
    public serverSelectionTryOnce?: boolean;
    public heartbeatFrequencyMS?: number;
    public uuidRepresentation?: string;
    public poolSize: number = 10;
    public connection_string: string = "";

    constructor() {

    }

    load(configPath: string): MongoConfig {
        let fileData = JSON.parse(fs.readFileSync(path.resolve(configPath), { encoding: "utf8" }));
        let newInstance = Object.create(MongoConfig.prototype);
        return Object.assign(newInstance, fileData);
    }

    getConnectionString(): string {

        if (this.connection_string) {
            return this.connection_string;
        }

        if (!this.connectTimeoutMS) {
            this.connectTimeoutMS = 60000;
        }

        if (!this.socketTimeoutMS) {
            this.socketTimeoutMS = 60000;
        }
        if (!this.readPreference) {
            this.readPreference = "secondaryPreferred";
        }


        var connectionstring = "mongodb://"

        if (this.username && this.pw) {
            connectionstring = connectionstring + this.username + ":" + this.pw + "@";

            if (!this.authMechanism) {
                this.authMechanism = "SCRAM-SHA-1";
            }

            if (!this.authSource) {
                this.authSource = "admin";
            }

        }

        connectionstring = connectionstring + this.hosts
            + "/" + this.database
            + "?connectTimeoutMS=" + this.connectTimeoutMS
            + "&socketTimeoutMS=" + this.socketTimeoutMS;

        if (this.authSource) {
            connectionstring = connectionstring + "&authSource=" + this.authSource;
        }
        if (this.authMechanism) {
            connectionstring = connectionstring + "&authMechanism=" + this.authMechanism;
        }
        if (this.replicaSet) {
            connectionstring = connectionstring + "&replicaSet=" + this.replicaSet;
        }
        if (this.readPreference) {
            connectionstring = connectionstring + "&readPreference=" + this.readPreference;
        }
        if (this.poolSize && this.poolSize > 0) {
            connectionstring = connectionstring + "&poolSize=" + this.poolSize;
        }


        return connectionstring;
    }

    static majority_write: any = { writeConcern: { w: "majority", wtimeout: 10000 } };
}
