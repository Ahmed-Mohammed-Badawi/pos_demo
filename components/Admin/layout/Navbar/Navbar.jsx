import React, { useState, useEffect } from "react";
import classes from "./Navbar.module.scss";
import Image from "next/image";
import Link from "next/link";
// Imports
import LogoutIcon from "@/components/SVGS/LogoutIcon";
// Redux
import { useDispatch } from "react-redux";
import { toggleAsideSize } from "@/Redux/Reducers/DashboardReducer";
// Axios
import axios from "axios";
// Notifications
import { toast } from "react-toastify";

function Navbar() {
    // REDUX
    const dispatch = useDispatch();

    // States
    const [showList, setShowList] = useState(false);
    const [user, setUser] = useState(null);

    // Function to change the show list state
    function showListHandler() {
        setShowList(!showList);
    }

    // Function to toggle Aside size
    function toggleAsideSizeHandler() {
        dispatch(toggleAsideSize());
    }

    // LOGOUT HANDLER
    function logoutHandler() {
        // Clear the local storage
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("login_id");
        localStorage.removeItem("user_name");
        localStorage.removeItem("branch_id");
        localStorage.removeItem('cashbox_id')
        localStorage.removeItem(`branch_name`);

        // Remove Cookies (role && authenticated)
        document.cookie =
            "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
            "authenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // Reload the page
        window.location.reload();
    }

    // Get the user Details when page loads
    useEffect(() => {
        // get the login_id && role from local storage
        const login_id = localStorage.getItem("login_id");
        const role = localStorage.getItem("role");

        if (role === "admin") {
            // send the request to the back
            axios
                .get(
                    `https://posapi.kportals.net/api/v1/get/user?userId=${login_id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                )
                .then((res) => {
                    setUser(res.data.user);
                })
                .catch((err) => {
                    toast.error(err.response.data.message || err.message);
                });
        }
    }, []);

    return (
        <nav className={classes.Navbar}>
            <div
                className={classes.Menu}
                onClick={toggleAsideSizeHandler}
                style={{ cursor: "pointer" }}
            >
                <Image
                    src={"/Icons/Menu.svg"}
                    width={25}
                    height={25}
                    alt={"Menu Icon"}
                />
            </div>
            <div className={classes.Admin}>
                <h2 className={classes.Admin_Name}>
                    {!user ? "" : user.fullName}
                </h2>
                <div className={classes.Admin_Image}>
                    <div
                        onClick={showListHandler}
                        className={classes.Image_Container}
                    >
                        <Image
                            src={"/Avatar.png"}
                            width={50}
                            height={50}
                            alt={"Admin"}
                        />
                    </div>
                    <ul
                        className={[
                            classes.List,
                            showList && classes.Show,
                        ].join(" ")}
                    >
                        <li
                            className={classes.List_Item}
                            onClick={logoutHandler}
                        >
                            <Link href={"/"} onClick={logoutHandler}>
                                <LogoutIcon /> تسجيل الخروج
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
