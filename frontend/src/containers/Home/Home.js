import React, { Component } from 'react';
import {ExcelRenderer} from "react-excel-renderer";
import axios from 'axios';

// Components
import Nav from "./../../components/Nav/Nav";
import Upload from "./../../components/Main/Upload/Upload";
import Dialogue from "./../../components/Main/Dialogue/Dialogue";
import RightSection from "./../../components/Main/RightSection/RightSection";
import Loading from "./../../components/Main/Loading/Loading";
import Message from "./../../components/Message/Message";

// CSS files
import './Home.css';

class Home extends Component {

    state = {
        fileData: [],
        file: '',
        fileName: '',
        totalInvoices: 0,
        totalAmount: 0,
        totalVendors: 0,
        totalInvalid: 0,
        fileInHand : -1,
        msgCode: 0,
        msg: ''
    }

    // Validating the File data
    validateData = () => {
        let validData = [];
        let data = [...this.state.fileData];
        let totalInvoices = data.length;
        let currDate = new Date();
        let totalAmount = 0;
        let totalInvalid = 0;
        let vendors = [];

        data.forEach(rec => {
            let isValid = true;
            if(rec[0] && rec[4] && rec[6] && rec[7]) {
                for(let x in validData) {
                    if(validData[x][0] === rec[0] && validData[x][7] === rec[7]){
                        isValid = false;
                    }
                }
                let docDate = new Date((rec[4] - (25569)) * 86400 * 1000);
                if(docDate > currDate) {
                    isValid = false;
                }
                totalAmount += rec[6];
                let vendorFound = false;
                for(let v in vendors) {
                    if(vendors[v] === rec[7]){
                        vendorFound = true;
                        break;
                    }
                }
                if(!vendorFound) {
                    vendors.push(rec[7]);
                }
            } else {
                isValid = false;
            }
            if(isValid) {
                validData.push(rec);
            } else {
                totalInvalid += 1;                
            }
        });

        //Updating State
        let totalVendors = vendors.length;
        let fileInHand = 1;
        this.setState({totalInvoices, totalAmount, totalVendors, totalInvalid, fileInHand});
    }

    
    // Making Post request to the server
    uploadData = () => {
        this.setState({fileInHand : 0});

        const formData = new FormData();
        formData.append('file', this.state.file);

        const URL = "https://tradecred.herokuapp.com";
        // const URL = "http://localhost:2000";
        
        axios.post(`${URL}/upload`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            console.log(res);
            if(res.data.msg === 'error') {
                let msgCode = 0;
                let msg = "server error!";
                this.setState({msg, msgCode, fileInHand : 1});
                setTimeout(() => this.setState({msg: ""}), 5000);
            }
            let msgCode = 1;
            let msg = "file uploaded successfully!";
            this.setState({msg, msgCode, fileInHand : -1});
            setTimeout(() => this.setState({msg: ""}), 5000);
        }).catch(err => {
            let msgCode = 0;
            let msg = "error in uploading file!";
            this.setState({msg, msgCode, fileInHand : 1});
            setTimeout(() => this.setState({msg: ""}), 5000);
        })  
    }

    // Updating State when new File Selected
    onUpdate = (e) => {
        if(e.target.files[0].type === "application/vnd.ms-excel" || e.target.files[0].type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            let file = e.target.files[0];
            let fileName = e.target.files[0].name
            ExcelRenderer(file, (err, res) => {
                if(err) {
                    console.log("not able to read the file...");
                } else {
                    let fileData = res.rows;
                    if(fileData[0][0] === "Invoice Numbers" && fileData[0][4] === "Doc. Date" && fileData[0][6] === "Amt in loc.cur." && fileData[0][7] === "Vendor Code") {
                        fileData.splice(0,1);
                        let fileInHand = 0;
                        this.setState({fileData, file, fileName, fileInHand});
                        this.validateData();
                    } else {
                        let msgCode = 0;
                        let msg = "Invalid data format!";
                        this.setState({msg, msgCode});
                        setTimeout(() => this.setState({msg: ""}), 5000);
                    }
                }
            });
        } else {
            let msgCode = 0;
            let msg = "Please upload an Excel file!";
            this.setState({msg, msgCode});
            setTimeout(() => this.setState({msg: ""}), 5000);
        }
    }

    goToHomePageHandler = () => {
        let file = '';
        let fileInHand = -1;
        this.setState({file, fileInHand});
    }

    render () {

        let leftSection = null;
        
        if(this.state.fileInHand === -1) {
            leftSection = <Upload update={this.onUpdate}/>;
        } else if(this.state.fileInHand === 0){
            leftSection = <Loading />;
        } else if(this.state.fileInHand === 1) {
            leftSection = <Dialogue 
                update={this.onUpdate}
                fileName={this.state.fileName}
                totalInvoices={this.state.totalInvoices}
                totalAmount={this.state.totalAmount}
                totalVendors={this.state.totalVendors}
                totalInvalid={this.state.totalInvalid}
                confirm={this.uploadData}
            />;
        }

        return (
            <div>
                <Nav clicked={this.goToHomePageHandler}/>
                <section className="main">
                    <Message message={this.state.msg} messageCode={this.state.msgCode}/>
                    {leftSection}
                    <RightSection mode={this.state.fileInHand}/>
                </section>
            </div>
        );
    }
}

export default Home;