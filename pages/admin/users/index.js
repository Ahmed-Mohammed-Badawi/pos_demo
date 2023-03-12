import React, { useEffect, useState } from "react";
import classes from "@/styles/users.module.scss";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
// Imports
import CreateButton from "@/components/Admin/layout/CreateButton/CreateButton";
import SearchInput from "@/components/Admin/layout/SearchInput/SearchInput";
import EditIcon from "@/components/SVGS/EditIcon";
import DeleteIcon from "@/components/SVGS/DeleteIcon";
import PasswordIcon from "@/components/SVGS/PasswordIcon";
import Pagination from "@/components/Admin/layout/PaginationTransparent/Pagination";
import BranchStatusButton from "@/components/Admin/Dashboard/BranchStatusButton/BranchStatusButton";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { showOverlay } from "@/Redux/Reducers/Delete_all__Reducer";
import { setUsers } from "@/Redux/Reducers/TablesReducer";
import { setDefaultUser } from "@/Redux/Reducers/AdminFormsEditReducer";

// Axios
import axios from "axios";

// Notifications
import { toast } from "react-toastify";

function Users() {
    // Router
    const router = useRouter();

    // States
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Redux
    const dispatch = useDispatch();
    const { users } = useSelector((state) => state.tables);

    useEffect(() => {
        loadUsers(currentPage);
    }, [currentPage]);

    // load Users
    const loadUsers = (page) => {
        const result = axios
            .get(
                `https://baharapi.kportals.net/api/v1/get/all/users?page=${page}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            )
            .then((res) => {
                dispatch(setUsers(res.data.data.users));
                setHasNextPage(res.data.data.hasNextPage);
                setHasPreviousPage(res.data.data.hasPreviousPage);
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || err.message);
            });
    };

    // STatus Branch Handler
    const statusHandler = (id, status) => {
        if (!id || status === undefined || status === null) {
            toast.error("No Id || No Status");
            return;
        }

        // Send the request
        axios
            .post(
                `https://baharapi.kportals.net/api/v1/set/user/status`,
                {
                    userId: id,
                    flag: status,
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
                loadUsers(currentPage);
                toast.success("User Status Updated");
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || err.message);
            });
    };

    return (
        <>
            <Head>
                <title>Users</title>
                <meta name='description' content='Users' />
            </Head>
            <section className={classes.Users}>
                <div className={classes.Top}>
                    <CreateButton
                        click={() => router.push("/admin/users/create")}
                    />
                    <SearchInput searchSection={"users"} />
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
                                اسم المستخدم
                            </span>
                            <span
                                className={[
                                    classes.Head_Title,
                                    classes.Cell,
                                ].join(" ")}
                            >
                                الصلاحية
                            </span>
                            <span
                                className={[
                                    classes.Head_Title,
                                    classes.Cell,
                                ].join(" ")}
                            >
                                الحالة
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
                            {users &&
                                users.map((user) => {
                                    return (
                                        <div
                                            className={classes.Row}
                                            key={user._id}
                                        >
                                            <span className={classes.Cell_TD}>
                                                {user.fullName}
                                            </span>
                                            <span className={classes.Cell_TD}>
                                                {user.role}
                                            </span>
                                            <span className={classes.Cell_TD}>
                                                <span
                                                    className={[
                                                        classes.Status,
                                                        user.userStatus ===
                                                        "Active"
                                                            ? classes.Active
                                                            : classes.UnActive,
                                                    ].join(" ")}
                                                >
                                                    {user.userStatus ===
                                                    "Active"
                                                        ? "متاح"
                                                        : "متوقف"}
                                                </span>
                                            </span>
                                            <span className={classes.Cell_TD}>
                                                <span
                                                    className={
                                                        classes.IconContainer
                                                    }
                                                    onClick={() => {
                                                        dispatch(
                                                            setDefaultUser({
                                                                user_name:
                                                                    user.fullName,
                                                                userName:
                                                                    user.username,
                                                                userRole:
                                                                    user.role,
                                                                userBranch:
                                                                    user.branchId,
                                                            })
                                                        );
                                                    }}
                                                >
                                                    <Link
                                                        href={{
                                                            pathname:
                                                                "/admin/users/edit",
                                                            query: {
                                                                id: user._id,
                                                                name: user.fullName,
                                                            },
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </Link>
                                                </span>
                                                <span
                                                    className={
                                                        classes.IconContainer
                                                    }
                                                >
                                                    <Link
                                                        href={{
                                                            pathname:
                                                                "/admin/users/reset_password",
                                                            query: {
                                                                id: user._id,
                                                                user_name:
                                                                    "احمد محمد بدوي",
                                                            },
                                                        }}
                                                    >
                                                        <PasswordIcon />
                                                    </Link>
                                                </span>
                                                <span
                                                    className={
                                                        classes.IconContainer
                                                    }
                                                    onClick={() =>
                                                        dispatch(
                                                            showOverlay({
                                                                heading:
                                                                    "هل تريد بالتأكيد حذف المستخدم!؟",
                                                                content:
                                                                    "برجاء العلم انه عند تنفيذ هذا الإجراء سوف يتم حذف هذا المستخدم نهائيا من قاعدة البيانات",
                                                                deleteType:
                                                                    "user",
                                                                id: user._id,
                                                            })
                                                        )
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </span>
                                                <span
                                                    className={
                                                        classes.Activation
                                                    }
                                                >
                                                    <BranchStatusButton
                                                        status={
                                                            user.userStatus ===
                                                            "Active"
                                                                ? "Active"
                                                                : "UnActive"
                                                        }
                                                        click={() => {
                                                            statusHandler(
                                                                user._id,
                                                                user.userStatus ===
                                                                    "Active"
                                                                    ? "suspend"
                                                                    : "activate"
                                                            );
                                                        }}
                                                    />
                                                </span>
                                            </span>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
                {(hasNextPage || hasPreviousPage) && (
                    <Pagination
                        prevClick={() => {
                            if (currentPage > 1) {
                                setCurrentPage(currentPage - 1);
                            }
                        }}
                        nextClick={() => {
                            if (hasNextPage) {
                                setCurrentPage(currentPage + 1);
                            }
                        }}
                    />
                )}
            </section>
        </>
    );
}

export default Users;

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
