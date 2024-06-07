import { RequestContext } from "@skillmine-dev-public/auth-utils";
import { ErrorEntity, HttpStatus } from "@skillmine-dev-public/response-util";
import { DbContext } from "../../../database/DBContext";
import { ISevas } from "../model/collections/Sevas";


export class SevaService {
    private static _instance: SevaService;
    static get Instance() {
        if (!this._instance) {
            this._instance = new SevaService();
        }
        return this._instance;
    }

    /**
     * Create New ContactUs
     */
    async createNewSeva(sevas: ISevas): Promise<ISevas> {
        try {
            const dbContext = await DbContext.getContextByConfig();
            const newSeva = new dbContext.Sevas();
            Object.assign(newSeva, <ISevas>sevas);
            let saved = await newSeva.save();
            return Promise.resolve(saved);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }

    async getSevaByID(seva_id: string): Promise<ISevas> {
        try {
            const dbContext = await DbContext.getContextByConfig();
            const savedSevas = await dbContext.Sevas.findOne({ _id: seva_id });
            if (!savedSevas) {
                throw new ErrorEntity({ http_code: HttpStatus.CONFLICT, error: "Not found", error_description: "Seva Not found" });
            }
            return Promise.resolve(savedSevas);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }

    /**
    * Get All Sevas
    */
    async getAllSevas() {
        try {
            const dbContext = await DbContext.getContextByConfig();
            const today = new Date();
            const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' });
            const savedSevas = await dbContext.Sevas.aggregate([
                {
                    $lookup: {
                        from: "SubSevas",
                        let: { parentSevaRef: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$parentSevaRef", "$$parentSevaRef"] },
                                            { $eq: ["$isSpecialParentSeva", true] },
                                            { $eq: ["$specialSevaDay", dayOfWeek] },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "SubSevas",
                    },
                },
            ])
            if (!savedSevas) {
                throw new ErrorEntity({ http_code: HttpStatus.CONFLICT, error: "Not found", error_description: "Seva Not found" });
            }
            return Promise.resolve(savedSevas);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }








}