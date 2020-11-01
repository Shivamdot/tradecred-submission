const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const xlsx = require('xlsx');

const {mongoose} = require('./db/mongoose');
const {validate} = require('./validation/validation');
const {Vendor} = require('./models/vendor');

let app = express();

// Setting up public folder
app.use(express.static('public'));
// app.use(express.static(__dirname + './../public'));

// Adding necessary Headers to handle Client side requests
app.use(cors());

// Middleware to process JSON data
app.use(bodyParser.json());

// Middleware to handle file data
app.use(fileUpload());

app.get('/', (req, res) => {
    res.status(200).send('<p>TradeCred Hiring Challenge | by: Shivam Sharma</p><p>API Routes:</p><p>@GET  /database  :  To get current database state for testing</p><p>@POST  /upload  :  upload excel files</p>');
});

app.get('/database', (req, res) => {
    Vendor.find().then(data => {
        res.status(200).json({ msg: "success", data});
    }).catch(err => {
        res.status(400).json({msg: "error", err});
    });
});

app.post('/upload', (req, res) => {
    if (req.files === null) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
  
    const file = req.files.file;
    
    if(!(file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.mimetype == "text/csv" || file.mimetype == "application/vnd.ms-excel")) {
        return res.status(400).json({msg: "error", err: "PLease provide an excell file!"});
    }
    
    file.mv(`./uploads/${file.name}`, err => {
        if (err) {
            console.error(err);
            return res.status(500).json({msg: "error", err});
        }
        let wb = xlsx.readFile(`./uploads/${file.name}`, {cellDates: true});
        let ws = wb.Sheets[wb.SheetNames[0]];
        let data = xlsx.utils.sheet_to_json(ws);

        //validating the data
        validate(data).then((invalid) => {
            if(invalid.length > 0) {
                res.status(200).json({ msg: "success", fileName: file.name , invalid_rec: invalid});
            } else {
                res.status(200).json({ msg: "success", fileName: file.name});
            }
        }).catch(err => {
            res.status(400).json({msg: "error", err});
        });    
    });
});

const port = process.env.PORT || 2000;

app.listen(port, () => {
    console.log(`Server started successfully on port ${port}`);
})