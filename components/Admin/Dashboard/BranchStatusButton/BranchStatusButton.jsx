import React from "react";
import classes from "./BranchStatusButton.module.scss";

function BranchStatusButton({ status, click }) {
    return (
        <button
            onClick={click}
            className={[
                classes.B_Button,
                status === "Active" ? classes.Active : classes.UnActive,
            ].join(" ")}
        >
            {status === "Active" ? "ايقاف" : "تفعيل"}
        </button>
    );
}

export default BranchStatusButton;
