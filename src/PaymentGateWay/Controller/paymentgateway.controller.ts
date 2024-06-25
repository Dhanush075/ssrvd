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

   
    // @Post("/payment/verify")
    // async verifyThepayment(@Body() body: IPaymentGateway) {
    //     const result = await PaymentGatewayService.Instance.verifyTheStatus(body);
    //     return { data: result };
    // }
       
    @Post("/update/transactionId/orderId")
    async updateTransactionIdAndOrderId(@Body() body: any) {
        const result = await PaymentGatewayService.Instance.updateTransactionIdannOrderId(body);
        return  result ;
    }
}
