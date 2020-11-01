import React from  "react";

import "./Upload.css";

const upload = (props) => (
    <section className="upload">
        <h1>Welcome to <span className="clr">TradeCred</span> Hiring Challenge. Developed By Shivam.</h1>
        <p>To test this application please upload an excel file and make sure that the format of the file is in proper order.</p>
        <input
            type='file'
            className='input-file'
            id='file'
            onChange={props.update}
        />
        <label htmlFor="file">UPLOAD FILE</label>
    </section>
);

export default upload;