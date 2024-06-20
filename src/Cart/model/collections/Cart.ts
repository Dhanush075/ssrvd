import mongoose = require("mongoose");
import { RandomNumberGenerator } from "@skillmine-dev-public/random-id-generator-util";

export interface ICart extends mongoose.Document {
    _id: string;
    id: string;

    seva: any;

    __ref: string;
    createdAt: Date;
    updatedAt: Date;
}

export var ICartSchema = new mongoose.Schema({

    seva: { type: Object },
  
    // db defaults
    _id: { type: String, default: RandomNumberGenerator.getUniqueId },
    __ref: { type: String, index: true },
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true
});

ICartSchema.pre('save', function (next) {
    const now = new Date();
    const document = <ICart>this;
    if (!document._id) {
        document.id = document._id = RandomNumberGenerator.getUniqueId();
    }
    document.updatedAt = now;
    if (!document.createdAt) {
        document.createdAt = now;
    }
    next();
});

export let CollectionName = "Cart";
