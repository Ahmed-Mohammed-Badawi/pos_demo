import React, { useState } from "react";
import classes from "@/styles/reset_password.module.scss";
import { useRouter } from "next/router";
import Head from "next/head";
// Imports
import BackButton from "@/components/Admin/Dashboard/BackButton/BackButton";
import Spinner from "@/components/Spinner/Spinner";

// Redux
import { useSelector, useDispatch } from "react-redux";
import {
    userItemChanged,
    clearUser,
} from "@/Redux/Reducers/AdminFormsEditReducer";
// Axios
import axios from "axios";
// Notifications
import { toast } from "react-toastify";

function Reset_Password({ id, user_name }) {
    // Router
    const router = useRouter();

    // States
    const [loading, setLoading] = useState(false);

    // Redux
    const dispatch = useDispatch();
    const { userPassword, userPasswordConfirm } = useSelector(
        (state) => state.AdminEdit.users
    );

    // Function to handle submit
    const handleSubmit = (e) => {
        // stopPropagation to prevent page reload
        e.preventDefault();
        // check if no id
        if (!id) {
            toast.error(
                "User id not foun, please update the user from the Admin Page"
            );
            return;
        }
        // check if any of the fields is  empty
        if (userPassword === "" || userPasswordConfirm === "") {
            toast.error("Please fill all the fields");
            return;
        }
        // check if passwords match
        if (userPassword !== userPasswordConfirm) {
            toast.error("Passwords do not match");
            return;
        }
        // check if password is at least 6 characters
        if (userPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        // Set the loading state to true
        setLoading(true);

        // send the request
        axios
            .put(
                `https://baharapi.kportals.net/api/v1/reset/password`,
                {
                    userId: id,
                    newPassword: userPassword,
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
                // set the loading state to false
                setLoading(false);
                // redirect to users page
                router.push("/admin/users");
            })
            .catch((err) => {
                // set the loading state to false
                setLoading(false);
                // show error
                toast.error(err.response.data.message || err.message);
            });
    };

    return (
        <>
            <Head>
                <title>Reset Password</title>
                <meta name='description' content='Reset Password' />
            </Head>
            <section className={classes.ResetPassword}>
                <div className={classes.ResetPassword__container}>
                    <div className={classes.ResetPassword__header}>
                        <h2 className={classes.ResetPassword__title}>
                            تغيير كلمة السر
                            <span>{user_name}</span>
                        </h2>
                        <BackButton
                            click={() => {
                                dispatch(clearUser());
                                router.push("/admin/users");
                            }}
                        />
                    </div>
                    <form
                        className={classes.ResetPassword__form}
                        onSubmit={handleSubmit}
                    >
                        <div className={classes.ResetPassword__input_container}>
                            <label htmlFor='userPassword'>
                                كلمة المرور (الجديدة): <span>*</span>
                            </label>
                            <input
                                id='userPassword'
                                type='password'
                                placeholder='كلمة المرور'
                                className={classes.ResetPassword__input}
                                value={userPassword}
                                onChange={(e) => {
                                    dispatch(
                                        userItemChanged({
                                            key: "userPassword",
                                            value: e.target.value,
                                        })
                                    );
                                }}
                            />
                        </div>
                        <div className={classes.ResetPassword__input_container}>
                            <label htmlFor='userPasswordConfirm'>
                                تأكيد كلمة المرور: <span>*</span>
                            </label>
                            <input
                                id='userPasswordConfirm'
                                type='password'
                                placeholder='تأكيد كلمة المرور'
                                className={classes.ResetPassword__input}
                                value={userPasswordConfirm}
                                onChange={(e) => {
                                    dispatch(
                                        userItemChanged({
                                            key: "userPasswordConfirm",
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

export default Reset_Password;

// Serverside function
export async function getServerSideProps(context) {
    // get the id and user_name from url
    const { id, user_name } = context.query;
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
                user_name,
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
