import React from  "react";

import "./Loading.css";
import LoadingImg from "./../../../images/loader.png";

const loading = (props) => (
    <section className="loading">
        <div className="loading-blk">
            <img src={LoadingImg} alt="" />
        </div>
    </section>
);

export default loading;