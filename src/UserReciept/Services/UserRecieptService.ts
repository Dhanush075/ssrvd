import { RequestContext } from "@skillmine-dev-public/auth-utils";
import { ErrorEntity, HttpStatus } from "@skillmine-dev-public/response-util";
import { IUserReciept } from "../model/collections/UserReciept";
import DbContext from "database/DBContext";
import { HttpException } from "@nestjs/common";
import axios from "axios";



export class UserRecieptService {
    private static _instance: UserRecieptService;
    static get Instance() {
        if (!this._instance) {
            this._instance = new UserRecieptService();
        }
        return this._instance;
    }

    /**
     * Create New UserReciept
     */
    // async createNewUserReciept(userReciept: any) {
    //     try {
    //         const dbContext = await DbContext.getContextByConfig();
    //         const newUserReciept = new dbContext.UserReciept();
    //         Object.assign(newUserReciept, <IUserReciept>userReciept);
    //         let saved = await newUserReciept.save();
    //         let specialSevaCount = await dbContext.SubSevas.findOne({ _id: saved.subSevaref, isSpecialParentSeva: true });
    //         if(specialSevaCount){
    //             if (specialSevaCount.specialSevaAvailableCount != 0) {
    //                 let count = specialSevaCount.specialSevaAvailableCount - userReciept.numberOfTickets;
    //                 let updateCount = await dbContext.SubSevas.updateOne({ _id: saved.subSevaref }, { $set: { specialSevaAvailableCount: count } });
    //             }
    //         }
    //         return Promise.resolve(saved);
    //     }
    //     catch (error) {
    //         return Promise.reject(error);
    //     }
    // }

    async createNewUserReciept(userReciept: any) {
        try {
            let url = "https://bhadradritemple.telangana.gov.in/apis/api.php";
            let method = "POST";
            let headers = {
                'Apikey': 'a9e0f8a33497dbe0de8ea0e154d2a090',
                'Content-Type': 'application/json',
                'Ver': '1.0'
            };
            const axiosConfig = {
                headers: headers,
                method: method,
                url: url,
                data: userReciept

            };

            const reciept = await axios(axiosConfig);
            console.log("savedSevas",reciept.data)
            return reciept.data;
        } catch (error) {
            throw new HttpException('Failed to create SubSeva', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async getUserRecieptByID(userRecieptId: string) {
        try {
            const dbContext = await DbContext.getContextByConfig();
            const savedUserReciept = await dbContext.UserReciept.find({ _id: userRecieptId });
            if (!savedUserReciept) {
                throw new ErrorEntity({ http_code: HttpStatus.CONFLICT, error: "Not found", error_description: "UserReciept Not found" });
            }
            return Promise.resolve(savedUserReciept);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }

    /**
    * Get All UserReciept
    */
    async getAllUserReciept() {
        try {
            const dbContext = await DbContext.getContextByConfig();
            const savedUserReciept = await dbContext.UserReciept.find({});
            if (!savedUserReciept) {
                throw new ErrorEntity({ http_code: HttpStatus.CONFLICT, error: "Not found", error_description: "Seva Not found" });
            }
            return Promise.resolve(savedUserReciept);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }








}