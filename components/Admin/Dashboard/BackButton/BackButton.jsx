import React from "react";
import classes from "./BackButton.module.scss";

function BackButton({ click }) {
    return <button onClick={click} className={classes.Back}>رجوع</button>;
}

export default BackButton;
