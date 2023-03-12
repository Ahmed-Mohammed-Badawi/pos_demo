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
    clearUser,
} from "@/Redux/Reducers/AdminFormsEditReducer";

// Axios
import axios from "axios";
// Notifications
import { toast } from "react-toastify";

function Edit_User({ id, name }) {
    // Router
    const router = useRouter();

    // State
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);

    // Redux
    const dispatch = useDispatch();
    const { user_name, userName, userRole, userBranch } = useSelector(
        (state) => state.AdminEdit.users
    );

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
        // Check if no id
        if (!id) {
            toast.error("Please Edit the user from the Admin Users Table");
            return;
        }

        //  check if any of inputs value is empty
        if (
            user_name === "" ||
            userName === "" ||
            userRole === "" ||
            userBranch === ""
        ) {
            toast.error("Please fill all inputs");
            return;
        }
        // check if username is valid
        if (!/^[a-zA-Z0-9_]+$/.test(userName)) {
            toast.error("username is invalid");
            return;
        }

        // set the loading state
        setLoading(true);

        // Send the Request
        axios
            .put(
                "https://posapi.kportals.net/api/v1/edit/user",
                {
                    fullName: user_name,
                    username: userName,
                    role: userRole,
                    branchId: userBranch,
                    userId: id,
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
                // Clear the user form
                dispatch(clearUser());
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
            .get(`https://posapi.kportals.net/api/v1/get/branches/list`, {
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
                toast.error(err.response.data.message || err.message);
            });
    }, []);

    return (
        <>
            <Head>
                <title>Edit User</title>
                <meta name='description' content='Edit User' />
            </Head>
            <section className={classes.createUser}>
                <div className={classes.createUser__container}>
                    <div className={classes.createUser__header}>
                        <h2 className={classes.createUser__title}>
                            تعديل مستخدم (موظف)
                            <span>({name})</span>
                        </h2>
                        <BackButton
                            click={() => {
                                dispatch(clearUser());
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
                            {loading ? <Spinner width={"2rem"} /> : "تعديل"}
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
}

export default Edit_User;

// Serverside function
export async function getServerSideProps(context) {
    // get the id from the url
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
