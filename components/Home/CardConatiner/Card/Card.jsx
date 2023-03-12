import React, { useState, useEffect } from "react";
import Image from "next/image";
import classes from "./Card.module.scss";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { AddItem } from "@/Redux/Reducers/HomeReducer";

function Card({ id, name, price, category, url, unitId, unitValue }) {
    // State
    const [selected, setSelected] = useState(false);

    // Redux
    const dispatch = useDispatch();
    const { Items } = useSelector((state) => state.home);

    // Check if the Item is Selected
    function checkIfSelected() {
        if (Items.find((item) => item.name === name)) {
            setSelected(true);
        } else {
            setSelected(false);
        }
    }

    // Selected Handler
    function onCardClickedHandler() {
        // Add the Item
        dispatch(
            AddItem({
                id,
                name,
                price,
                quantity: 1,
                category,
                unitId,
                unitValue
            })
        );
    }

    useEffect(() => {
        checkIfSelected();
    }, [Items]);

    return (
        <>
            <article
                className={[classes.Card, selected && classes.Selected].join(
                    " "
                )}
                onClick={onCardClickedHandler}
            >
                <div className={classes.Image_Container}>
                    <Image
                        className={classes.Image}
                        width={220}
                        height={180}
                        src={url || '/Images/Image_notfound.png'}
                        alt={name}
                    />
                </div>
                <span className={classes.Price}>{Number(price).toFixed(3)} KWD</span>
                <div className={classes.Content}>
                    <h3>{name}</h3>
                    <p>{category}</p>
                </div>
            </article>
        </>
    );
}

export default Card;
