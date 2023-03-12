import React, { useState } from "react";
import classes from "@/styles/create_category.module.scss";
import { useRouter } from "next/router";
import Head from "next/head";
// Imports
import BackButton from "@/components/Admin/Dashboard/BackButton/BackButton";
import CustomSelect from "@/components/Admin/Dashboard/CustomSelect/CustomSelect";
import Spinner from "@/components/Spinner/Spinner";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { setDiscount, clearDiscount } from "@/Redux/Reducers/settingsReducer";

// Axios
import axios from "axios";
// Notifications
import { toast } from "react-toastify";

function Discount() {
    // Router
    const router = useRouter();

    // states
    const [loading, setLoading] = useState(false);

    // Redux
    const dispatch = useDispatch();
    const { amount, type } = useSelector((state) => state.settings.discount);

    // Submit handler
    const submitHandler = (e) => {
        // prevent Default
        e.preventDefault();
        // check if any input is empty
        if (amount === "" || type === "") {
            toast.error("Please fill all the fields");
            return;
        }

        // check if discount is not a number
        if (isNaN(amount)) {
            toast.error("Discount must be a number");
            return;
        }

        // Set the loading state
        setLoading(true);

        // Send the REquest
        axios
            .post(
                `https://posapi.kportals.net/api/v1/set/discount`,
                {
                    discountType: type,
                    discountAmount: amount,
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
                // Set the loading state
                setLoading(false);

                // Clear the Tax Amount
                dispatch(clearDiscount());

                // Redirect to the Dashboard
                router.push("/admin");
            })
            .catch((err) => {
                // Set the loading state
                setLoading(false);
                //  toast the error
                toast.error(err.response.data.message || err.message);
            });
    };

    const DiscountOptions = [
        {
            value: "ratio",
            label: "نسبة مئوية",
        },
        {
            value: "fixed",
            label: "قيمة ثابتة",
        },
    ];

    // get an object from DummyOptions by only value
    const getDummyOption = (value) => {
        if (value === "") {
            return "";
        } else {
            return DiscountOptions.find((option) => option.value === value);
        }
    };

    return (
        <>
            <Head>
                <title>Discount</title>
                <meta name='description' content='Discount' />
            </Head>
            <section className={classes.createCategory}>
                <div className={classes.createCategory__container}>
                    <div className={classes.createCategory__header}>
                        <h2 className={classes.createCategory__title}>
                            الخَصم
                        </h2>
                        <BackButton
                            click={() => {
                                dispatch(clearDiscount());
                                router.push("/admin/products");
                            }}
                        />
                    </div>
                    <form
                        className={classes.createCategory__form}
                        onSubmit={submitHandler}
                    >
                        <div
                            className={classes.createCategory__input_container}
                            style={{ marginBottom: "20px" }}
                        >
                            <label htmlFor='type'>
                                نوع الخَصم: <span>*</span>
                            </label>
                            <CustomSelect
                                change={(opt) =>
                                    dispatch(
                                        setDiscount({
                                            key: "type",
                                            value: opt?.value ? opt.value : "",
                                        })
                                    )
                                }
                                label='نوع الخصم'
                                arrOfValue={DiscountOptions}
                                selectedValue={getDummyOption(type)}
                            />
                        </div>
                        <div
                            className={classes.createCategory__input_container}
                        >
                            <label htmlFor='amount'>
                                القيمة: <span>*</span>
                            </label>
                            <input
                                id='amount'
                                type='number'
                                step={".01"}
                                min={"0"}
                                placeholder='قيمة الخصم'
                                className={classes.createCategory__input}
                                value={amount}
                                onChange={(e) => {
                                    dispatch(
                                        setDiscount({
                                            key: "amount",
                                            value: e.target.value,
                                        })
                                    );
                                }}
                            />
                        </div>
                        <button type='submit'>
                            {loading ? <Spinner width={"2rem"} /> : "حفظ"}
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
}

export default Discount;

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
