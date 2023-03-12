import React from "react";
import classes from "./Pagination.module.scss";
import Image from "next/image";

function Pagination({ currentPage, pagePlus, pageMinus, lastPage }) {
    return (
        <section className={classes.Pagination}>
            <button
                disabled={currentPage <= 1}
                className={[
                    classes.Button_2,
                    currentPage <= 1 ? classes.Disable : "",
                ].join(" ")}
                onClick={pageMinus}
            >
                <Image
                    src={"/Icons/pagination/Left.svg"}
                    width={30}
                    height={30}
                    alt={"Arrow Icon"}
                />
            </button>
            <button className={classes.Button_3}>{currentPage || "1"}</button>
            <button
                disabled={currentPage >= lastPage}
                className={[
                    classes.Button_4,
                    currentPage >= lastPage ? classes.Disable : "",
                ].join(" ")}
                onClick={pagePlus}
            >
                <Image
                    src={"/Icons/pagination/Right.svg"}
                    width={30}
                    height={30}
                    alt={"Arrow Icon"}
                />
            </button>
        </section>
    );
}

export default Pagination;
