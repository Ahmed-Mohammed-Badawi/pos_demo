import React, { useEffect } from "react";
import classes from "@/styles/units.module.scss";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
// Imports
import CreateButton from "@/components/Admin/layout/CreateButton/CreateButton";
import SearchInput from "@/components/Admin/layout/SearchInput/SearchInput";
import EditIcon from "@/components/SVGS/EditIcon";
import DeleteIcon from "@/components/SVGS/DeleteIcon";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { showOverlay } from "@/Redux/Reducers/Delete_all__Reducer";
import { setUnits } from "@/Redux/Reducers/TablesReducer";
import { setDefaultUnit } from "@/Redux/Reducers/AdminFormsEditReducer";

// Axios
import axios from "axios";
// Notifications
import { toast } from "react-toastify";

function Units() {
    // Router
    const router = useRouter();

    // Redux
    const dispatch = useDispatch();
    const { units } = useSelector((state) => state.tables);

    useEffect(() => {
        axios
            .get(`https://baharapi.kportals.net/api/v1/get/all/units`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => {
                dispatch(setUnits(res.data.units));
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || err.message);
            });
    }, [dispatch]);

    return (
        <>
            <Head>
                <title>Units</title>
                <meta name='description' content='Units' />
            </Head>
            <section className={classes.Units}>
                <div className={classes.Top}>
                    <CreateButton
                        click={() => router.push("/admin/products/create_unit")}
                    />
                    <SearchInput />
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
                                اسم وحدة القياس
                            </span>
                            <span
                                className={[
                                    classes.Head_Title,
                                    classes.Cell,
                                ].join(" ")}
                            >
                                اقل قيمة للوحدة (للبيع)
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
                            {units &&
                                units.map((unit) => {
                                    return (
                                        <div
                                            className={classes.Row}
                                            key={unit._id}
                                        >
                                            <span className={classes.Cell_TD}>
                                                {unit.unitName}
                                            </span>
                                            <span className={classes.Cell_TD}>
                                                {`${unit.unitValue} ${unit.unitName}`}
                                            </span>
                                            <span className={classes.Cell_TD}>
                                                <span
                                                    className={
                                                        classes.IconContainer
                                                    }
                                                    onClick={() => {
                                                        dispatch(
                                                            setDefaultUnit({
                                                                unitName:
                                                                    unit.unitName,
                                                                minUnit:
                                                                    unit.unitValue,
                                                            })
                                                        );
                                                    }}
                                                >
                                                    <Link
                                                        href={{
                                                            pathname:
                                                                "/admin/products/edit_unit",
                                                            query: {
                                                                id: unit._id,
                                                                name: unit.unitName,
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
                                                                    "هل تريد بالتأكيد حذف (الوحدة)!؟",
                                                                content:
                                                                    "برجاء العلم انه عند تنفيذ هذا الإجراء سوف يتم حذف هذه الوحدةِ نهائيا من قاعدة البيانات",
                                                                deleteType:
                                                                    "unit",
                                                                id: unit._id,
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
            </section>
        </>
    );
}

export default Units;

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
