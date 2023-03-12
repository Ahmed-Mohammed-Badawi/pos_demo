import React from "react";
import classes from "./Item.module.scss";
import Image from "next/image";
// Redux
import { useDispatch } from "react-redux";
import {
    QuantityPlus,
    QuantitySubtract,
    QuantityChangedManually,
    DeleteItem,
} from "@/Redux/Reducers/HomeReducer";

function Item({ name, price, quantity, step }) {
    // Redux
    const dispatch = useDispatch();
    // Quantity plus handler
    function quantityPlusHandler() {
        dispatch(
            QuantityPlus({
                name,
                price: +price,
                quantity: +quantity,
                total: +quantity * +price,
            })
        );
    }

    // Quantity Subtract handler
    function quantitySubtractHandler() {
        dispatch(
            QuantitySubtract({
                name,
                price: +price,
                quantity: +quantity,
                total: +quantity * +price,
            })
        );
    }

    // When Quantity change manually
    function quantityChangedManuallyHandler(newQuantity) {
        dispatch(
            QuantityChangedManually({
                name,
                price: +price,
                quantity: +newQuantity,
                total: +quantity * +price,
            })
        );
    }

    // Delete item handler
    function deleteItemHandler() {
        dispatch(DeleteItem({ name }));
    }

    return (
        <article className={classes.Item}>
            <span className={classes.Span_1}>{name}</span>
            <span className={classes.Span_2}>
                <button onClick={quantityPlusHandler} className={classes.Add}>
                    +
                </button>
                <input
                    type='number'
                    value={+quantity}
                    className={classes.Input}
                    step={step}
                    onInput={(e) => {
                        if (+e.target.value >= parseFloat(step)) {
                            quantityChangedManuallyHandler(e.target.value);
                        } else {
                            quantityChangedManuallyHandler(step);
                        }
                    }}
                />
                <button
                    onClick={quantitySubtractHandler}
                    className={classes.remove}
                >
                    -
                </button>
            </span>
            <span className={classes.Span_3}>{Number(price).toFixed(3)}</span>
            <span className={classes.Span_4}>{(+quantity * +price).toFixed(3)}</span>
            <button
                className={classes.DeleteButton}
                onClick={deleteItemHandler}
            >
                <Image
                    src={"/Icons/Delete.svg"}
                    width={20}
                    height={20}
                    alt={"Icon"}
                />
            </button>
        </article>
    );
}

export default Item;
