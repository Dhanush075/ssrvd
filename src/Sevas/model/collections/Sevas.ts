import mongoose = require("mongoose");
import { RandomNumberGenerator } from "@skillmine-dev-public/random-id-generator-util";

export interface ISevas extends mongoose.Document {
    _id: string;
    id: string;

    sevaName: string;
    sevaId: number;
    isSpecialSeva: boolean;

    __ref: string;
    createdAt: Date;
    updatedAt: Date;
}

export var ISevaSchema = new mongoose.Schema({

    sevaName: { type: String },
    sevaId: { type: Number },
    isSpecialSeva: { type: Boolean },

    // db defaults
    _id: { type: String, default: RandomNumberGenerator.getUniqueId },
    __ref: { type: String, index: true },
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true
});

ISevaSchema.pre('save', function (next) {
    const now = new Date();
    const document = <ISevas>this;
    if (!document._id) {
        document.id = document._id = RandomNumberGenerator.getUniqueId();
    }
    document.updatedAt = now;
    if (!document.createdAt) {
        document.createdAt = now;
    }
    next();
});

export let CollectionName = "Sevas";
