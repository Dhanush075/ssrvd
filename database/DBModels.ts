import * as mongoose from "mongoose";

//#region start-db-import
//Sevas
import * as Sevas from "../src/Sevas/model/collections/Sevas";

//SubSevas
import * as SubSevas from "../src/SubSevas/model/collections/SubSevas";

//UserReciept
import * as UserReciept from "../src/UserReciept/model/collections/UserReciept";

export class DBModels {
   //#region start-db-model-declaration

   //Sevas
   public Sevas: mongoose.Model<Sevas.ISevas>;

   //SubSevas
   public SubSevas: mongoose.Model<SubSevas.ISubSevas>;
   
   //UserReciept
   public UserReciept: mongoose.Model<UserReciept.IUserReciept>;

  

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
   }
}
