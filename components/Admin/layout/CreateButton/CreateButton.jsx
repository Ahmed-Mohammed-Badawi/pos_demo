import React from "react";
import classes from "./CreateButton.module.scss";

function CreateButton({ click }) {
    return <button onClick={click} className={classes.Create}>إنشاء</button>;
}

export default CreateButton;
