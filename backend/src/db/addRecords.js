const {Vendor} = require('./../models/vendor');

const AddInvoice = (data) => {
    data.forEach(vendor => {
        Vendor.findOneAndUpdate(
            {vendorCode: vendor.vendorCode},
            {
                $push: {
                    invoice: {
                        $each: vendor.invoice
                    }
                }
            }
        ).then(doc => {
            console.log(`${vendor.vendorCode} Vendor Invoices Added...`);
        }).catch(err => {
            console.log(`Problem while adding ${vendor.vendorCode} Vendor Invoices. ` + err);
        });
    });
};

const AddVendor = (data) => {
    data.forEach(vendor => {
        let newVendor = new Vendor(vendor);
            newVendor.save().then(doc => {
            console.log(`${vendor.vendorCode} Vendor added...`);
        }).catch(err => {
            console.log(`Problem while adding ${vendor.vendorCode} Vendor. ` + err);
        });
    });
};

module.exports = {AddInvoice, AddVendor};