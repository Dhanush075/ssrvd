import mongoose = require("mongoose");
import { RandomNumberGenerator } from "@skillmine-dev-public/random-id-generator-util";

export interface IUserReciept extends mongoose.Document {
    _id: string;
    id: string;

    SubmitSevaBooking: boolean;
    name: string;
    goutram: string;
    bookingdata: any;
    total_amount: number;
    booking_date: Date;
    order_id: string;
    transaction_id: string;
    is_verified: boolean;
    mobileNumber: number;


    __ref: string;
    createdAt: Date;
    updatedAt: Date;
}

export var IUserRecieptSchema = new mongoose.Schema({

    SubmitSevaBooking: { type: Boolean },
    name: { type: String },
    goutram: { type: String },
    bookingdata: { type: [Object] },
    total_amount: { type: Number },
    booking_date: { type: Date },
    order_id: { type: String },
    transaction_id: { type: String },
    is_verified: { type: Boolean },
    mobileNumber: { type: Number },

    // db defaults
    _id: { type: String, default: RandomNumberGenerator.getUniqueId },
    __ref: { type: String, index: true },
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true
});

IUserRecieptSchema.pre('save', function (next) {
    const now = new Date();
    const document = <IUserReciept>this;
    if (!document._id) {
        document.id = document._id = RandomNumberGenerator.getUniqueId();
    }
    document.updatedAt = now;
    if (!document.createdAt) {
        document.createdAt = now;
    }
    next();
});

export let CollectionName = "UserReciept";
