import mongoose = require("mongoose");
import { RandomNumberGenerator } from "@skillmine-dev-public/random-id-generator-util";

export interface ISubSevas extends mongoose.Document {
    _id: string;
    id: string;

    sevaName: string;
    sevaId: number;
    price: number;
    duration: string;
    description: string;
    parentSevaRef: string;
    parentSevaName: string;
    isSpecialParentSeva: boolean;
    slot: string;
    isSpecialSevaAvailable: boolean;
    specialSevaTicketsCount: number;
    specialSevaAvailableCount: number;
    spcialSevaDate: Date;
    specialSevaDay: string;


    __ref: string;
    createdAt: Date;
    updatedAt: Date;
}

export var ISubSevaSchema = new mongoose.Schema({

    sevaName: { type: String },
    sevaId: { type: Number },
    price: { type: Number },
    duration: { type: String },
    description: { type: String },
    parentSevaRef: { type: String },
    parentSevaName: { type: String },
    isSpecialParentSeva: { type: Boolean },
    slot: { type: String },
    isSpecialSevaAvailable: { type: Boolean },
    specialSevaTicketsCount: { type: Number },
    specialSevaAvailableCount: { type: Number },
    spcialSevaDate: { type: Date },
    specialSevaDay: { type: String },
    // db defaults
    _id: { type: String, default: RandomNumberGenerator.getUniqueId },
    __ref: { type: String, index: true },
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true
});

ISubSevaSchema.pre('save', function (next) {
    const now = new Date();
    const document = <ISubSevas>this;
    if (!document._id) {
        document.id = document._id = RandomNumberGenerator.getUniqueId();
    }
    document.updatedAt = now;
    if (!document.createdAt) {
        document.createdAt = now;
    }
    next();
});

export let CollectionName = "SubSevas";
