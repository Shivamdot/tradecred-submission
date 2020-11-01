const mongoose = require('mongoose');

VendorSchema = new mongoose.Schema({
    
    vendorCode: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    vendorName: {
        type: String,
        required: true,
        trim: true,
    },
    vendorType: {
        type: String,
        required: true,
        trim: true,
    },
    invoice: [{
        invoiceNumber: {
            type: Number,
            trim: true,
            unique: true,
            required: true
        },
        docNumber: {
            type: Number,
            trim: true,
            required: true
        },
        type: {
            type: String,
            trim: true,
            required: true
        },
        dueDate: {
            type: Date,
            required: true
        },
        docDate: {
            type: Date,
            required: true
        },
        postDate: {
            type: Date,
            required: true
        },
        amt: {
            type: Number,
            trim: true,
            required: true
        }
    }]
});

var Vendor = mongoose.model('Vendor', VendorSchema);

module.exports = {Vendor};