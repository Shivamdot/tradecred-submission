import React from  "react";

import "./Message.css";

const message = (props) => {

    if(props.message) {
        
        let msgStyle = {}
        if(props.messageCode === 1) {
            msgStyle = {
                backgroundColor: "#4afd86"
            }
        }

        return (
            <section className="message" style={msgStyle}>
                <p>{props.message}</p>
            </section>
        )
    } else {
        return null;
    }
    
};

export default message;