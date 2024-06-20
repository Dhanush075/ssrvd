import { DbContext } from "../../../database/DBContext";
import { ISevas } from "../model/collections/Sevas";
import { HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { stringify } from 'flatted';

export class SevaService {
    private static _instance: SevaService;
    static get Instance() {
        if (!this._instance) {
            this._instance = new SevaService();
        }
        return this._instance;
    }

    /**
     * Create New Sevas
     */
    async createNewSeva(sevas: ISevas): Promise<ISevas> {
        try {
            const dbContext = await DbContext.getContextByConfig();
            const newSeva = new dbContext.Sevas();
            Object.assign(newSeva, sevas);
            return await newSeva.save();
        } catch (error) {
            throw new HttpException('Failed to create Seva', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getSevaByID(seva_id: string): Promise<ISevas> {
        try {
            const dbContext = await DbContext.getContextByConfig();
            const savedSevas = await dbContext.Sevas.findOne({ _id: seva_id });
            if (!savedSevas) {
                throw new HttpException('Seva not found', HttpStatus.NOT_FOUND);
            }
            return savedSevas;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Failed to get Seva by ID', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // /**
    // * Get All Sevas
    // */
    // async getAllSevas() {
    //     try {
    //         const dbContext = await DbContext.getContextByConfig();
    //         const today = new Date();
    //         const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' });
    //         const savedSevas = await dbContext.Sevas.aggregate([
    //             {
    //                 $lookup: {
    //                     from: "SubSevas",
    //                     let: { parentSevaRef: "$_id" },
    //                     pipeline: [
    //                         {
    //                             $match: {
    //                                 $expr: {
    //                                     $and: [
    //                                         { $eq: ["$parentSevaRef", "$$parentSevaRef"] },
    //                                         { $eq: ["$isSpecialParentSeva", true] },
    //                                         { $eq: ["$specialSevaDay", dayOfWeek] },
    //                                     ],
    //                                 },
    //                             },
    //                         },
    //                     ],
    //                     as: "SubSevas",
    //                 },
    //             },
    //         ]);

    //         if (!savedSevas || savedSevas.length === 0) {
    //             throw new HttpException('Seva not found', HttpStatus.NOT_FOUND);
    //         }
    //         return savedSevas;
    //     } catch (error) {
    //         if (error instanceof HttpException) {
    //             throw error;
    //         }
    //         throw new HttpException('Failed to get all Sevas', HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }






    

    async getAllSevas(getServices: boolean) {
        try {
            const dbContext = await DbContext.getContextByConfig();
            let body = {
                "getServices": getServices,
               
            }
            let url = "https://bhadradritemple.telangana.gov.in/apis/api.php";
            let method = "GET";
            let headers = {
                'Apikey': 'a9e0f8a33497dbe0de8ea0e154d2a090',
                'Content-Type': 'application/json',
                'Ver': '1.0'
            };
            const axiosConfig = {
                headers: headers,
                method: method,
                url: url,
                data: body

            };

            const savedSevas = await axios(axiosConfig);
            console.log("savedSevas",savedSevas.data)
            return savedSevas.data;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Failed to get all Sevas', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
