import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { RequestContextMiddleware } from 'routers/middlewares/requestcontext.middleware';
import { RequestContextPreparationService } from 'routers/context/request/requestcontext.service';
import { SubSevasController } from './SubSevas/Controller/subseva.controller';
import { UserRecieptController } from './UserReciept/Controller/userreciept.controller';
import { SevasController } from './Sevas/Controller/seva.controller';
import { PaymentGatewayController } from './PaymentGateWay/Controller/paymentgateway.controller';



@Module({
  imports: [ConfigModule.forRoot(), HttpModule, ScheduleModule.forRoot()],
  controllers: [
    AppController,
    SevasController,
    SubSevasController,
    UserRecieptController,
    PaymentGatewayController
    
  ],
  providers: [
    RequestContextMiddleware,
    RequestContextPreparationService,
   
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
