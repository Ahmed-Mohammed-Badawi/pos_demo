import React from "react";
import classes from "./Overlay.module.scss";
// Redux
import { useSelector, useDispatch } from "react-redux";
import { cancel_delete } from "@/Redux/Reducers/Delete_all__Reducer";

function Overlay({ children }) {
    // Redux
    const dispatch = useDispatch();
    const { overlay } = useSelector((state) => state.deleteAll);

    return (
        <div
            onClick={(e) => {
                // check that the target of click is not the overlay children
                if (e.target.className.includes(classes.Overlay)) {
                    dispatch(cancel_delete());
                }
            }}
            className={[classes.Overlay, overlay ? classes.Show : ""].join(" ")}
        >
            {children}
        </div>
    );
}

export default Overlay;
