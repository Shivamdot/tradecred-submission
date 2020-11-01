import React from  "react";

import "./Nav.css";
import LogoImg from "./../../images/logo.png";

const nav = (props) => (
    <section className="nav">
        <div className="item logo" onClick={props.clicked}>
            <img src={LogoImg} alt=""/>
        </div>
        <div className="item right sm">
            <a href="https://twitter.com/infectedNode" target="_blank">twitter <i className="fas fa-external-link-alt"></i></a>
        </div>
        <div className="item right sm">
        <a href="https://www.linkedin.com/in/infectednode/" target="_blank">linkedin <i className="fas fa-external-link-alt"></i></a>
        </div>
        <div className="item right">
            <a href="https://github.com/Shivamdot" target="_blank">github <i className="fas fa-external-link-alt"></i></a>
        </div>
        <div className="item right sm">
            <p>@shivam231198@gmail.com</p>
        </div>
    </section>
);

export default nav;