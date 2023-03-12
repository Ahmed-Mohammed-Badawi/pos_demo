import React from "react";
import classes from "@/styles/create_payment.module.scss";
import { useRouter } from "next/router";
import Head from "next/head";
// Imports
import BackButton from "@/components/Admin/Dashboard/BackButton/BackButton";
import Spinner from "@/components/Spinner/Spinner";

// Redux
import { useSelector, useDispatch } from "react-redux";
import {
    paymentItemChanged,
    paymentItemClear,
} from "@/Redux/Reducers/AdminFormsReducer";
// Axios
import axios from "axios";
// Notifications
import { toast } from "react-toastify";

function Create() {
    // Router
    const router = useRouter();

    // States
    const [loading, setLoading] = React.useState(false);

    // Redux
    const dispatch = useDispatch();
    const { paymentName } = useSelector((state) => state.adminforms.payments);

    // Submit handler
    function submitHandler(e) {
        // Prevent default
        e.preventDefault();
        // Check if payment name is empty
        if (paymentName === "") {
            toast.error("Payment name is required");
            return;
        }
        // Set the loading state
        setLoading(true);
        // Send the request
        axios
            .post(
                `https://posapi.kportals.net/api/v1/create/payment`,
                {
                    paymentMethod: paymentName,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            )
            .then((res) => {
                // set the loading state
                setLoading(false);
                // redirect to the products
                router.push("/admin/payment");
                // clear the form
                dispatch(paymentItemClear());
            })
            .catch((err) => {
                // set the loading state
                setLoading(false);
                toast.error(err.response?.data?.message || err.message);
            });
    }

    return (
        <>
            <Head>
                <title>Create Payment</title>
                <meta name='description' content='Create Payment' />
            </Head>
            <section className={classes.createPayment}>
                <div className={classes.createPayment__container}>
                    <div className={classes.createPayment__header}>
                        <h2 className={classes.createPayment__title}>
                            إنشاء وسيلة دفع
                        </h2>
                        <BackButton
                            click={() => {
                                dispatch(paymentItemClear());
                                router.push("/admin/payment");
                            }}
                        />
                    </div>
                    <form
                        className={classes.createPayment__form}
                        onSubmit={submitHandler}
                    >
                        <div className={classes.createPayment__input_container}>
                            <label htmlFor='paymentName'>
                                الاسم: <span>*</span>
                            </label>
                            <input
                                id='paymentName'
                                type='text'
                                placeholder='اسم وسيلة الدفع'
                                className={classes.createPayment__input}
                                value={paymentName}
                                onChange={(e) => {
                                    dispatch(
                                        paymentItemChanged({
                                            key: "paymentName",
                                            value: e.target.value,
                                        })
                                    );
                                }}
                            />
                        </div>
                        <button type='submit'>
                            {loading ? <Spinner width={"2rem"} /> : "إنشاء"}
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
}

export default Create;

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
