import React from "react";
import classes from "./SwiperButton.module.scss";

function SwiperButton({ text, clicked, activeCategory }) {
    return (
        <button
            onClick={(e) => {
                console.log(e.target.innerText)
                clicked(e)
            }}
            className={[
                classes.SwiperButton,
                activeCategory === text ? classes.Active : '',
            ].join(" ")}
        >
            {text}
        </button>
    );
}

export default SwiperButton;
