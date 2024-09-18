import { DbContext } from "../../../database/DBContext";
import { HttpException, HttpStatus, Req, Res } from '@nestjs/common';
import { IPaymentGateway } from "../model/collections/PaymentGateway";
import axios from "axios";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";

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

    // async createOrderInit(body: any) {
    //     try {
    //         const dbContext = await DbContext.getContextByConfig();
    //         let url = "https://www.switchpay.in/api/createTransaction";
    //         let method = "POST";
    //         let headers = {
    //             'Authorization': '367|qM5tv66Rhk8Tm13DlvDkc92KNwVMvAhOuljLB8tA',
    //             'Content-Type': 'multipart/form-data',
    //         };
    //         const transactionData = {
    //             amount: body.amount,
    //             description: 'laddu',
    //             name: body.name,
    //             email: 'dhanushnm07@gmail.com',
    //             mobile: body.mobileNumber,
    //             enabledModesOfPayment: 'upi',
    //             payment_method: 'UPI_INTENT',
    //             source: 'api',
    //             order_id: body.order_id, // Use the order_id received from the create receipt API
    //             user_uuid: 'swp_sm_903dd099-3a9e-4243-ac1e-f83f83c30725',
    //             other_info: 'api',
    //             encrypt_response: 0
    //         };
    //         const form = new FormData();
    //         for (const key in transactionData) {
    //             form.append(key, transactionData[key]);
    //             let abc = form.append(key, transactionData[key]);
    //             console.log
    //         }
    //         console.log("form", form)
    //         const axiosConfig = {
    //             headers: headers,
    //             method: method,
    //             url: url,
    //             data: form

    //         };
    //         const order = await axios(axiosConfig)
    //         console.log("order", order.data);
    //         // const order = await axios.post(url, form, {
    //         //     headers: {
    //         //         'Authorization': '367|qM5tv66Rhk8Tm13DlvDkc92KNwVMvAhOuljLB8tA',
    //         //         'Content-Type': 'multipart/form-data',
    //         //     },
    //         // });
    //         // console.log("order", order.data)

    //         const newOrder = new dbContext.PaymentGateway();
    //         newOrder.order_id = body.order_id;
    //         // newOrder.transaction_id = order.data.transaction_id;
    //         let saved = await newOrder.save();
    //         return form;
    //     } catch (error) {
    //         throw new HttpException('Internal Error', HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }

    // async createOrderInit(body: any) {
    //     try {
    //         const dbContext = await DbContext.getContextByConfig();

    //         //create Instantiate Razorpay
    //         // let api_key = {
    //         //     "key_id": API_KEY.key_id,
    //         //     "key_secret": API_KEY.key_secret
    //         // }
    //         let api_key = {}
    //         api_key["key_id"] = process.env.key_id;
    //         api_key["key_secret"] = process.env.key_secret

    //         console.log(api_key)

    //         var instance = new Razorpay(api_key);
    //         console.log("instance",instance)

    //         body.amount = Number(body.amount);

    //         //server-side Generate Order
    //         let saved: any;
    //         let query = {};
    //         if (body.amount) {
    //             query['amount'] = body.amount;
    //         }
    //         if (body.currency) {
    //             query['currency'] = body.currency
    //         }
    //         if (body.receipt) {
    //             query['receipt'] = body.receipt
    //         }
    //         console.log(query);
    //         let order =  await instance.orders.create(query)
    //         console.log("order",order)

    //         const newOrder = new dbContext.PaymentGateway();
    //         Object.assign(newOrder, order);
    //         newOrder.order_ref = order.id;
    //         saved = await newOrder.save();
    //         return order;
    //     }
    //     catch (error) {
    //         throw new HttpException('Internal Error', HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }

    // async createOrderInit(body: any) {
    //     try {
    //         const dbContext = await DbContext.getContextByConfig();

    //         // Instantiate Razorpay with API keys
    //         const api_key = {
    //             "key_id": "rzp_test_Os0xGiUl4xP5xB",
    //             "key_secret": "Tm1FIpc8oEzosTrmkx23Rwbf"
    //           }

    //         if (!api_key.key_id || !api_key.key_secret) {
    //             throw new HttpException('Razorpay API keys are missing', HttpStatus.INTERNAL_SERVER_ERROR);
    //         }

    //         var instance = new Razorpay(api_key);

    //         // Ensure amount is converted to paise (for INR transactions)
    //         let amountInPaise = Number(body.amount) * 100; // Convert to paise

    //         if (amountInPaise < 100) {
    //             throw new HttpException('Order amount must be at least ₹1', HttpStatus.BAD_REQUEST);
    //         }

    //         // Validate and construct query for Razorpay order creation
    //         const query: any = {
    //             amount: amountInPaise,
    //             currency: body.currency || 'INR',
    //             receipt: body.receipt || `receipt_${Date.now()}`
    //         };

    //         // Generate Razorpay Order
    //         const order = await instance.orders.create(query);
    //         console.log('Order Created:', order);

    //         // Save order details to the database
    //         const newOrder = new dbContext.PaymentGateway();
    //         Object.assign(newOrder, order);
    //         newOrder.order_ref = order.id;  // Store order reference
    //         const saved = await newOrder.save();

    //         console.log('Order Saved to DB:', saved);
    //         return order;
    //     } catch (error) {
    //         console.error('Error in createOrderInit:', error);
    //         throw new HttpException('Internal Error', HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }


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

    async verifyTheStatus(body: any) {
        try {
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;
            console.log("Body", body)
            let key_secret = "Tm1FIpc8oEzosTrmkx23Rwbf"
            // Verify payment signature using Razorpay SDK
            const isPaymentVerified = await validatePaymentVerification(
                { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
                razorpay_signature,
                key_secret
            )


            if (isPaymentVerified) {
                return { success: true };
            } else {
                return { success: false };
            }
        }
        catch (error) {
            throw new HttpException('Could not verify', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async verifyChecksum(body: any) {
        try {
            const dbContext = await DbContext.getContextByConfig();
            const tokenToHash = process.env.Bearer_Secret;
            const key = crypto.createHash('sha256').update(tokenToHash).digest('hex');
            const parsedPayload = JSON.parse(body.payload);

            let checksum = parsedPayload.checksum;
            delete parsedPayload.checksum;
            const transformedPayload = {
                order_id: parsedPayload.order_id,
                request_data: parsedPayload.request_data,
                status: parsedPayload.status
            };

            const sortedPayload = JSON.stringify(transformedPayload);
            const hmac = crypto.createHmac('sha256', key);
            const generatedHash = hmac.update(sortedPayload).digest('hex');

            if (generatedHash === checksum) {
                if (parsedPayload.status === "captured") {
                    const payment = await dbContext.PaymentGateway.updateOne({ transaction_id: parsedPayload.order_id }, { $set: { status: parsedPayload.status, request_data: parsedPayload.request_data, checksum: checksum, is_verified: true } });
                    return true;
                }
                else {
                    const payment = await dbContext.PaymentGateway.updateOne({ transaction_id: parsedPayload.order_id }, { $set: { status: parsedPayload.status, request_data: parsedPayload.request_data, checksum: checksum } });
                    return false;
                }
            }
            else {
                return false;
            }
        } catch (error) {
            throw new HttpException('Failed to Verfiy Payment', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async getPaymentStatusByTransactionId(transaction_id: string) {
        try {
            const dbContext = await DbContext.getContextByConfig();
            let status = await dbContext.PaymentGateway.findOne({ transaction_id: transaction_id });
            if (status) {
                if (status.is_verified) {
                    return true;
                }
                else {
                    return false
                }
            }
            else {
                return false
            }
        } catch (error) {
            throw new HttpException('Failed to Verfiy Payment', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async updateBhadhraChalam(body: any) {
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
                data: body

            };
            let reciept = await axios(axiosConfig);
            return reciept.data;
        } catch (error) {
            throw new HttpException('Failed to create SubSeva', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // async generatePaymentLink(body: any) {
    //     try {
    //         const dbContext = await DbContext.getContextByConfig();

    //         // Instantiate Razorpay with API keys
    //         const api_key = {
    //             "key_id": "rzp_test_Os0xGiUl4xP5xB",
    //             "key_secret": "Tm1FIpc8oEzosTrmkx23Rwbf"
    //           }

    //         if (!api_key.key_id || !api_key.key_secret) {
    //             throw new HttpException('Razorpay API keys are missing', HttpStatus.INTERNAL_SERVER_ERROR);
    //         }

    //         var instance = new Razorpay(api_key);

    //         const paymentLink = await instance.paymentLink.create({
    //             amount: 1000 * 100, // Amount in paise
    //             currency: 'INR'
    //           });

    //           return paymentLink;
    //     } catch (error) {
    //         console.error('Error in createOrderInit:', error);
    //         throw new HttpException('Internal Error', HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }

    async generatePaymentLink(body: any) {
        try {
            const dbContext = await DbContext.getContextByConfig();

            // Instantiate Razorpay with API keys
            const api_key = {
                key_id: "rzp_live_3bauQc5WluPaOO",
                key_secret: "X310sX1nRP4dnv7fvdHTNdid"
            };

            if (!api_key.key_id || !api_key.key_secret) {
                throw new HttpException('Razorpay API keys are missing', HttpStatus.INTERNAL_SERVER_ERROR);
            }

            var instance = new Razorpay(api_key);

            // Create the payment link with UPI enabled
            const paymentLink = await instance.paymentLink.create({
                amount: 1000 * 100, // Amount in paise
                currency: 'INR',
                description: 'Payment for order', // Add a description for the payment
                customer: {
                    contact: 8197069628, // Customer contact details (optional)
                    email: "dhanushnm07@gmail.com"      // Customer email (optional)
                },
                // Enable UPI payments by adding the UPI option in the payment link
                upi_link: true,
                notify: {
                    sms: true, // Enable SMS notification
                    email: true // Enable email notification
                }
            });

            // Return the payment link URL (short_url)
            return paymentLink
        } catch (error) {
            console.error('Error in createOrderInit:', error);
            throw new HttpException('Internal Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async handleWebhook(payload: any, signature: string) {
        try {
            let secret = "X310sX1nRP4dnv7fvdHTNdid"
            const expectedSignature = crypto
                .createHmac('sha256', secret)
                .update(JSON.stringify(payload))
                .digest('hex');

            // Compare the expected signature with the received signature
            if (signature !== expectedSignature) {
                throw new HttpException('Invalid signature', HttpStatus.BAD_REQUEST);
            }

            // Process the verified payload
            const payment = payload.data.object;
            const paymentId = payment.id;
            const orderId = payment.order_id;
            const status = payment.status;

            // Handle the payment update (e.g., update order status in your database)
            console.log(`Payment ID: ${paymentId}`);
            console.log(`Order ID: ${orderId}`);
            console.log(`Status: ${status}`);
            return true
        } catch (error) {
            console.error('Error in createOrderInit:', error);
            throw new HttpException('Internal Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




}
