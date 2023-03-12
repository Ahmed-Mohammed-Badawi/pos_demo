import React, { useState, useEffect } from "react";
import classes from "@/styles/branches.module.scss";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
// Imports
import CreateButton from "@/components/Admin/layout/CreateButton/CreateButton";
import SearchInput from "@/components/Admin/layout/SearchInput/SearchInput";
import EditIcon from "@/components/SVGS/EditIcon";
import DeleteIcon from "@/components/SVGS/DeleteIcon";
import Pagination from "@/components/Admin/layout/PaginationTransparent/Pagination";
import BranchStatusButton from "@/components/Admin/Dashboard/BranchStatusButton/BranchStatusButton";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { showOverlay } from "@/Redux/Reducers/Delete_all__Reducer";
import { setBranches } from "@/Redux/Reducers/TablesReducer";
import { setDefaultBranch } from "@/Redux/Reducers/AdminFormsEditReducer";

// Axios
import axios from "axios";
// Notifications
import { toast } from "react-toastify";

function Branches() {
    // Router
    const router = useRouter();

    // States
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Redux
    const dispatch = useDispatch();
    const { branches } = useSelector((state) => state.tables);

    useEffect(() => {
        loadBranches(currentPage);
    }, [currentPage]);

    // function to load the branches
    async function loadBranches(page) {
        const result = axios
            .get(
                `https://posapi.kportals.net/api/v1/get/branches?page=${page}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            )
            .then((res) => {
                dispatch(setBranches(res.data.data.branches));
                setHasNextPage(res.data.data.hasNextPage);
                setHasPreviousPage(res.data.data.hasPreviousPage);
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || err.message);
            });
    }

    // STatus Branch Handler
    const statusHandler = (id, status) => {
        if (!id || status === undefined || status === null) {
            toast.error("No Id || No Status");
            return;
        }

        // Send the request
        axios
            .put(
                `https://posapi.kportals.net/api/v1/set/branch/status`,
                {
                    branchId: id,
                    status: status,
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
                loadBranches(currentPage);
                toast.success("Branch Status Updated");
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || err.message);
            });
    };

    return (
        <>
            <Head>
                <title>Branches</title>
                <meta name='description' content='Branches' />
            </Head>
            <section className={classes.Branches}>
                <div className={classes.Top}>
                    <CreateButton
                        click={() => router.push("/admin/branches/create")}
                    />
                    <SearchInput searchSection={"branches"} />
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
                                اسم الفرع
                            </span>
                            <span
                                className={[
                                    classes.Head_Title,
                                    classes.Cell,
                                ].join(" ")}
                            >
                                العنوان
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
                            {branches &&
                                branches.map((branch) => {
                                    return (
                                        <div
                                            className={classes.Row}
                                            key={branch._id}
                                        >
                                            <span className={classes.Cell_TD}>
                                                {branch.branchName}
                                            </span>
                                            <span className={classes.Cell_TD}>
                                                {branch.branchAddress}
                                            </span>
                                            <span className={classes.Cell_TD}>
                                                <span
                                                    className={[
                                                        classes.Status,
                                                        branch.openingStatus
                                                            ? classes.Active
                                                            : classes.UnActive,
                                                    ].join(" ")}
                                                >
                                                    {branch.openingStatus
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
                                                            setDefaultBranch({
                                                                branchName:
                                                                    branch.branchName,
                                                                branchAddress:
                                                                    branch.branchAddress,
                                                                branchArea:
                                                                    branch.branchRegion,
                                                            })
                                                        );
                                                    }}
                                                >
                                                    <Link
                                                        href={{
                                                            pathname:
                                                                "/admin/branches/edit",
                                                            query: {
                                                                id: branch._id,
                                                                name: branch.branchName,
                                                            },
                                                        }}
                                                        passHref
                                                    >
                                                        <EditIcon />
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
                                                                    "هل تريد بالتأكيد حذف (الفرع)!؟",
                                                                content:
                                                                    "برجاء العلم انه عند تنفيذ هذا الإجراء سوف يتم حذف هذا الفرع نهائيا من قاعدة البيانات",
                                                                deleteType:
                                                                    "branch",
                                                                id: branch._id,
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
                                                            branch.openingStatus
                                                                ? "Active"
                                                                : "UnActive"
                                                        }
                                                        click={() => {
                                                            statusHandler(
                                                                branch._id,
                                                                !branch.openingStatus
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

export default Branches;

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
