import { Controller, Post, Body, Param, Get, Query, HttpException, HttpStatus, Req, Res } from "@nestjs/common";
import { PaymentGatewayService } from "../Services/PaymentGateWayService";
import { IPaymentGateway } from "../model/collections/PaymentGateway";


@Controller('payment-gateway')
export class PaymentGatewayController {

    // @Post("/create/orderitem")
    // async createOrderInit(@Body() body: any) {
    //     const result = await PaymentGatewayService.Instance.createOrderInit(body);
    //     return { data: result };
    // }

    @Post("/generatePaymentLink")
    async generatePaymentLink(@Body() body: any) {
        console.log("ofbody",body)
        const result = await PaymentGatewayService.Instance.generatePaymentLink(body);
        return result;
    }

    @Get("/key")
    async getSevaByID() {
        const result = await PaymentGatewayService.Instance.getSecretKey();
        return { data: result };
    }


    @Post("/payment/verify")
    async verifyThepayment(@Body() body: any) {
        const result = await PaymentGatewayService.Instance.verifyTheStatus(body);
        return result;
    }

    @Post("/update/transactionId/orderId")
    async updateTransactionIdAndOrderId(@Body() body: any) {
        const result = await PaymentGatewayService.Instance.updateTransactionIdannOrderId(body);
        return result;
    }

    @Post('callback')
    async handleCallback(@Body() body: any): Promise<any> {
        const verifyChecksum = await PaymentGatewayService.Instance.verifyChecksum(body)
        if (verifyChecksum) {

            return { success: true, message: 'Payment successful' };
        } else {
            // Checksum verification failed, return 400 Bad Request
            throw new HttpException({ success: false, message: 'Payment failed' }, HttpStatus.BAD_REQUEST);
        }
    }
    @Get("/paymentStatus/:transaction_id")
    async getPaymentStatusByTransactionId(@Param("transaction_id") transaction_id: string) {
        const result = await PaymentGatewayService.Instance.getPaymentStatusByTransactionId(transaction_id);
        return { data: result };
    }

    @Get("generateUPIQRCode")
    async generateUPIQRCode() {
        const result = await PaymentGatewayService.Instance.generateUPIQRCode();
        return { data: result };
    }

    @Post("/updateBhadhraChalam")
    async createNewSeva(@Body() body: any) {
        const result = await PaymentGatewayService.Instance.updateBhadhraChalam(body);
        return result;
    }

    @Post("/getTransactionId")
    async getTransactionIdByOrderId(@Body() body: any) {
        const result = await PaymentGatewayService.Instance.getTransactionIdByOrderId(body);
        return result;
    }

    @Post('razorpay')
    async handleRazorpayWebhook(@Req() req, @Res() res,) {
        const payload = req.body;
        const signature = req.headers['x-razorpay-signature'] as string;


        // Call the service method to handle the webhook logic
        const result = await PaymentGatewayService.Instance.handleWebhook(payload, signature);

        // Send a response back to Razorpay
        return result;
    }
}

