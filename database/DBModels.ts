import * as mongoose from "mongoose";

//#region start-db-import
//Sevas
import * as Sevas from "../src/Sevas/model/collections/Sevas";

//SubSevas
import * as SubSevas from "../src/SubSevas/model/collections/SubSevas";

//UserReciept
import * as UserReciept from "../src/UserReciept/model/collections/UserReciept";

//Cart 
import * as Cart from "../src/Cart/model/collections/Cart";

//payment gateway
import * as PaymentGateway from "../src/PaymentGateWay/model/collections/PaymentGateway";


export class DBModels {
   //#region start-db-model-declaration

   //Sevas
   public Sevas: mongoose.Model<Sevas.ISevas>;

   //SubSevas
   public SubSevas: mongoose.Model<SubSevas.ISubSevas>;

   //UserReciept
   public UserReciept: mongoose.Model<UserReciept.IUserReciept>;

   //Cart
   public Cart: mongoose.Model<Cart.ICart>;

   //PaymentGateway

   public PaymentGateway: mongoose.Model<PaymentGateway.IPaymentGateway>



   //#endregion start-db-model-declaration
   constructor(dbC: mongoose.Connection) {


      //Sevas
      this.Sevas = dbC.model<Sevas.ISevas>(
         Sevas.CollectionName,
         Sevas.ISevaSchema,
         Sevas.CollectionName
      );

      //SubSevas
      this.SubSevas = dbC.model<SubSevas.ISubSevas>(
         SubSevas.CollectionName,
         SubSevas.ISubSevaSchema,
         SubSevas.CollectionName
      );

      //UserReciept
      this.UserReciept = dbC.model<UserReciept.IUserReciept>(
         UserReciept.CollectionName,
         UserReciept.IUserRecieptSchema,
         UserReciept.CollectionName
      );

        //Cart
        this.Cart = dbC.model<Cart.ICart>(
         Cart.CollectionName,
         Cart.ICartSchema,
         Cart.CollectionName
      );

      //PaymentGateway
      this.PaymentGateway = dbC.model<PaymentGateway.IPaymentGateway>(
         PaymentGateway.CollectionName,
         PaymentGateway.IPaymentGatewayScheme,
         PaymentGateway.CollectionName
      );
   }
}
