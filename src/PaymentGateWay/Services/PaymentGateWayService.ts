import { DbContext } from "../../../database/DBContext";
import { HttpException, HttpStatus } from '@nestjs/common';
import { IPaymentGateway } from "../model/collections/PaymentGateway";

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
            let api_key = {}
            api_key["key_id"] = process.env.key_id;
            api_key["key_secret"] = process.env.key_secret;
            var instance = new Razorpay(api_key);

            body.amount = Number(body.amount);

            let saved: any;
            let query = {};
            if (body.amount) {
                query['amount'] = body.amount;
            }
            if (body.currency) {
                query['currency'] = body.currency
            }
            if (body.notes) {
                query['notes'] = body.notes
            }

            let order = await this.createRazorpayOrder(instance, query);
            console.log("order",order)

            const newOrder = new dbContext.PaymentGateway();
            newOrder.order_ref = order.id;
            Object.assign(newOrder, order);
            saved = await newOrder.save();
            return order;
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

    
    async verifyTheStatus(verifiction_status: IPaymentGateway) {
        try {
            const dbContext = await DbContext.getContextByConfig();

            let body = verifiction_status.razorpay_order_id + "|" + verifiction_status.razorpay_payment_id;
            var expectedSignature = crypto.createHmac('sha256', process.env.key_secret)
            .update(body.toString())
            .digest('hex');

        var response = { "signatureIsValid": "false" }
        if (expectedSignature === verifiction_status.razorpay_signature) {
            response = { "signatureIsValid": "true" }
        }

        if (response.signatureIsValid == "true") {
            let savedpaymentDetails = await dbContext.PaymentGateway.findOne({
                "order_ref": verifiction_status.razorpay_order_id
            });
            if (savedpaymentDetails) {
                savedpaymentDetails.is_verified = response.signatureIsValid === 'true';
                savedpaymentDetails.razorpay_order_id = verifiction_status.razorpay_order_id;
                savedpaymentDetails.razorpay_payment_id = verifiction_status.razorpay_payment_id;
                savedpaymentDetails.razorpay_signature = verifiction_status.razorpay_signature;
                savedpaymentDetails.razorypay_sig_received = verifiction_status.razorpay_signature;
                savedpaymentDetails.razorypay_sig_generated = expectedSignature;
                let api_key = {
                    "key_id": process.env.key_id,
                    "key_secret": process.env.key_secret
                }

                var order_instance = new Razorpay(api_key);
                await order_instance.orders.fetch(verifiction_status.razorpay_order_id, async function (error, Order) {
                    let savedpaymentDetails = await dbContext.PaymentGateway.findOne({
                        "order_ref": verifiction_status.razorpay_order_id
                    });
                    if (savedpaymentDetails) {
                        savedpaymentDetails.status = order_instance.status;
                        savedpaymentDetails.attempts = order_instance.attempts
                    }
                });
                let result = await savedpaymentDetails.save();
                return result;

                }
            }
        }
        catch (error) {
            throw new HttpException('Could not verify', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}
