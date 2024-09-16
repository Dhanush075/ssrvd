import { Controller, Post, Body, Param, Get, Query, HttpException, HttpStatus } from "@nestjs/common";
import { PaymentGatewayService } from "../Services/PaymentGateWayService";
import { IPaymentGateway } from "../model/collections/PaymentGateway";


@Controller('payment-gateway')
export class PaymentGatewayController {

    @Post("/create/orderitem")
    async createOrderInit(@Body() body: any) {
        const result = await PaymentGatewayService.Instance.createOrderInit(body);
        return { data: result };
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

    @Post("/updateBhadhraChalam")
    async createNewSeva(@Body() body: any) {
        const result = await PaymentGatewayService.Instance.updateBhadhraChalam(body);
        return  result ;
    }
}

