import React from "react";
import classes from "./Spinner.module.scss";

function Spinner({ width }) {
    return <div className={classes.Spinner} style={{ width, height: width }}></div>;
}

export default Spinner;
