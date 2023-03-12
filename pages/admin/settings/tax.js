import React, { useState } from "react";
import classes from "@/styles/create_category.module.scss";
import { useRouter } from "next/router";
import Head from "next/head";
// Imports
import BackButton from "@/components/Admin/Dashboard/BackButton/BackButton";
import Spinner from "@/components/Spinner/Spinner";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { setTaxAmount, clearTaxAmount } from "@/Redux/Reducers/settingsReducer";

// Axios
import axios from "axios";
// Notifications
import { toast } from "react-toastify";

function Tax() {
    // Router
    const router = useRouter();

    // States
    const [loading, setLoading] = useState(false);

    // Redux
    const dispatch = useDispatch();
    const TaxAmount = useSelector((state) => state.settings.taxAmount);

    // Submit handler
    const submitHandler = (e) => {
        // prevent Default
        e.preventDefault();

        // Check that the Tax Amount is not empty
        if (TaxAmount === "") {
            toast.error("Please enter a Tax Amount");
            return;
        }

        // Check if Tax Amount is a number
        if (isNaN(TaxAmount)) {
            toast.error("Please enter a valid Tax Amount");
            return;
        }

        // Set the loading state
        setLoading(true);

        // Send the REquest
        axios
            .post(
                `https://baharapi.kportals.net/api/v1/set/tax`,
                {
                    taxRate: TaxAmount,
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
                // Set the loading state
                setLoading(false);

                // Clear the Tax Amount
                dispatch(clearTaxAmount());

                // Redirect to the Dashboard
                router.push("/admin");
            })
            .catch((err) => {
                // Set the loading state
                setLoading(false);
                //  toast the error
                toast.error(err.response.data.message || err.message);
            });
    };

    return (
        <>
            <Head>
                <title>Tax</title>
                <meta name='description' content='Tax' />
            </Head>
            <section className={classes.createCategory}>
                <div className={classes.createCategory__container}>
                    <div className={classes.createCategory__header}>
                        <h2 className={classes.createCategory__title}>
                            الضريبة
                        </h2>
                        <BackButton
                            click={() => {
                                dispatch(clearTaxAmount());
                                router.push("/admin/products");
                            }}
                        />
                    </div>
                    <form
                        className={classes.createCategory__form}
                        onSubmit={submitHandler}
                    >
                        <div
                            className={classes.createCategory__input_container}
                        >
                            <label htmlFor='TaxAmount'>
                                القيمة: <span>*</span>
                            </label>
                            <input
                                id='TaxAmount'
                                type='number'
                                step={".01"}
                                min={"0"}
                                placeholder='قيمة الضريبة'
                                className={classes.createCategory__input}
                                value={TaxAmount}
                                onChange={(e) => {
                                    dispatch(
                                        setTaxAmount({
                                            value: e.target.value,
                                        })
                                    );
                                }}
                            />
                        </div>
                        <button type='submit'>
                            {loading ? <Spinner width={"2rem"} /> : "حفظ"}
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
}

export default Tax;

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
