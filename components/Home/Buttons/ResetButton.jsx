import React from "react";
import Image from "next/image";
import classes from "./ResetButton.module.scss";
// REDUX
import {useDispatch} from 'react-redux';
import {ResetAll} from '@/Redux/Reducers/HomeReducer';

function ResetButton({roleValue}) {

    // Redux
    const dispatch = useDispatch();

    // Event Click handler
    function handleClick() {
        dispatch(ResetAll(roleValue));
    }

    return (
        <button className={classes.Create} onClick={handleClick}>
            إفراغ
            <Image
                src={"/Icons/ResetIcon.svg"}
                width={20}
                height={20}
                alt={"Reset icon"}
            />
        </button>
    );
}

export default ResetButton;
