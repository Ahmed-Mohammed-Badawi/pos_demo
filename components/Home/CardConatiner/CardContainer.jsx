import React from "react";
import classes from "./CardContainer.module.scss";
import Card from "./Card/Card";

// Redux
import { useSelector } from "react-redux";

function CardContainer() {
    // Redux States
    const { ItemsPreview } = useSelector((state) => state.home);

    return (
        <section className={classes.Container}>
            {ItemsPreview.map((item, i) => {
                return (
                    <Card
                        key={item._id}
                        id={item._id}
                        name={item.itemTitle}
                        price={item.itemPrice}
                        url={item.itemImage}
                        unitId={item.unitId._id}
                        unitValue={item.unitId.unitValue}
                    />
                );
            })}
        </section>
    );
}

export default CardContainer;
