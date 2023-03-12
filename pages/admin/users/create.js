import React, { useState, useEffect } from "react";
import classes from "@/styles/create_users.module.scss";
import { useRouter } from "next/router";
import Head from "next/head";
// Imports
import BackButton from "@/components/Admin/Dashboard/BackButton/BackButton";
import CustomSelect from "@/components/Admin/Dashboard/CustomSelect/CustomSelect";
import Spinner from "@/components/Spinner/Spinner";

// Redux
import { useSelector, useDispatch } from "react-redux";
import {
    userItemChanged,
    userItemsClear,
} from "@/Redux/Reducers/AdminFormsReducer";

// Axios
import axios from "axios";
// Notifications
import { toast } from "react-toastify";

function Create() {
    // Router
    const router = useRouter();

    // State
    const [loading, setLoading] = useState(false);
    const [branches, setBranches] = useState([]);

    // Redux
    const dispatch = useDispatch();
    const {
        user_name,
        userName,
        userPassword,
        userPasswordConfirm,
        userRole,
        userBranch,
    } = useSelector((state) => state.adminforms.users);

    // Dummy Select Items
    const PERMESSIONS_OPTION = [
        { value: "admin", label: "مدير النظام" },
        { value: "branchManager", label: "مدير الفرع" },
        { value: "cashier", label: "كاشير" },
        { value: "delivery", label: "دليفري" },
        { value: "callcenter", label: "خدمة عملاء" },
    ];

    // Function to get the object with the same id
    const getSelectedItem = (value, list) => {
        const selectedItem = list.find((item) => item.value === value);
        return selectedItem;
    };

    // Function to handle submit
    const handleSubmit = (e) => {
        // stopPropagation to prevent page reload
        e.preventDefault();
        // check if any field is empty
        if (
            user_name === "" ||
            userName === "" ||
            userPassword === "" ||
            userPasswordConfirm === "" ||
            userRole === "" ||
            userBranch === ""
        ) {
            toast.error("please fill all fields");
            return;
        }

        // check if password is at least 6 characters
        if (userPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        // check if passwords match
        if (userPassword !== userPasswordConfirm) {
            toast.error("passwords do not match");
            return;
        }

        // check if username is valid
        if (!/^[a-zA-Z0-9_]+$/.test(userName)) {
            toast.error("username is invalid");
            return;
        }

        // Set the State of loading
        setLoading(true);

        // Send the Request
        axios
            .post(
                "https://baharapi.kportals.net/api/v1/create/user",
                {
                    fullName: user_name,
                    username: userName,
                    password: userPassword,
                    role: userRole,
                    branchId: userBranch,
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
                router.push("/admin/users");
                // clear the form
                dispatch(userItemsClear());
            })
            .catch((err) => {
                // set the loading state
                setLoading(false);
                toast.error(err.response?.data?.message || err.message);
            });
    };
    // Effect to get branches
    useEffect(() => {
        axios
            .get(`https://baharapi.kportals.net/api/v1/get/branches/list`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => {
                // set every item to an object with value and label
                const new_branches = res.data.branches.map((item) => {
                    return {
                        value: item._id,
                        label: item.branchName,
                    };
                });

                setBranches(new_branches);
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || err.message);
            });
    }, []);

    return (
        <>
            <Head>
                <title>Create User</title>
                <meta name='description' content='Create User' />
            </Head>
            <section className={classes.createUser}>
                <div className={classes.createUser__container}>
                    <div className={classes.createUser__header}>
                        <h2 className={classes.createUser__title}>
                            إنشاء مستخدم (موظف)
                        </h2>
                        <BackButton
                            click={() => {
                                dispatch(userItemsClear());
                                router.push("/admin/users");
                            }}
                        />
                    </div>
                    <form
                        className={classes.createUser__form}
                        onSubmit={handleSubmit}
                    >
                        <div className={classes.createUser__formGroup}>
                            <div
                                className={classes.createUser__input_container}
                            >
                                <label htmlFor='user_name'>
                                    اسم الموظَف: <span>*</span>
                                </label>
                                <input
                                    id='user_name'
                                    type='text'
                                    autoComplete='off'
                                    placeholder='اسم الموَظَف'
                                    className={classes.createUser__input}
                                    value={user_name}
                                    onChange={(e) => {
                                        dispatch(
                                            userItemChanged({
                                                key: "user_name",
                                                value: e.target.value,
                                            })
                                        );
                                    }}
                                />
                            </div>
                            <div
                                className={classes.createUser__input_container}
                            >
                                <label htmlFor='UserName'>
                                    اسم المستَخدِم (UserName): <span>*</span>
                                </label>
                                <input
                                    id='UserName'
                                    type='text'
                                    autoComplete='off'
                                    placeholder='اسم المستخدِم مثل A7med_2001'
                                    className={classes.createUser__input}
                                    value={userName}
                                    onChange={(e) => {
                                        dispatch(
                                            userItemChanged({
                                                key: "userName",
                                                value: e.target.value,
                                            })
                                        );
                                    }}
                                />
                            </div>
                        </div>
                        <div className={classes.createUser__formGroup}>
                            <div
                                className={classes.createUser__input_container}
                            >
                                <label htmlFor='user_password'>
                                    كلمة المرور: <span>*</span>
                                </label>
                                <input
                                    id='user_password'
                                    type='password'
                                    placeholder='كلمة المرور'
                                    className={classes.createUser__input}
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
                            <div
                                className={classes.createUser__input_container}
                            >
                                <label htmlFor='user_password_confirm'>
                                    تأكيد كلمة المرور: <span>*</span>
                                </label>
                                <input
                                    id='user_password_confirm'
                                    type='password'
                                    placeholder='تأكيد كلمة المرور'
                                    className={classes.createUser__input}
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
                        </div>
                        <div className={classes.createUser__formGroup}>
                            <div
                                className={classes.createUser__input_container}
                            >
                                <label htmlFor={"userBranch"}>
                                    الفَرع: <span>*</span>
                                </label>
                                <CustomSelect
                                    label={"الفَرع"}
                                    arrOfValue={branches}
                                    change={(options) => {
                                        dispatch(
                                            userItemChanged({
                                                key: "userBranch",
                                                value: options?.value
                                                    ? options.value
                                                    : "",
                                            })
                                        );
                                    }}
                                    selectedValue={getSelectedItem(
                                        userBranch,
                                        branches
                                    )}
                                />
                            </div>
                            <div
                                className={classes.createUser__input_container}
                            >
                                <label htmlFor={"userRole"}>
                                    الصلاحية (الدور): <span>*</span>
                                </label>
                                <CustomSelect
                                    arrOfValue={PERMESSIONS_OPTION}
                                    change={(options) => {
                                        dispatch(
                                            userItemChanged({
                                                key: "userRole",
                                                value: options?.value
                                                    ? options.value
                                                    : "",
                                            })
                                        );
                                    }}
                                    label={"اسم القسم"}
                                    selectedValue={getSelectedItem(
                                        userRole,
                                        PERMESSIONS_OPTION
                                    )}
                                />
                            </div>
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
