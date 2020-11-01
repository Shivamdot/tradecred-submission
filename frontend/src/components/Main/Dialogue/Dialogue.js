import React from  "react";

import "./Dialogue.css";

const dialogue = (props) => (
    <section className="dialogue">
        <h5 className="name"><span className="bold">File <span className="clr">:</span></span> {props.fileName}</h5>
        <div className="data-blk">
            <p className="count">{props.totalInvoices}</p>
            <p className="descp">total number of invoices</p>
        </div>
        <div className="data-blk">
            <p className="count">{props.totalAmount}</p>
            <p className="descp">total sum of invoice amounts</p>
        </div>
        <div className="data-blk">
            <p className="count">{props.totalVendors}</p>
            <p className="descp">total number of vendors</p>
        </div>
        <div className="data-blk">
            {props.totalInvalid === 0 ? <p className="count">{props.totalInvalid}</p> : <p className="count red">{props.totalInvalid}</p>}
            <p className="descp">total number of invalid invoices</p>
        </div>
        <input
            type='file'
            className='input-file'
            id='file'
            onChange={props.update}
        />
        <label htmlFor="file">NEW UPLOAD</label>
        <div className="confirm" onClick={props.confirm}>
            <p>CONFIRM & UPLOAD</p>
        </div>

    </section>
);

export default dialogue;