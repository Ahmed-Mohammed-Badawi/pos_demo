import React, {useEffect, useState} from "react";
import classes from "@/styles/create_payment.module.scss";
import classes2 from "@/styles/reports.module.scss";
import { useRouter } from "next/router";
import Head from "next/head";
// Imports
import BackButton from "@/components/Admin/Dashboard/BackButton/BackButton";
import Spinner from "@/components/Spinner/Spinner";

// Redux
import { useSelector, useDispatch } from "react-redux";
import {
    setMealsReport,
    mealsReportClear
} from "@/Redux/Reducers/AdminFormsReducer";
// Axios
import axios from "axios";
// Notifications
import { toast } from "react-toastify";
import CustomSelect from "@/components/Admin/Dashboard/CustomSelect/CustomSelect";

function Meals() {
    // Router
    const router = useRouter();

    // State
    const [loading, setLoading] = useState(false);
    const [branches, setBranches] = useState([]);


    // Redux
    const dispatch = useDispatch();
    const { startingFrom, branchId, endDate } = useSelector((state) => state.adminforms.reports.mealsReport);


    // Function to get the object with the same id
    const getSelectedItem = (value, list) => {
        const selectedItem = list.find((item) => item.value === value);
        return selectedItem;
    };

    // Submit handler
    function submitHandler(e) {
        // Prevent default
        e.preventDefault();
        // Check if payment name is empty
        if (startingFrom === "" || branchId === "" || endDate === "") {
            toast.error("Please fill All Fields");
            return;
        }
        // Set the loading state
        setLoading(true);
        // Send the request
        axios
            .get(
                `https://baharapi.kportals.net/api/v1/best/seller/meal`,
                {
                    params: {
                        dateFrom: startingFrom,
                        dateTo: endDate,
                        branchId: branchId
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            )
            .then((res) => {
                // set the loading state
                setLoading(false);
                // Open report in new tab
                window.open(res.data.report, '_blank')
                // redirect to the products
                router.push("/admin");
                // clear the form
                dispatch(mealsReportClear());
            })
            .catch((err) => {
                // set the loading state
                setLoading(false);
                toast.error(err.response?.data?.message || err.message);
            });
    }

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
                <title>Orders Report</title>
                <meta name='description' content='Get Orders Report By Date' />
            </Head>
            <section className={classes.createPayment}>
                <div className={classes.createPayment__container}>
                    <div className={classes.createPayment__header}>
                        <h2 className={classes.createPayment__title}>
                            تقارير الوجبات
                        </h2>
                        <BackButton
                            click={() => {
                                dispatch(mealsReportClear());
                                router.push("/admin");
                            }}
                        />
                    </div>
                    <form
                        className={classes.createPayment__form}
                        onSubmit={submitHandler}
                    >
                        <div className={classes.createPayment__input_container}>
                            <label htmlFor='startingDate'>
                                تاريخ الابتداء: <span>*</span>
                            </label>
                            <input
                                id='startingDate'
                                type='date'
                                placeholder='تاريخ الابتداء'
                                className={classes.createPayment__input}
                                value={startingFrom}
                                onChange={(e) => {
                                    dispatch(
                                        setMealsReport({
                                            key: "startingFrom",
                                            value: e.target.value,
                                        })
                                    );
                                }}
                            />
                        </div>
                        <div className={classes.createPayment__input_container}>
                            <label htmlFor='endDate'>
                                تاريخ الانتهاء: <span>*</span>
                            </label>
                            <input
                                id='endDate'
                                type='date'
                                placeholder='تاريخ الانتهاء'
                                className={classes.createPayment__input}
                                value={endDate}
                                onChange={(e) => {
                                    dispatch(
                                        setMealsReport({
                                            key: "endDate",
                                            value: e.target.value,
                                        })
                                    );
                                }}
                            />
                        </div>
                        <div
                            className={classes2.createUser__input_container}
                        >
                            <label htmlFor={"userBranch"}>
                                الفَرع: <span>*</span>
                            </label>
                            <CustomSelect
                                label={"الفَرع"}
                                arrOfValue={branches}
                                change={(options) => {
                                    dispatch(
                                        setMealsReport({
                                            key: "branchId",
                                            value: options?.value
                                                ? options.value
                                                : "",
                                        })
                                    );
                                }}
                                selectedValue={getSelectedItem(
                                    branchId,
                                    branches
                                )}
                            />
                        </div>
                        <button type='submit'>
                            {loading ? <Spinner width={"2rem"} /> : "متابعة"}
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
}

export default Meals;

// Serverside function
export async function getServerSideProps(context) {
    // get the role and authenticated from cookie
    const cookie = context.req.headers.cookie;
    // get the role and authenticated from cookie
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
