const {Vendor} = require('./../models/vendor');

const {AddInvoice, AddVendor} = require('./../db/addRecords');

const validate = (data) => {
    let invalidData = [];
    let validData = [];
    let vendorList = [];
    let currDate = new Date().toISOString();
    return new Promise((resolve, reject) => {
        data.forEach(row => {
            if(row['Invoice Numbers'] && row['Document Number'] && row['Type'] && row['Net due dt'] && row['Doc. Date'] && row['Pstng Date'] && row['Amt in loc.cur.'] && row['Vendor Code'] && row['Vendor name'] && row['Vendor type']) {
                let isValid=1;
                //Checking for future date
                if(row['Doc. Date'] > currDate) {
                    isValid=0;
                }
                //Checking for negative amount
                // if(row['Amt in loc.cur.'] < 0) {
                //     isValid=0;
                // }
                if(isValid) {
                    // Checking Duplicate Invoices in input data
                    let vc = row['Vendor Code'];
                    let vcFound = -1;
                    for(let x in validData) {
                        if(validData[x].vendorCode == vc) {
                            vcFound = x;
                            break;
                        }
                    }
                    if(vcFound == -1) {
                        let  newVendor = {
                            vendorCode: row['Vendor Code'],
                            vendorName: row['Vendor name'],
                            vendorType: row['Vendor type'],
                            invoice: [{
                                invoiceNumber: row['Invoice Numbers'],
                                docNumber: row['Document Number'],
                                type: row['Type'],
                                dueDate: row['Net due dt'],
                                docDate: row['Doc. Date'],
                                postDate: row['Pstng Date'],
                                amt: row['Amt in loc.cur.']
                            }]
                        }
                        vendorList.push(row['Vendor Code']);
                        validData.push(newVendor);
                    } else {
                        let invoices = validData[vcFound].invoice;
                        let inv = row['Invoice Numbers'];
                        let invFound = -1;
                        for(let y in invoices) {
                            if(invoices[y].invoiceNumber == inv) {
                                invFound = y;
                                break;
                            }
                        }
                        if(invFound == -1) {
                            let newInvoice = {
                                invoiceNumber: row['Invoice Numbers'],
                                docNumber: row['Document Number'],
                                type: row['Type'],
                                dueDate: row['Net due dt'],
                                docDate: row['Doc. Date'],
                                postDate: row['Pstng Date'],
                                amt: row['Amt in loc.cur.']
                            }
                            validData[vcFound].invoice.push(newInvoice);
                        } else {
                            invalidData.push(row);
                        }
                    }
                } else {
                    invalidData.push(row);
                }
            } else {
                invalidData.push(row);
            }
        });

        // Checking Duplicate Invoices in database and updating the database

        Vendor.find({
            vendorCode: {$in: vendorList}
        }).then(res => {
            let newVendor = [];
            let newInvoice = [];
            validData.forEach(vdata => {
                let vdataFound = -1;
                for(let z in res) {
                    if(res[z].vendorCode == vdata.vendorCode) {
                        vdataFound = z;
                        break;
                    }
                }
                if(vdataFound == -1) {
                    // New Vendor
                    newVendor.push(vdata);
                } else {
                    // Vendor already Exists
                    let tempVendor = {
                        vendorCode: vdata.vendorCode,
                        vendorName: vdata,
                        vendorType: vdata,
                        invoice: []
                    }                    
                    vdata.invoice.forEach(vinv => {
                        let vinvoiceFound = -1;
                        for(let a in res[vdataFound].invoice) {
                            if(res[vdataFound].invoice[a].invoiceNumber == vinv.invoiceNumber) {
                                vinvoiceFound = a;
                                break;
                            }
                        }
                        if(vinvoiceFound == -1) {
                            tempVendor.invoice.push(vinv);
                        } else {  
                            // Invoice number already exits
                            invalidData.push({
                                'Invoice Numbers': vinv.invoiceNumber,
                                'Document Number': vinv.docNumber,
                                'Type': vinv.type,
                                'Net due dt': vinv.dueDate,
                                'Doc. Date': vinv.docDate,
                                'Pstng Date': vinv.postDate,
                                'Amt in loc.cur.': vinv.amt,
                                'Vendor Code': vdata.vendorCode,
                                'Vendor name': vdata.vendorName,
                                'Vendor type': vdata.vendorType
                            });
                        }
                    });
                    if(tempVendor.invoice.length > 0) {
                        newInvoice.push(tempVendor);
                    }
                    // splice vendor from res after use
                    res.splice(vdataFound, 1);
                }
            });

            //Update Data to add new Vendors
            AddVendor(newVendor);
            //Update Data to add new Invoice in the existing Vendors
            AddInvoice(newInvoice);

            resolve(invalidData);
        }).catch(err => {
            reject(err);
        });
    });
}

module.exports = {validate};