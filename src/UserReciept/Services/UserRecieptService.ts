import { RequestContext } from "@skillmine-dev-public/auth-utils";
import { ErrorEntity, HttpStatus } from "@skillmine-dev-public/response-util";
import { IUserReciept } from "../model/collections/UserReciept";
import DbContext from "database/DBContext";
import { HttpException } from "@nestjs/common";
import axios from "axios";
import { PaymentGatewayService } from "src/PaymentGateWay/Services/PaymentGateWayService";



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
            const dbContext = await DbContext.getContextByConfig();
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

            let reciept = await axios(axiosConfig)
            const newOrder = new dbContext.UserReciept();
            // Object.assign(newOrder, <IUserReciept>userReciept);
            newOrder.bookingdata = userReciept.bookingdata;
            newOrder.SubmitSevaBooking = userReciept.SubmitSevaBooking;
            newOrder.order_id = reciept.data.order_id;
            newOrder.name = userReciept.name;
            newOrder.total_amount = userReciept.total_amount;
            newOrder.booking_date = new Date();
            newOrder.mobileNumber = userReciept.mobileNumber;
            let saved = await newOrder.save();
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

    async getRecieptCountDateWise(date: any) {
        try {
            const dbContext = await DbContext.getContextByConfig();
            let convertedFromDate = new Date(date.fromDate);
            let result;
            convertedFromDate.setHours(0, 0, 0, 0);
            let convertedToDate = new Date(date.toDate);
            convertedToDate.setHours(23, 59, 59, 999);
            if (date.fromDate && date.toDate && date.service_id) {
                result = await dbContext.UserReciept.aggregate([
                    {
                        $match: {
                            "bookingdata.service_id": date.service_id,
                            createdAt: { $gte: convertedFromDate, $lte: convertedToDate }
                            // createdAt: date
                        },
                    },
                    { $unwind: '$bookingdata' },
                    // Match documents where the sevaId matches the one in the payload
                    {
                        $match: {
                            "bookingdata.service_id": date.service_id,
                        },
                    },
                    // Group by sevaId and calculate the totalAmount and totalQty
                    {
                        $group: {
                            _id: '$bookingdata.service_id',
                            totalAmount: { $sum: '$bookingdata.total' },
                            totalQty: { $sum: '$bookingdata.quantity' },
                        },
                    },

                ]);
                if (result.length === 0) {
                    return { totalAmount: 0, totalQty: 0 };
                }

                // Return the totalAmount and totalQty for the matching sevaId
                return {
                    totalAmount: result[0].totalAmount,
                    totalQty: result[0].totalQty,
                };

            }
            else if(!date.service_id){
                result = await dbContext.UserReciept.aggregate([
                    {
                        $match: {
                            createdAt: { $gte: convertedFromDate, $lte: convertedToDate }
                        },
                    },
                    

                ]);
                if (result.length === 0) {
                    return { totalAmount: 0, totalQty: 0 };
                }

                // Return the totalAmount and totalQty for the matching sevaId
                return {
                    totalAmount: result[0].totalAmount,
                    totalQty: result[0].totalQty,
                };

            }
            else {
                throw new HttpException('Empty Payload', HttpStatus.NOT_FOUND);
            }

        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Error retrieving registrations by Patient ID', HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async updatePaymentStatus(id: string) {
        try {
            const dbContext = await DbContext.getContextByConfig();
            const updatedUser = await dbContext.UserReciept.updateOne({ order_id: id }, { $set: { isPaid: true } });
            if (!updatedUser) {
                throw new HttpException('Reciept Not found', HttpStatus.NOT_FOUND);
            }
            return true;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Error updating user profile', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }





}