import mongoose = require("mongoose");
import { RandomNumberGenerator } from "@skillmine-dev-public/random-id-generator-util";

export interface IPaymentGateway extends mongoose.Document {
    _id: string;
    id: string;

    order_ref: string;
    entity: string;

    amount: number;
    amount_paid: number;
    amount_due: number;
    public_note: string;
    currency: string;
    receipt: string;
    name: string;
    mobile: number;

    order_id: string;
    status: string;

    attempts: number;
    notes: any;

    verifiction_status: string;
    is_verified: boolean;
    transaction_id: string;
    transaction_payment_id: string;
    transaction_signature: string;
    verified_message: string;
    razorypay_sig_received: string;
    razorypay_sig_generated: string;
    razorpay_signature: string;
    razorpay_payment_id: string;
    razorpay_order_id: string;
    checksum: string;
    request_data: any;


    __ref: string;
    createdAt: Date;
    updatedAt: Date;
}

export var IPaymentGatewayScheme = new mongoose.Schema({
    order_ref: { type: String },
    entity: { type: String },

    amount: { type: Number },
    amount_paid: { type: Number },
    amount_due: { type: Number },
    public_note: { type: String },
    currency: { type: String },
    receipt: { type: String },
    name: { type: String },
    mobile: { type: Number },

    order_id: { type: String },
    status: { type: String },
    entity_id: { type: String },
    settlement_id: { type: String },

    attempts: { type: Number },
    notes: { type: Object },

    verifiction_status: { type: String },
    is_verified: { type: Boolean, default: false },
    transaction_id: { type: String },
    transaction_payment_id: { type: String },
    transaction_signature: { type: String },
    verified_message: { type: String },
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String },
    checkum: { type: String },
    request_data: { type: Object },

    razorypay_sig_received: { type: String },
    razorypay_sig_generated: { type: String },


    // db defaults
    _id: { type: String, default: RandomNumberGenerator.getUniqueId },
    __ref: { type: String, index: true },
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true
});

IPaymentGatewayScheme.pre('save', function (next) {
    const now = new Date();
    const document = <IPaymentGateway>this;
    if (!document._id) {
        document.id = document._id = RandomNumberGenerator.getUniqueId();
    }
    document.updatedAt = now;
    if (!document.createdAt) {
        document.createdAt = now;
    }
    next();
});

export let CollectionName = "PaymentGateway";