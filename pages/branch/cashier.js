import React, { useState, useEffect, useRef } from "react";
import classes from "@/styles/branch_cashier.module.scss";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

// IMPORTS
import LogoutIcon from "@/components/SVGS/LogoutIcon";
//Axios
import axios from "axios";
//Socket
import socket from "@/helpers/socket";
//Notifications
import { toast } from "react-toastify";

function Cashier() {
    //States
    const [orders, setOrders] = useState([]);
    const [shift, setShift] = useState(false);
    const [cash, setCash] = useState({
        amount: 0,
        counter: 0,
    });
    const [knet, setKnet] = useState({
        amount: 0,
        counter: 0,
    });
    const [credit, setCredit] = useState({
        amount: 0,
        counter: 0,
    });

    //Refs
    const selectRef = useRef();

    //Effect to get the Data When Page Load
    useEffect(() => {
        // Axios
        axios
            .get(`https://posapi.kportals.net/api/v1/delivery/orders`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => {
                setOrders([...orders, ...res.data.deliveryOrders]);
            })
            .catch((err) => console.log(err));
    }, []);

    //Effect to send the cashier id when page load
    useEffect(() => {
        const branch_id = localStorage.getItem("branch_id");

        //Socket init
        if (branch_id.length > 1) {
            socket.emit("page_reload", {
                branchId: branch_id,
            });
        } else {
            logoutHandler();
        }
    }, []);

    // Effect to Get Money Boxes Data
    useEffect(() => {
        //Get the Cashier Id from localStorage
        const cashierId = localStorage.getItem(`login_id`);
        // Get the cash box id
        const cashboxId = localStorage.getItem(`cashbox_id`);

        if (cashboxId) {
            setShift(true);
        }

        if (cashierId) {
            getCashBoxHandler(cashierId);
        }
    }, []);

    //Socket to get the Amounts
    socket.on("order_paid", (e) => {
        // Get the Amount && Counter
        if (e.paymentMethod === "Cash") {
            // Get the old Data
            let oldAmount = cash.amount;
            let oldCounter = cash.counter;
            // Set the new data
            let newAmount = oldAmount + e.amount;
            let newCounter = oldCounter + 1;
            //Update the state
            setCash({
                amount: newAmount,
                counter: newCounter,
            });
        }
        if (e.paymentMethod === "KNET") {
            // Get the old Data
            let oldAmount = knet.amount;
            let oldCounter = knet.counter;
            // Set the new data
            let newAmount = oldAmount + e.amount;
            let newCounter = oldCounter + 1;
            //Update the state
            setKnet({
                amount: newAmount,
                counter: newCounter,
            });
        }
        if (e.paymentMethod === "Credit") {
            // Get the old Data
            let oldAmount = credit.amount;
            let oldCounter = credit.counter;
            // Set the new data
            let newAmount = oldAmount + e.amount;
            let newCounter = oldCounter + 1;
            //Update the state
            setCredit({
                amount: newAmount,
                counter: newCounter,
            });
        }
    });

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

    //Function to handle order completed
    function handleNext(e, Id) {
        //Stop Reloading
        e.preventDefault();
        // get the Select Value
        const selectValue =
            e.target.parentNode.previousSibling.querySelector("select").value;
        // Send A request to change the order state to be completed
        axios
            .post(
                `https://posapi.kportals.net/api/v1/finish/order`,
                {
                    orderId: Id,
                    paymentMethod: selectValue,
                },
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
                // Remove Order from the State
                let State_instance = [...orders];

                const newData = State_instance.filter(
                    (item) => item._id !== Id
                );

                // Set the Orders
                setOrders(newData);
            })
            .catch((err) => console.log(err));
    }

    //Shift close Handler
    function handleShift(e) {
        //Get the user id from the LocalStorage
        const cashier_id = localStorage.getItem(`login_id`);
        // Send the Request
        axios
            .post(
                `https://posapi.kportals.net/api/v1/cashbox/close`,
                {
                    cashierId: cashier_id,
                },
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
                // Change Button State
                setShift(true);
                // Save the cash box id
                localStorage.setItem("cashbox_id", res.data.cashboxId);
                // Set the States to 0
                const initialState = { amount: 0, counter: 0 };
                setCash(initialState);
                setKnet(initialState);
                setCredit(initialState);
                // Print the Report
                window.open(res.data.cashboxReport, "_blank");
            })
            .catch((err) => {
                console.log(err);
            });
    }

    //Cashbox get handler
    function getCashBoxHandler(cashierId) {
        axios
            .get(
                `https://posapi.kportals.net/api/v1/cashbox?cashierId=${cashierId}`,
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
                setCash({
                    ...res.data.cashbox.totalCash,
                });
                setKnet({
                    ...res.data.cashbox.totalKnet,
                });
                setCredit({
                    ...res.data.cashbox.totalCredit,
                });
            })
            .catch((err) => console.log(err));
    }

    //Shift open Handler
    function handleShiftOpen(e) {
        //Get the user id from the LocalStorage
        const cashier_id = localStorage.getItem(`login_id`);
        const cash_box_id = localStorage.getItem(`cashbox_id`);

        // Send the Request
        axios
            .post(
                `https://posapi.kportals.net/api/v1/cashbox/open`,
                {
                    cashierId: cashier_id,
                    cashboxId: cash_box_id,
                },
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
                //Remove the cashbox id
                localStorage.removeItem("cashbox_id");
                // Change the button State
                setShift(false);
                // Get the Cashier id data and set the state
                getCashBoxHandler(cashier_id);
            })
            .catch((err) => {
                console.log(err);
            });
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
                // Remove Order from the State
                let State_instance = [...orders];

                const newData = State_instance.filter(
                    (item) => item._id !== orderId
                );

                // Set the Orders
                setOrders(newData);
                //Show a notification
                toast.success("Order has been deleted Successfully");
            })
            .catch((err) => {
                toast.error(`Something went wrong while deleting the order`);
            });
    }

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

    return (
        <>
            <Head>
                <title>Cashier</title>
                <meta
                    name='description'
                    content='Cashier Page where the orders money be'
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
                    <div
                        className={classes.Navigation_Reset}
                        onClick={(e) => {
                            if (
                                shift === false &&
                                confirm(`هل انت متأكد من غلق الوردية`)
                            ) {
                                handleShift(e);
                            }
                            if (shift === true) {
                                handleShiftOpen(e);
                            }
                        }}
                    >
                        <Image
                            src={
                                shift
                                    ? "/Icons/branch/Open.svg"
                                    : "/Icons/branch/ResetIcon.svg"
                            }
                            width={20}
                            height={20}
                            alt={"reset icon"}
                        />
                        <span>{shift ? "فتح الوردية" : `إغلاق الوردية`}</span>
                    </div>
                    <div className={classes.Money_Container}>
                        <div className={classes.Money_Box}>
                            <div className={classes.Money_Overlay}>
                                <p
                                    className={classes.Content}
                                    title='إجمالي الكاش'
                                >
                                    KWD {cash.amount.toFixed(3)}
                                </p>
                                <span title='عدد الأوردرات'>
                                    #{cash.counter}
                                </span>
                            </div>
                            <span className={classes.Money_Title}>Cash</span>
                        </div>
                        <div className={classes.Money_Box}>
                            <div className={classes.Money_Overlay}>
                                <p
                                    className={classes.Content}
                                    title='إجمالي KNET'
                                >
                                    KWD {knet.amount.toFixed(3)}
                                </p>
                                <span title='عدد الأوردرات'>
                                    #{knet.counter}
                                </span>
                            </div>
                            <span className={classes.Money_Title}>KNET</span>
                        </div>
                        <div className={classes.Money_Box}>
                            <div className={classes.Money_Overlay}>
                                <p
                                    className={classes.Content}
                                    title='إجمالي الفيزا'
                                >
                                    KWD {credit.amount.toFixed(3)}
                                </p>
                                <span title='عدد الأوردرات'>
                                    #{credit.counter}
                                </span>
                            </div>
                            <span className={classes.Money_Title}>Credit</span>
                        </div>
                    </div>
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
                                القيمة
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
                                وسيلة الدفع
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
                                        >
                                            <span className={classes.Cell_TD}>
                                                #{order.orderNumber}
                                            </span>
                                            <span className={classes.Cell_TD}>
                                                {order.clientId.clientName}
                                            </span>
                                            <span className={classes.Cell_TD}>
                                                KWD{" "}
                                                {order.orderAmount.toFixed(3)}
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
                                                <select
                                                    className={classes.Select}
                                                    ref={selectRef}
                                                >
                                                    <option value={"Cash"}>
                                                        Cash
                                                    </option>
                                                    <option value={"KNET"}>
                                                        KNET
                                                    </option>
                                                    <option value={"Credit"}>
                                                        Credit
                                                    </option>
                                                </select>
                                            </span>
                                            <span className={classes.Cell_TD}>
                                                <button
                                                    title='طباعة'
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
                                                <button
                                                    title='تأكيد'
                                                    type='button'
                                                    className={classes.Button}
                                                    onClick={(e) =>
                                                        handleNext(e, order._id)
                                                    }
                                                >
                                                    <Image
                                                        src={
                                                            "/Icons/branch/nextStep.svg"
                                                        }
                                                        width={25}
                                                        height={25}
                                                        alt={"next"}
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

export default Cashier;

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
