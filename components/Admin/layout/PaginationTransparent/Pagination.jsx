import React from "react";
import classes from "./Pagination.module.scss";
import Image from "next/image";

function Pagination({ prevClick, nextClick }) {
    return (
        <section className={classes.Pagination}>
            <button className={classes.Button_2} onClick={prevClick}>
                <Image
                    src={"/Icons/pagination/Left.svg"}
                    width={28}
                    height={28}
                    alt={"Arrow Icon"}
                />
            </button>
            <button className={classes.Button_4} onClick={nextClick}>
                <Image
                    src={"/Icons/pagination/Right.svg"}
                    width={28}
                    height={28}
                    alt={"Arrow Icon"}
                />
            </button>
        </section>
    );
}

export default Pagination;
