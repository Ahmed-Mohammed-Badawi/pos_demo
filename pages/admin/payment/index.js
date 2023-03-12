import React, { useEffect } from "react";
import classes from "@/styles/payment.module.scss";
import { useRouter } from "next/router";
import Head from "next/head";

// Imports
import CreateButton from "@/components/Admin/layout/CreateButton/CreateButton";
import DeleteIcon from "@/components/SVGS/DeleteIcon";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { showOverlay } from "@/Redux/Reducers/Delete_all__Reducer";
import { setPayments } from "@/Redux/Reducers/TablesReducer";

// Axios
import axios from "axios";
// Notifications
import { toast } from "react-toastify";

function Payment() {
    // Router
    const router = useRouter();

    // Redux
    const dispatch = useDispatch();
    const { payments } = useSelector((state) => state.tables);

    useEffect(() => {
        axios
            .get(`https://baharapi.kportals.net/api/v1/get/payments`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => {
                dispatch(setPayments(res.data.payments));
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || err.message);
            });
    }, [dispatch]);

    return (
        <>
            <Head>
                <title>Payment</title>
                <meta name='description' content='Payment' />
            </Head>
            <section className={classes.Payment}>
                <div className={classes.Top}>
                    <CreateButton
                        click={() => router.push("/admin/payment/create")}
                    />
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
                                اسم وسيلة الدفع
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
                            {payments &&
                                payments.map((payment) => {
                                    return (
                                        <div
                                            className={classes.Row}
                                            key={payment._id}
                                        >
                                            <span className={classes.Cell_TD}>
                                                {payment.paymentMethod}
                                            </span>
                                            <span className={classes.Cell_TD}>
                                                <span
                                                    className={
                                                        classes.IconContainer
                                                    }
                                                    onClick={() =>
                                                        dispatch(
                                                            showOverlay({
                                                                heading:
                                                                    "هل تريد بالتأكيد حذف (وسيلة الدفع)!؟",
                                                                content:
                                                                    "برجاء العلم انه عند تنفيذ هذا الإجراء سوف يتم حذف وسيلة الدفع نهائيا من قاعدة البيانات",
                                                                deleteType:
                                                                    "payment",
                                                                id: payment._id,
                                                            })
                                                        )
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </span>
                                            </span>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Payment;

// Serverside function
export async function getServerSideProps(context) {
    // get the crole and authenticated from cookie
    const cookie = context.req.headers.cookie;
    // get the role and authenticated from cooki
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
    if (authenticatedValue === "true" && roleValue === "admin") {
        return {
            props: {},
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
