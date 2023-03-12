import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
//Styles
import classes from "./HomeNavbar.module.scss";
import classes2 from "@/styles/branch_delivery.module.scss";
//Imports
import LogoutIcon from "@/components/SVGS/LogoutIcon";
import Search_home_input from "@/components/Home/SearchHomeInput/Search_home_input";

function HomeNavbar({ roleValue, resetTheLastPage }) {
    //States
    const [username, setUsername] = useState("اسم المستخدم");

    // LOGOUT HANDLER
    function logoutHandler() {
        // Clear the local storage
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("login_id");
        localStorage.removeItem("user_name");
        localStorage.removeItem("branch_id");
        localStorage.removeItem("cashbox_id");
        localStorage.removeItem(`branch_name`);
        // Remove Cookies (role && authenticated)
        document.cookie =
            "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
            "authenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // Reload the page
        window.location.reload();
    }

    // Effect to get the username
    useEffect(() => {
        const name = localStorage.getItem("user_name");
        setUsername(name);
    }, []);

    return (
        <nav className={classes.Navbar}>
            <div className={classes.User}>
                <div className={classes.Image_Container}>
                    <Image
                        src={"/Avatar.png"}
                        width={100}
                        height={100}
                        alt={"User name"}
                    />
                </div>
                <h1>{username}</h1>
            </div>
            <div>
                <Search_home_input
                    roleValue={roleValue}
                    resetTheLastPage={resetTheLastPage}
                />
            </div>
            {roleValue === "cashier" && (
                <nav className={classes2.Navigation}>
                    <Link href={"/branch/"}>
                        <div
                            className={classes.Navigation_Item}
                            title='الأوردرات'
                        >
                            <Image
                                src={"/Icons/branch/orders.png"}
                                width={35}
                                height={35}
                                alt={"Orders Icon"}
                            />
                        </div>
                    </Link>
                    <Link href={"/branch/cashier"}>
                        <div
                            className={classes.Navigation_Item}
                            title='الكاشير'
                        >
                            <Image
                                src={"/Icons/branch/money.png"}
                                width={35}
                                height={35}
                                alt={"Orders Icon"}
                            />
                        </div>
                    </Link>
                    <Link href={"/callcenter"}>
                        <div
                            className={classes.Navigation_Item}
                            title='إنشاء أوردر'
                        >
                            <Image
                                src={"/Icons/branch/pos.png"}
                                width={35}
                                height={35}
                                alt={"pos Icon"}
                            />
                        </div>
                    </Link>
                    <Link href={"/branch/today_orders"}>
                        <div
                            className={classes.Navigation_Item}
                            title='أوردرات اليوم'
                        >
                            <Image
                                src={"/Icons/branch/coupon.png"}
                                width={35}
                                height={35}
                                alt={"pos Icon"}
                            />
                        </div>
                    </Link>
                </nav>
            )}
            <div
                title='تسجيل الخروج'
                onClick={logoutHandler}
                className={[
                    classes2.Navigation_Logout,
                    classes2.Pos_Version,
                ].join(" ")}
            >
                <LogoutIcon />
            </div>
        </nav>
    );
}

export default HomeNavbar;
