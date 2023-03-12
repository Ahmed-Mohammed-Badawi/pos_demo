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
    clearBranch,
} from "@/Redux/Reducers/AdminFormsEditReducer";

// Axios
import axios from "axios";
// Notifications
import { toast } from "react-toastify";

function Edit({ id, name }) {
    // Router
    const router = useRouter();

    // States
    const [loading, setLoading] = useState(false);

    // Redux
    const dispatch = useDispatch();
    const { branchName, branchAddress, branchArea } = useSelector(
        (state) => state.AdminEdit.branches
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

        // check if no id
        if (!id) {
            toast.error(
                "No branch found, please update the branch from the Admin branches page"
            );
            return;
        }

        // Set loading
        setLoading(true);

        // Send the request
        axios
            .put(
                "https://posapi.kportals.net/api/v1/edit/branch",
                {
                    branchName: branchName,
                    branchAddress: branchAddress,
                    branchRegion: branchArea,
                    branchId: id,
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
                dispatch(clearBranch());
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
                <title>Edit Branch</title>
                <meta name='description' content='Edit Branch' />
            </Head>
            <section className={classes.createItem}>
                <div className={classes.createItem__container}>
                    <div className={classes.createItem__header}>
                        <h2 className={classes.createItem__title}>تعديل فرع</h2>
                        <BackButton
                            click={() => {
                                dispatch(clearBranch());
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
                            {loading ? <Spinner width={"2rem"} /> : "تعديل"}
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
}

export default Edit;

// Serverside function
export async function getServerSideProps(context) {
    const { id, name } = context.query;
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
            props: {
                id,
                name,
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
