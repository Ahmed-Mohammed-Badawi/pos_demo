import React from "react";
import classes from './Buttons.module.scss';
//Imports
import CreateButton from "./CreateButton";
import ResetButton from "./ResetButton";
import PayButton from "@/components/Home/Buttons/PayButton";

function Buttons({roleValue}) {
    return (
        <section className={classes.Buttons}>
            {roleValue === 'cashier' && <PayButton roleValue={roleValue} />}
            {roleValue === 'callcenter' && <CreateButton />}
            <ResetButton roleValue={roleValue} />
        </section>
    );
}

export default Buttons;
