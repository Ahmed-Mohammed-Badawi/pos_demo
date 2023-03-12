import React, { useEffect, useState } from "react";
import classes from "@/styles/Products.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
// Imports
import CreateButton from "@/components/Admin/layout/CreateButton/CreateButton";
import SearchInput from "@/components/Admin/layout/SearchInput/SearchInput";
import EditIcon from "@/components/SVGS/EditIcon";
import DeleteIcon from "@/components/SVGS/DeleteIcon";
import Pagination from "@/components/Admin/layout/PaginationTransparent/Pagination";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { showOverlay } from "@/Redux/Reducers/Delete_all__Reducer";
import { categoryItemChanged } from "@/Redux/Reducers/AdminFormsEditReducer";
import { setCategories } from "@/Redux/Reducers/TablesReducer";

//Axios
import axios from "axios";
// Notifications
import { toast } from "react-toastify";
// Search

function Categories() {
    // Router
    const router = useRouter();

    // States
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Redux
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.tables);

    useEffect(() => {
        axios
            .get(
                `https://baharapi.kportals.net/api/v1/get/categories?page=${currentPage}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            )
            .then((res) => {
                dispatch(setCategories(res.data.data.categories));
                setHasNextPage(res.data.data.hasNextPage);
                setHasPreviousPage(res.data.data.hasPreviousPage);
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || err.message);
            });
    }, [currentPage, dispatch]);

    return (
        <>
            <Head>
                <title>Categories</title>
                <meta name='description' content='Categories' />
            </Head>
            <section className={classes.Products}>
                <div className={classes.Top}>
                    <CreateButton
                        click={() =>
                            router.push("/admin/products/create_category")
                        }
                    />
                    <SearchInput searchSection={"categories"} />
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
                                القسم
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
                            {categories &&
                                categories.map((category) => {
                                    return (
                                        <div
                                            key={category._id}
                                            className={classes.Row}
                                        >
                                            <span className={classes.Cell_TD}>
                                                {category.categoryName}
                                            </span>
                                            <span className={classes.Cell_TD}>
                                                <span
                                                    className={
                                                        classes.IconContainer
                                                    }
                                                    onClick={() => {
                                                        dispatch(
                                                            categoryItemChanged(
                                                                {
                                                                    value: category.categoryName,
                                                                }
                                                            )
                                                        );
                                                    }}
                                                >
                                                    <Link
                                                        href={{
                                                            pathname:
                                                                "/admin/products/edit_category",
                                                            query: {
                                                                id: category._id,
                                                                name: category.categoryName,
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
                                                    onClick={() =>
                                                        dispatch(
                                                            showOverlay({
                                                                heading:
                                                                    "هل تريد بالتأكيد حذف القسم!؟",
                                                                content:
                                                                    "برجاء العلم انه عند تنفيذ هذا الإجراء سوف يتم حذف هذا القسم نهائيا من قاعدة البيانات",
                                                                deleteType:
                                                                    "category",
                                                                id: category._id,
                                                            })
                                                        )
                                                    }
                                                >
                                                    <DeleteIcon />
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

export default Categories;

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
