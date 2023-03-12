import React, { useState } from "react";
import classes from "@/styles/create_unit.module.scss";
import { useRouter } from "next/router";
import Head from "next/head";
// Imports
import BackButton from "@/components/Admin/Dashboard/BackButton/BackButton";
import Spinner from "@/components/Spinner/Spinner";

// Redux
import { useSelector, useDispatch } from "react-redux";
import {
    unitItemChanged,
    unitItemsClear,
} from "@/Redux/Reducers/AdminFormsReducer";

// Axios
import axios from "axios";
// Notifications
import { toast } from "react-toastify";

function Create() {
    // Router
    const router = useRouter();

    // States
    const [loading, setLoading] = useState(false);

    // Redux
    const dispatch = useDispatch();
    const { unitName, minUnit } = useSelector(
        (state) => state.adminforms.units
    );

    // Submit handler

    const submitHandler = (e) => {
        // prevent default
        e.preventDefault();

        // Check if unit name and min unit is empty
        if (unitName === "" || minUnit === "") {
            toast.error("Please fill all fields");
            return;
        }

        // set the loading state
        setLoading(true);
        // send the request
        axios
            .post(
                `https://posapi.kportals.net/api/v1/create/unit`,
                { unitName: unitName, unitValue: minUnit },
                {
                    headers: {
                        // set the headers with the Authorization
                        "Content-Type": "application/json",
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
                router.push("/admin/products/units");
                // clear the form
                dispatch(unitItemsClear());
            })
            .catch((err) => {
                // set the loading state
                setLoading(false);
                toast.error(err.response?.data?.message || err.message);
            });
    };

    return (
        <>
            <Head>
                <title>Create Unit</title>
                <meta name='description' content='Create Unit' />
            </Head>
            <section className={classes.createUnit}>
                <div className={classes.createUnit__container}>
                    <div className={classes.createUnit__header}>
                        <h2 className={classes.createUnit__title}>
                            إنشاء وحدة
                        </h2>
                        <BackButton
                            click={() => {
                                dispatch(unitItemsClear());
                                router.push("/admin/products/units");
                            }}
                        />
                    </div>
                    <form
                        className={classes.createUnit__form}
                        onSubmit={submitHandler}
                    >
                        <div className={classes.createUnit__input_container}>
                            <label htmlFor='unitName'>
                                اسم الوحدة: <span>*</span>
                            </label>
                            <input
                                id='unitName'
                                type='text'
                                placeholder='الاسم'
                                className={classes.createUnit__input}
                                value={unitName}
                                onChange={(e) => {
                                    dispatch(
                                        unitItemChanged({
                                            key: "unitName",
                                            value: e.target.value,
                                        })
                                    );
                                }}
                            />
                        </div>
                        <div className={classes.createUnit__input_container}>
                            <label htmlFor='minUnit'>
                                اقل قيمة للبيع: <span>*</span>
                            </label>
                            <input
                                id='minUnit'
                                type='number'
                                placeholder='اقل قيمة'
                                className={classes.createUnit__input}
                                value={minUnit}
                                step='0.1'
                                onChange={(e) => {
                                    dispatch(
                                        unitItemChanged({
                                            key: "minUnit",
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
