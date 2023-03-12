import React, { useState } from "react";
import classes from "@/styles/create_branch.module.scss";
import { useRouter } from "next/router";
import Head from "next/head";
// Imports
import BackButton from "@/components/Admin/Dashboard/BackButton/BackButton";
import Spinner from "@/components/Spinner/Spinner";

// Redux
import { useSelector, useDispatch } from "react-redux";
import {
    branchItemChanged,
    branchItemsClear,
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
    const { branchName, branchAddress, branchArea } = useSelector(
        (state) => state.adminforms.branches
    );

    // Function to handle submit
    const handleSubmit = (e) => {
        // stopPropagation to prevent page reload
        e.preventDefault();
        // check if any field is empty
        if (branchName === "" || branchAddress === "" || branchArea === "") {
            toast.error("Please fill all the fields");
            return;
        }

        // Set loading
        setLoading(true);

        // Send the request
        axios
            .post(
                "https://baharapi.kportals.net/api/v1/create/branch",
                {
                    branchName: branchName,
                    branchAddress: branchAddress,
                    branchRegion: branchArea,
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
                // set the loading state
                setLoading(false);
                // redirect to the products
                router.push("/admin/branches");
                // clear the form
                dispatch(branchItemsClear());
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
                <title>Create Branch</title>
                <meta name='description' content='Create Branch' />
            </Head>
            <section className={classes.createItem}>
                <div className={classes.createItem__container}>
                    <div className={classes.createItem__header}>
                        <h2 className={classes.createItem__title}>إنشاء فرع</h2>
                        <BackButton
                            click={() => {
                                dispatch(branchItemsClear());
                                router.push("/admin/branches");
                            }}
                        />
                    </div>
                    <form
                        className={classes.createItem__form}
                        onSubmit={handleSubmit}
                    >
                        <div className={classes.createItem__input_container}>
                            <label htmlFor='branchName'>
                                اسم الفرع: <span>*</span>
                            </label>
                            <input
                                id='branchName'
                                type='text'
                                placeholder='اسم الفرع'
                                className={classes.createItem__input}
                                value={branchName}
                                onChange={(e) => {
                                    dispatch(
                                        branchItemChanged({
                                            key: "branchName",
                                            value: e.target.value,
                                        })
                                    );
                                }}
                            />
                        </div>
                        <div className={classes.createItem__input_container}>
                            <label htmlFor='branchAddress'>
                                العنوان: <span>*</span>
                            </label>
                            <input
                                id='branchAddress'
                                type='text'
                                placeholder='عنوان الفرع'
                                className={classes.createItem__input}
                                value={branchAddress}
                                onChange={(e) => {
                                    dispatch(
                                        branchItemChanged({
                                            key: "branchAddress",
                                            value: e.target.value,
                                        })
                                    );
                                }}
                            />
                        </div>
                        <div className={classes.createItem__input_container}>
                            <label htmlFor='branchArea'>
                                المنطقة: <span>*</span>
                            </label>
                            <input
                                id='branchArea'
                                type='text'
                                placeholder='منطقة الفرع'
                                className={classes.createItem__input}
                                value={branchArea}
                                onChange={(e) => {
                                    dispatch(
                                        branchItemChanged({
                                            key: "branchArea",
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
