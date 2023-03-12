import React from "react";
import classes from "./DashboardCard.module.scss";

function DashboardCard({ children, background, background2, value, title }) {
    return (
        <article className={classes.Card} style={{ background: background }}>
            <div className={classes.Container}>
                <div className={classes.Content}>
                    <h2>KWD {value}</h2>
                    <h3>{title}</h3>
                </div>
                <div
                    className={classes.Icon_Container}
                    style={{ background: background2 }}
                >
                    <div className={classes.Icon}>{children}</div>
                </div>
            </div>
        </article>
    );
}

export default DashboardCard;
