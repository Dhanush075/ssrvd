import axios from "axios";
import { DbContext } from "../../../database/DBContext";
import { ISubSevas } from "../model/collections/SubSevas";
import { HttpException, HttpStatus } from '@nestjs/common';

export class SubSevaService {
    private static _instance: SubSevaService;
    static get Instance() {
        if (!this._instance) {
            this._instance = new SubSevaService();
        }
        return this._instance;
    }

    async createNewSubSeva(subSevas: ISubSevas): Promise<ISubSevas> {
        try {
            const dbContext = await DbContext.getContextByConfig();
            const newSubSeva = new dbContext.SubSevas();
            Object.assign(newSubSeva, subSevas);
            return await newSubSeva.save();
        } catch (error) {
            throw new HttpException('Failed to create SubSeva', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getSubSevaByID(subSevaId: string) {
        try {
            const dbContext = await DbContext.getContextByConfig();
            const savedSubSevas = await dbContext.SubSevas.findOne({ _id: subSevaId });
            if (!savedSubSevas) {
                throw new HttpException('SubSeva not found', HttpStatus.NOT_FOUND);
            }
            return savedSubSevas;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Failed to get SubSeva by ID', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // async getAllSubSevas(parentSevaRef: string) {
    //     try {
    //         const dbContext = await DbContext.getContextByConfig();
    //         const isSpecialSeva = await dbContext.SubSevas.findOne({ parentSevaRef });
    //         if (!isSpecialSeva) {
    //             throw new HttpException('SubSeva not found', HttpStatus.NOT_FOUND);
    //         }

    //         if (isSpecialSeva.isSpecialParentSeva) {
    //             const today = new Date();
    //             const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' });
    //             const specialSevas = await dbContext.SubSevas.find({ parentSevaRef, specialSevaDay: dayOfWeek });
    //             return specialSevas;
    //         } else {
    //             const savedSubSevas = await dbContext.SubSevas.find({ parentSevaRef });
    //             if (!savedSubSevas || savedSubSevas.length === 0) {
    //                 throw new HttpException('SubSeva not found', HttpStatus.NOT_FOUND);
    //             }
    //             return savedSubSevas;
    //         }
    //     } catch (error) {
    //         if (error instanceof HttpException) {
    //             throw error;
    //         }
    //         throw new HttpException('Failed to get all SubSevas', HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }

    async getAllSubSevas(getsubServices: boolean, seva_type: number) {
        try {
            let body = {
                "getsubServices": getsubServices,
                "seva_type": seva_type

               
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

            const savedSubSevas = await axios(axiosConfig);
            return savedSubSevas.data;
            
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Failed to get all SubSevas', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
