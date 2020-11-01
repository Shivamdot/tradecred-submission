import React from  "react";

import "./RightSection.css";

import UploadBG from "./../../../images/uploadBG.png";
import DialogueBG from "./../../../images/dialogueBG.png";

const rightSection = (props) => (
    <div className="blk">
        {(props.mode >= 0) ? <img src={DialogueBG} alt="" /> : <img src={UploadBG} alt="" />}
    </div>
);

export default rightSection;