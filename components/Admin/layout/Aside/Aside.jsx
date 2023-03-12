import React, {useState} from "react";
import Link from "next/link";
import classes from "./Aside.module.scss";
import {useRouter} from "next/router";
// Imports
import DashboardIcon from "@/components/SVGS/DashboardIcon";
import ProductsIcon from "@/components/SVGS/ProductsIcon";
import BranchesIcon from "@/components/SVGS/BranchesIcon";
import UsersIcon from "@/components/SVGS/UsersIcon";
import PaymentIcon from "@/components/SVGS/PaymentIcon";
import ReportsIcon from "@/components/SVGS/ReportsIcon";
import PermessionsIcon from "@/components/SVGS/PermessionsIcon";

// Redux
import {useSelector} from "react-redux";

function Aside() {
    // Router
    const router = useRouter();

    // Redux state
    const {AsideMini} = useSelector((state) => state.dashboard);

    // States
    const [lists, setLists] = useState({
        list1: false,
        list2: false,
        list3: false
    });

    //  Function to change the lists
    function listClickedHandler(listNumber) {
        const initislList = {
            list1: false,
            list2: false,
            list3: false
        };
        // Update the lists with the new
        if (listNumber) {
            initislList[listNumber] = !lists[listNumber];
        }

        // Set the new state
        setLists(initislList);
    }

    return (
        <aside className={[classes.Aside, AsideMini && classes.Mini].join(" ")}>
            <ul className={classes.List}>
                <li className={classes.List_Item}>
                    <p
                        className={
                            router.pathname == "/admin" ? classes.Active : ""
                        }
                        onClick={() => {
                            // Reset the lists
                            listClickedHandler();
                            // Redirect to the dashboard
                            router.push("/admin");
                        }}
                    >
                        <span className={classes.IconContainer}>
                            <DashboardIcon/>
                        </span>{" "}
                        <span className={classes.ItemText}>لوحة التحكم</span>
                    </p>
                </li>
                <li
                    className={classes.List_Item}
                    onClick={() => listClickedHandler("list1")}
                >
                    <p
                        className={
                            router.pathname.includes("/products")
                                ? classes.Active
                                : ""
                        }
                    >
                        <span className={classes.IconContainer}>
                            <ProductsIcon/>
                        </span>{" "}
                        <span className={classes.ItemText}>المنتجات</span>
                    </p>
                    <ul
                        className={[
                            classes.Secondary_List,
                            lists.list1 && classes.Show,
                        ].join(" ")}
                    >
                        <li className={classes.Secondary_List__Item}>
                            <Link
                                className={
                                    router.pathname == "/admin/products"
                                        ? classes.Active
                                        : ""
                                }
                                href={"/admin/products"}
                            >
                                الأقسام
                            </Link>
                        </li>
                        <li className={classes.Secondary_List__Item}>
                            <Link
                                className={
                                    router.pathname == "/admin/products/items"
                                        ? classes.Active
                                        : ""
                                }
                                href={"/admin/products/items"}
                            >
                                الأصناف
                            </Link>
                        </li>
                        <li className={classes.Secondary_List__Item}>
                            <Link
                                className={
                                    router.pathname == "/admin/products/units"
                                        ? classes.Active
                                        : ""
                                }
                                href={"/admin/products/units"}
                            >
                                الوحدات
                            </Link>
                        </li>
                    </ul>
                </li>
                <li className={classes.List_Item}>
                    <p
                        className={
                            router.pathname.includes("/branches")
                                ? classes.Active
                                : ""
                        }
                        onClick={() => {
                            // Reset the lists
                            listClickedHandler();
                            // Redirect to the branches
                            router.push("/admin/branches");
                        }}
                    >
                        <span className={classes.IconContainer}>
                            <BranchesIcon/>
                        </span>{" "}
                        <span className={classes.ItemText}>الفروع</span>
                    </p>{" "}
                </li>
                <li className={classes.List_Item}>
                    <p
                        className={
                            router.pathname.includes("/users")
                                ? classes.Active
                                : ""
                        }
                        onClick={() => {
                            // Reset the lists
                            listClickedHandler();
                            // Redirect to the users
                            router.push("/admin/users");
                        }}
                    >
                        <span
                            className={classes.IconContainer}
                            style={{width: "1.6rem"}}
                        >
                            <UsersIcon/>
                        </span>{" "}
                        <span className={classes.ItemText}>المستخدمين</span>
                    </p>
                </li>
                <li
                    className={classes.List_Item}
                    onClick={() => listClickedHandler("list4")}
                >
                    <p
                        className={
                            router.pathname.includes("/payment")
                                ? classes.Active
                                : ""
                        }
                        onClick={() => {
                            // Reset the lists
                            listClickedHandler();
                            // Redirect to the users
                            router.push("/admin/payment");
                        }}
                    >
                        <span
                            className={classes.IconContainer}
                            style={{width: "1.4rem", marginLeft: "2px"}}
                        >
                            <PaymentIcon/>
                        </span>
                        <span className={classes.ItemText}>وسائل الدفع</span>
                    </p>
                </li>
                <li
                    className={classes.List_Item}
                    onClick={() => listClickedHandler("list2")}
                >
                    <p
                        className={
                            router.pathname.includes("/settings")
                                ? classes.Active
                                : ""
                        }
                    >
                        <span
                            className={classes.IconContainer}
                            style={{width: "1.6rem"}}
                        >
                            <PermessionsIcon/>
                        </span>{" "}
                        <span className={classes.ItemText}>الإعدادات</span>
                    </p>{" "}
                    <ul
                        className={[
                            classes.Secondary_List,
                            lists.list2 && classes.Show,
                        ].join(" ")}
                    >
                        <li className={classes.Secondary_List__Item}>
                            <Link
                                className={
                                    router.pathname == "/admin/settings/tax"
                                        ? classes.Active
                                        : ""
                                }
                                href={"/admin/settings/tax"}
                            >
                                الضريبة
                            </Link>
                        </li>
                        <li className={classes.Secondary_List__Item}>
                            <Link
                                className={
                                    router.pathname == "/admin/settings/discount"
                                        ? classes.Active
                                        : ""
                                }
                                href={"/admin/settings/discount"}
                            >
                                الخصم
                            </Link>
                        </li>
                    </ul>
                </li>
                <li className={classes.List_Item}
                    onClick={() => listClickedHandler("list3")}
                >
                    <p
                        className={
                            router.pathname.includes("/reports")
                                ? classes.Active
                                : ""
                        }
                    >
                        <span className={classes.IconContainer}>
                            <ReportsIcon/>
                        </span>
                        <span className={classes.ItemText}>
                            التقارير
                        </span>
                    </p>
                    <ul
                        className={[
                            classes.Secondary_List,
                            lists.list3 && classes.Show,
                        ].join(" ")}
                    >
                        <li className={classes.Secondary_List__Item}>
                            <Link
                                className={
                                    router.pathname == "/admin/reports/orders"
                                        ? classes.Active
                                        : ""
                                }
                                href={"/admin/reports/orders"}
                            >
                                الأوردرات
                            </Link>
                        </li>
                        <li className={classes.Secondary_List__Item}>
                            <Link
                                className={
                                    router.pathname == "/admin/reports/meals"
                                        ? classes.Active
                                        : ""
                                }
                                href={"/admin/reports/meals"}
                            >
                                الوجبات الأكثر مبيعا
                            </Link>
                        </li>
                    </ul>
                </li>
            </ul>
        </aside>
    );
}

export default Aside;
