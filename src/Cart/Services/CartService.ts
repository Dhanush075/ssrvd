// import { RequestContext } from "@skillmine-dev-public/auth-utils";
// import { ErrorEntity, HttpStatus } from "@skillmine-dev-public/response-util";
// import DbContext from "database/DBContext";
// import { ICart } from "../model/collections/Cart";



// export class UserRecieptService {
//     private static _instance: UserRecieptService;
//     static get Instance() {
//         if (!this._instance) {
//             this._instance = new UserRecieptService();
//         }
//         return this._instance;
//     }

//     /**
//      * Create New Cart
//      */
//     async createNew(cart: ICart) {
//         try {
//             const dbContext = await DbContext.getContextByConfig();
//             const newUserReciept = new dbContext.Cart();
//             Object.assign(newUserReciept, <IUserReciept>userReciept);
//             let saved = await newUserReciept.save();
//             let specialSevaCount = await dbContext.SubSevas.findOne({ _id: saved.subSevaref, isSpecialParentSeva: true });
//             if(specialSevaCount){
//                 if (specialSevaCount.specialSevaAvailableCount != 0) {
//                     let count = specialSevaCount.specialSevaAvailableCount - userReciept.numberOfTickets;
//                     let updateCount = await dbContext.SubSevas.updateOne({ _id: saved.subSevaref }, { $set: { specialSevaAvailableCount: count } });
//                 }
//             }
//             return Promise.resolve(saved);
//         }
//         catch (error) {
//             return Promise.reject(error);
//         }
//     }

//     async getUserRecieptByID(userRecieptId: string) {
//         try {
//             const dbContext = await DbContext.getContextByConfig();
//             const savedUserReciept = await dbContext.UserReciept.find({ _id: userRecieptId });
//             if (!savedUserReciept) {
//                 throw new ErrorEntity({ http_code: HttpStatus.CONFLICT, error: "Not found", error_description: "UserReciept Not found" });
//             }
//             return Promise.resolve(savedUserReciept);
//         }
//         catch (error) {
//             return Promise.reject(error);
//         }
//     }

//     /**
//     * Get All UserReciept
//     */
//     async getAllUserReciept() {
//         try {
//             const dbContext = await DbContext.getContextByConfig();
//             const savedUserReciept = await dbContext.UserReciept.find({});
//             if (!savedUserReciept) {
//                 throw new ErrorEntity({ http_code: HttpStatus.CONFLICT, error: "Not found", error_description: "Seva Not found" });
//             }
//             return Promise.resolve(savedUserReciept);
//         }
//         catch (error) {
//             return Promise.reject(error);
//         }
//     }








// }