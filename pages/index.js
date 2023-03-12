import React, {useState, useRef} from "react";
import classes from "@/styles/login.module.scss";
import {useRouter} from "next/router";
import Image from "next/image";
import Head from "next/head";

// Imports
import Spinner from "@/components/Spinner/Spinner";
// Notifications
import {toast} from "react-toastify";
// Axios
import axios from "axios";
//Socket
import socket from "@/helpers/socket";




function Login() {
    // Router
    const router = useRouter();

    // States
    const [sending, setSending] = useState(false);

    // Refs
    const userName_Ref = useRef();
    const password_Ref = useRef();

    // Submit handler
    const submitHandler = async (e) => {
        // prevent Default
        e.preventDefault();
        // get the inputs value
        const userName = userName_Ref.current.value;
        const password = password_Ref.current.value;

        if (userName === "" || password === "") {
            toast.error("Please fill all the fields");
            return;
        }

        if (password.trim().length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        // Change the state
        setSending(true);
        // Send Request
        await axios
            .post(`https://posapi.kportals.net/api/v1/login`, {
                username: userName,
                password: password,
            })
            .then((res) => {
                setSending(false);
                if (res.status === 200 && res.data.token) {
                    // Data
                    toast.success("Login Successful");
                    localStorage.setItem("token", res.data.token);
                    localStorage.setItem("role", res.data.role);
                    localStorage.setItem("login_id", res.data.userId);
                    localStorage.setItem("branch_id", res.data.branchId);
                    localStorage.setItem("user_name", res.data.fullName);
                    // Set the token at cookie
                    document.cookie = `role=${res.data.role}`;
                    document.cookie = `authenticated=${true}`;
                    // check the role of the user to redirect him to the right page
                    if (res.data.role === "admin") {
                        router.push("/admin");
                    } else if (res.data.role === "callcenter") {
                        router.push("/callcenter");
                    } else if (res.data.role === "cashier") {
                        router.push("/branch");
                    }

                    // Socket
                    socket.emit("cashier_logged_in", {
                        branchId: res.data.branchId
                    })
                }
            })
            .catch((err) => {
                setSending(false);
                toast.error(err.response?.data?.message || err.message);
            });
    };

    return (
        <>
            <Head>
                <title>Login</title>
                <meta name='description' content='Login page'/>
            </Head>
            <section className={classes.Login}>
                <div className={classes.Login__container}>
                    <div className={classes.Login__header}>
                        <h2 className={classes.Login__title}>تسجيل الدخول</h2>
                        <div>
                            <Image
                                src='/pos_favicon.png'
                                width={40}
                                height={40}
                                alt='logo'
                            />
                        </div>
                    </div>
                    <form
                        className={classes.Login__form}
                        onSubmit={submitHandler}
                    >
                        <div className={classes.Login__input_container}>
                            <label htmlFor='userName'>
                                اسم المستخدم: <span>*</span>
                            </label>
                            <input
                                ref={userName_Ref}
                                id='userName'
                                type='text'
                                placeholder='اسم المستخدم(A7med_2001)'
                                className={classes.Login__input}
                                autoComplete='on'
                            />
                        </div>
                        <div className={classes.Login__input_container}>
                            <label htmlFor='password'>
                                كلمة المرور: <span>*</span>
                            </label>
                            <input
                                ref={password_Ref}
                                id='password'
                                type='password'
                                placeholder='كلمة المرور'
                                className={classes.Login__input}
                                autoComplete='off'
                            />
                        </div>
                        <button type='submit'>
                            {sending ? (
                                <Spinner width={"2rem"}/>
                            ) : (
                                "تسجيل الدخول"
                            )}
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
}

export default Login;

// Serverside function
export async function getServerSideProps(context) {
    // get the crole and authenticated from cookie
    const cookie = context.req.headers.cookie;
    // get the role and authenticated from cooki
    const role = cookie?.split(";")?.find((c) => c.trim().startsWith("role="));
    const authenticated = cookie
        ?.split(";")
        ?.find((c) => c.trim().startsWith("authenticated="));

    // continue if not authenticated || no role
    if (!authenticated || !role) {
        return {
            props: {},
        };
    }

    //  get the role and authenticated values
    const roleValue = role.split("=")[1];
    const authenticatedValue = authenticated.split("=")[1];

    // check and redirect to the right page
    if (authenticatedValue === "true") {
        if (roleValue === "admin") {
            return {
                redirect: {
                    destination: "/admin",
                    permanent: false,
                },
            };
        } else if (roleValue === "callcenter") {
            return {
                redirect: {
                    destination: "/callcenter",
                    permanent: false,
                },
            };
        } else if (roleValue === "cashier") {
            return {
                redirect: {
                    destination: "/branch",
                    permanent: false,
                },
            };

        } else {
            return {
                props: {},
            };
        }
    }
}
