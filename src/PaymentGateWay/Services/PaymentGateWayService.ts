import { DbContext } from "../../../database/DBContext";
import { HttpException, HttpStatus } from '@nestjs/common';
import { IPaymentGateway } from "../model/collections/PaymentGateway";
import axios from "axios";

const Razorpay = require('razorpay');
const crypto = require("crypto");

export class PaymentGatewayService {
    private static _instance: PaymentGatewayService;
    static get Instance() {
        if (!this._instance) {
            this._instance = new PaymentGatewayService();
        }
        return this._instance;
    }

    async createOrderInit(body: any) {
        try {
            const dbContext = await DbContext.getContextByConfig();
            let url = "https://www.switchpay.in/api/createTransaction";
            let method = "POST";
            let headers = {
                'Authorization': '367|qM5tv66Rhk8Tm13DlvDkc92KNwVMvAhOuljLB8tA',
                'Content-Type': 'multipart/form-data',
            };
            const transactionData = {
                amount: body.amount,
                description: 'laddu',
                name: body.name,
                email: 'dhanushnm07@gmail.com',
                mobile: body.mobileNumber,
                enabledModesOfPayment: 'upi',
                payment_method: 'UPI_INTENT',
                source: 'api',
                order_id: body.order_id, // Use the order_id received from the create receipt API
                user_uuid: 'swp_sm_903dd099-3a9e-4243-ac1e-f83f83c30725',
                other_info: 'api',
                encrypt_response: 0
            };
            const form = new FormData();
            for (const key in transactionData) {
                form.append(key, transactionData[key]);
                let abc = form.append(key, transactionData[key]);
                console.log
            }
            console.log("form", form)
            const axiosConfig = {
                headers: headers,
                method: method,
                url: url,
                data: form

            };
            const order = await axios(axiosConfig)
            console.log("order", order.data);
            // const order = await axios.post(url, form, {
            //     headers: {
            //         'Authorization': '367|qM5tv66Rhk8Tm13DlvDkc92KNwVMvAhOuljLB8tA',
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });
            // console.log("order", order.data)

            const newOrder = new dbContext.PaymentGateway();
            newOrder.order_id = body.order_id;
            // newOrder.transaction_id = order.data.transaction_id;
            let saved = await newOrder.save();
            return form;
        } catch (error) {
            throw new HttpException('Internal Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createRazorpayOrder(instance: any, orderItesm: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            let ORder = await instance.orders.create(
                orderItesm, async function (error, order) {
                    if (error) {
                        reject(new HttpException('Internal Error', HttpStatus.INTERNAL_SERVER_ERROR))
                    }
                    else {
                        resolve(order);
                    }
                }
            )
        })
    }

    async getSecretKey() {
        try {
            let api_key = {}
            api_key["key_id"] = process.env.key_id;
            api_key["key_secret"] = process.env.key_secret;
            return api_key;
        } catch (error) {
            throw new HttpException('Internal Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateTransactionIdannOrderId(body: any) {
        try {
            const dbContext = await DbContext.getContextByConfig();
            const orderId = await dbContext.UserReciept.updateOne({ order_id: body.order_id }, { $set: { transaction_id: body.transaction_id } })
            const newOrder = new dbContext.PaymentGateway();
            newOrder.order_id = body.order_id;
            newOrder.transaction_id = body.transaction_id;
            let orderCreated = await dbContext.UserReciept.findOne({ order_id: body.order_id });
            if (orderCreated) {
                newOrder.name = orderCreated.name;
                newOrder.mobile = orderCreated.mobileNumber;
            }
            let saved = await newOrder.save();
            console.log(saved);
            return saved;
        } catch (error) {
            throw new HttpException('Internal Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // async verifyTheStatus(verifiction_status: IPaymentGateway) {
    //     try {
    //         const dbContext = await DbContext.getContextByConfig();

    //         let body = verifiction_status.razorpay_order_id + "|" + verifiction_status.razorpay_payment_id;
    //         var expectedSignature = crypto.createHmac('sha256', process.env.key_secret)
    //         .update(body.toString())
    //         .digest('hex');

    //     var response = { "signatureIsValid": "false" }
    //     if (expectedSignature === verifiction_status.razorpay_signature) {
    //         response = { "signatureIsValid": "true" }
    //     }

    //     if (response.signatureIsValid == "true") {
    //         let savedpaymentDetails = await dbContext.PaymentGateway.findOne({
    //             "order_ref": verifiction_status.razorpay_order_id
    //         });
    //         if (savedpaymentDetails) {
    //             savedpaymentDetails.is_verified = response.signatureIsValid === 'true';
    //             savedpaymentDetails.razorpay_order_id = verifiction_status.razorpay_order_id;
    //             savedpaymentDetails.razorpay_payment_id = verifiction_status.razorpay_payment_id;
    //             savedpaymentDetails.razorpay_signature = verifiction_status.razorpay_signature;
    //             savedpaymentDetails.razorypay_sig_received = verifiction_status.razorpay_signature;
    //             savedpaymentDetails.razorypay_sig_generated = expectedSignature;
    //             let api_key = {
    //                 "key_id": process.env.key_id,
    //                 "key_secret": process.env.key_secret
    //             }

    //             var order_instance = new Razorpay(api_key);
    //             await order_instance.orders.fetch(verifiction_status.razorpay_order_id, async function (error, Order) {
    //                 let savedpaymentDetails = await dbContext.PaymentGateway.findOne({
    //                     "order_ref": verifiction_status.razorpay_order_id
    //                 });
    //                 if (savedpaymentDetails) {
    //                     savedpaymentDetails.status = order_instance.status;
    //                     savedpaymentDetails.attempts = order_instance.attempts
    //                 }
    //             });
    //             let result = await savedpaymentDetails.save();
    //             return result;

    //             }
    //         }
    //     }
    //     catch (error) {
    //         throw new HttpException('Could not verify', HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }



    async verifyChecksum(body: any) {
        try {
            const dbContext = await DbContext.getContextByConfig();
            const tokenToHash = process.env.Bearer_Secret;
            const key = crypto.createHash('sha256').update(tokenToHash).digest('hex');
            console.log("body",body);

            console.log("body.payload",body.payload);
            console.log("body.payload.checksum",body.payload.checksum);
            // Step 2: Parse the payload and remove the checksum field
            const parsedPayload = JSON.parse(body.payload);
            delete parsedPayload.checksum;
            console.log("parsedPayload",parsedPayload);

            // Step 3: Sort the payload keys and concatenate their values
            const sortedKeys = Object.keys(parsedPayload).sort();
            const sortedPayload = sortedKeys.map(key => parsedPayload[key]).join('');

            // Step 4: Generate the HMAC SHA-256 hash
            const hmac = crypto.createHmac('sha256', key);
            const generatedHash = hmac.update(sortedPayload).digest('hex');
            console.log("generatedHash",generatedHash);
            console.log("body.payload.checksum",body.payload.checksum);
            // Step 5: Compare the generated hash with the provided checksum
            if (generatedHash === body.payload.checksum) {
                const payment = await dbContext.PaymentGateway.updateOne({transaction_id: body.payload.order_id}, { $set: {status: body.payload.status, request_data: body.payload.request_data, checksum: body.payload.checksum }});
                return true;
            }
            else{
                return false;
            }
        } catch (error) {
            throw new HttpException('Failed to Verfiy Payment', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




}
