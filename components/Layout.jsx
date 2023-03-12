import React, { useEffect } from "react";
import classes from "./Layout.module.scss";
// Imports
import Navbar from "@/components/Admin/layout/Navbar/Navbar";
import Aside from "@/components/Admin/layout/Aside/Aside";
import Overlay from "./Admin/layout/Overlay/Overlay";
import DeleteBox from "./Admin/layout/DeleteBox/DeleteBox";

// Redux
import { useSelector } from "react-redux";
// Notifications
import { toast } from "react-toastify";

function Layout(props) {
    // Redux
    const { deleteMessage, deleteStatus } = useSelector(
        (state) => state.deleteAll
    );

    // Effect
    useEffect(() => {
        if (deleteMessage !== "" && deleteStatus === "success") {
            toast.success(deleteMessage);
        } else if (deleteMessage !== "" && deleteStatus === "error") {
            toast.error(deleteMessage);
        }
    }, [deleteMessage, deleteStatus]);

    if (props.path.includes("admin")) {
        return (
            <div className='Container-dashboard'>
                <div className={classes.All}>
                    {/* Navbar */}
                    <Navbar />
                    {/* Content Container */}
                    <div className={classes.Flex}>
                        {/* ASIDE */}
                        <Aside />
                        {/* Content */}
                        <div className={classes.Content}>
                            {props.children}
                            <Overlay>
                                <DeleteBox />
                            </Overlay>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return <>{props.children}</>;
    }
}

export default Layout;
