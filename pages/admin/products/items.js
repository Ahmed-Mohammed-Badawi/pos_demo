import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import classes from "@/styles/ProductItems.module.scss";
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
import { setDefaultItem } from "@/Redux/Reducers/AdminFormsEditReducer";
import { setItems } from "@/Redux/Reducers/TablesReducer";

//Axios
import axios from "axios";
// Notifications
import { toast } from "react-toastify";

function Dashboard() {
    // Router
    const router = useRouter();

    // States
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Redux
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.tables);

    useEffect(() => {
        axios
            .get(
                `https://posapi.kportals.net/api/v1/get/all/items?page=${currentPage}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            )
            .then((res) => {
                dispatch(setItems(res.data.data.items));
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
                <title>Items</title>
                <meta name='description' content='Items Table' />
            </Head>
            <section className={classes.ProductItems}>
                <div className={classes.Top}>
                    <CreateButton
                        click={() => router.push("/admin/products/create_Item")}
                    />
                    <SearchInput searchSection={"items"} />
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
                                المُنتَج
                            </span>
                            <span
                                className={[
                                    classes.Head_Title,
                                    classes.Cell,
                                ].join(" ")}
                            >
                                السعر
                            </span>
                            <span
                                className={[
                                    classes.Head_Title,
                                    classes.Cell,
                                ].join(" ")}
                            >
                                وحدة القياس
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
                            {items &&
                                items.map((item) => {
                                    return (
                                        <div
                                            className={classes.Row}
                                            key={item._id}
                                        >
                                            <span className={classes.Cell_TD}>
                                                <span
                                                    className={
                                                        classes.ItemImage
                                                    }
                                                >
                                                    <Image
                                                        src={item?.itemImage || '/Images/Image_notfound.png'}
                                                        width={60}
                                                        height={60}
                                                        alt={"Product Image"}
                                                    />
                                                </span>
                                                {item.itemTitle}
                                            </span>
                                            <span className={classes.Cell_TD}>
                                                KWD {Number(item.itemPrice).toFixed(3)}
                                            </span>
                                            <span className={classes.Cell_TD}>
                                                <span className={classes.Unit}>
                                                    {item?.unitId?.unitName &&
                                                        `${item?.unitId?.unitValue} 
                                                ${item?.unitId?.unitName}`}
                                                </span>
                                            </span>
                                            <span className={classes.Cell_TD}>
                                                <span
                                                    className={
                                                        classes.IconContainer
                                                    }
                                                    onClick={() => {
                                                        dispatch(
                                                            setDefaultItem({
                                                                itemName:
                                                                    item.itemTitle,
                                                                itemPrice:
                                                                    item.itemPrice,
                                                                itemUnit:
                                                                    item?.unitId
                                                                        ?._id,
                                                                itemCategory:
                                                                    item?.categoryId,
                                                            })
                                                        );
                                                    }}
                                                >
                                                    <Link
                                                        href={{
                                                            pathname:
                                                                "/admin/products/edit_item",
                                                            query: {
                                                                id: item._id,
                                                                name: item.itemTitle,
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
                                                                    "هل تريد بالتأكيد حذف المنتَج!؟",
                                                                content:
                                                                    "برجاء العلم انه عند تنفيذ هذا الإجراء سوف يتم حذف هذا المنتَج نهائيا من قاعدة البيانات",
                                                                deleteType:
                                                                    "item",
                                                                id: item._id,
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

export default Dashboard;

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
