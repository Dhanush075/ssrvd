import mongoose = require("mongoose");
import { RandomNumberGenerator } from "@skillmine-dev-public/random-id-generator-util";

export interface IUserReciept extends mongoose.Document {
    _id: string;
    id: string;

    subSevaName: string;
    subSevaref: string;
    price: number;
    duration: string;
    description: string;
    parentSevaRef: string;
    parentSevaName: string;
    numberOfTickets: number;
    slot: string;
    availableTickects: number;
    totalAmount: number;
    name: string;
    phoneNumber: number;



    __ref: string;
    createdAt: Date;
    updatedAt: Date;
}

export var IUserRecieptSchema = new mongoose.Schema({

    sevaName: { type: String },
    subSevaref: { type: String },
    price: { type: Number },
    duration: { type: String },
    description: { type: String },
    parentSevaRef: { type: String },
    parentSevaName: { type: String },
    numberOfTickets: { type: Number },
    slot: { type: String },
    availableTickects: { type: Number },
    totalAmount: { type: Number },
    name: { type: String },
    phoneNumber: { type: Number },

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
