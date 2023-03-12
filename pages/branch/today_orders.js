import React, { useState, useEffect } from "react";
import classes from "@/styles/branch_delivery.module.scss";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

// IMPORTS
import LogoutIcon from "@/components/SVGS/LogoutIcon";
import axios from "axios";
import { toast } from "react-toastify";

function Today_orders() {
    //State of orders
    const [orders, setOrders] = useState([]);

    //Effect to get the Data When Page Load
    useEffect(() => {
        // Axios
        axios
            .get(`https://posapi.kportals.net/api/v1/toady/orders`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => {
                setOrders(res.data.todayOrders);
            })
            .catch((err) => console.log(err));
    }, []);

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

    //Print function
    function printHandler(orderId) {
        axios
            .get(
                `https://posapi.kportals.net/api/v1/cashier/print/order?orderId=${orderId}`,
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
                window.open(res.data.receiptUrl, "_blank");
            })
            .catch((err) => console.log(err));
    }

    //Delete Order Handler
    function deleteOrderHandler(orderId) {
        axios
            .delete(
                `https://posapi.kportals.net/api/v1/delete/order?orderId=${orderId}`,
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
                // Hide the Remove Button from the removed Orders
                // get the order by it's id
                let selectedOrder = document.getElementById(`${orderId}`);
                selectedOrder.classList.add(classes.HideRemove);

                //Show a notification
                toast.success("Order Cancelled");
            })
            .catch((err) => {
                toast.error(`Something went wrong while Cancelling the order`);
            });
    }

    return (
        <>
            <Head>
                <title>Dispatcher - Page</title>
                <meta
                    name='description'
                    content='Dispatcher Page where print the order and put it to be prepared'
                />
            </Head>
            <div className='Container Inner_Container'>
                <div className={classes.Top}>
                    <nav className={classes.Navigation}>
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
                    <div
                        className={classes.Navigation_Logout}
                        onClick={logoutHandler}
                        title='تسجيل الخروج'
                    >
                        <LogoutIcon />
                    </div>
                    <h1 style={{ marginLeft: "auto" }}>أوردرات اليوم</h1>
                </div>
                <div className={classes.Bottom}>
                    <div className={classes.Table}>
                        <div className={classes.Head}>
                            <span
                                className={[
                                    classes.Head_Title,
                                    classes.Cell,
                                ].join(" ")}
                            >
                                رقم الأوردر
                            </span>
                            <span
                                className={[
                                    classes.Head_Title,
                                    classes.Cell,
                                ].join(" ")}
                            >
                                اسم العميل
                            </span>
                            <span
                                className={[
                                    classes.Head_Title,
                                    classes.Cell,
                                ].join(" ")}
                            >
                                العنوان
                            </span>
                            <span
                                className={[
                                    classes.Head_Title,
                                    classes.Cell,
                                ].join(" ")}
                            >
                                التاريخ
                            </span>
                            <span
                                className={[
                                    classes.Head_Title,
                                    classes.Cell,
                                ].join(" ")}
                            >
                                الإجراءات
                            </span>
                        </div>
                        <div className={classes.Table__Content}>
                            {orders &&
                                orders.map((order, i) => {
                                    return (
                                        <div
                                            key={order._id}
                                            className={classes.Row}
                                            id={order._id}
                                        >
                                            <span className={classes.Cell_TD}>
                                                #{order.orderNumber}
                                            </span>
                                            <span className={classes.Cell_TD}>
                                                {order.clientId.clientName}
                                            </span>
                                            <span className={classes.Cell_TD}>
                                                {order.clientAddress}
                                            </span>
                                            <span className={classes.Cell_TD}>
                                                {new Date(
                                                    order.updatedAt
                                                ).toLocaleDateString("ar-EG", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </span>
                                            <span className={classes.Cell_TD}>
                                                <button
                                                    type='button'
                                                    className={classes.Button}
                                                    onClick={() =>
                                                        printHandler(order._id)
                                                    }
                                                >
                                                    <Image
                                                        src={
                                                            "/Icons/branch/printer.png"
                                                        }
                                                        width={25}
                                                        height={25}
                                                        alt={"print"}
                                                    />
                                                </button>
                                                <button
                                                    title='حذف'
                                                    name='delete'
                                                    type='button'
                                                    className={classes.Button}
                                                    onClick={() => {
                                                        if (
                                                            confirm(
                                                                `هل انت متأكد من حذف هذا الطلب`
                                                            )
                                                        ) {
                                                            deleteOrderHandler(
                                                                order._id
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <Image
                                                        src={
                                                            "/Icons/Delete.svg"
                                                        }
                                                        width={25}
                                                        height={25}
                                                        alt={"print"}
                                                    />
                                                </button>
                                            </span>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Today_orders;

// Serverside function
export async function getServerSideProps(context) {
    // get the role and authenticated from cookie
    const cookie = context.req.headers.cookie;
    // get the role and authenticated from cookie
    const role = cookie?.split(";")?.find((c) => c.trim().startsWith("role="));
    const authenticated = cookie
        ?.split(";")
        ?.find((c) => c.trim().startsWith("authenticated="));

    // redirect if not authenticated || no role
    if (!authenticated || !role) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    //  get the role and authenticated values
    const roleValue = role.split("=")[1];
    const authenticatedValue = authenticated.split("=")[1];

    // check and redirect to the right page
    if (authenticatedValue === "true" && roleValue === "cashier") {
        return {
            props: {
                roleValue,
            },
        };
    } else {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
}
