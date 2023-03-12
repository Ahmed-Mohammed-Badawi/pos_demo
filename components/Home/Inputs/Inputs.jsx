import React, { useState, useEffect } from "react";
import classes from "./Inputs.module.scss";
import Image from "next/image";
//IMPORTS
import CustomSelect from "@/components/Admin/Dashboard/CustomSelect/CustomSelect";
// Redux
import { useSelector, useDispatch } from "react-redux";
import {
    changeInputData,
    setTotal,
    changeAreaSelect,
    changePaymentMethod,
    setClientInfo,
} from "@/Redux/Reducers/HomeReducer";
//Axios
import axios from "axios";

function Inputs({ roleValue }) {
    // REDUX
    const dispatch = useDispatch();
    const {
        Items,
        InputsData: {
            TaxAmount,
            Delivery,
            Sale,
            PhoneNumber,
            ClientName,
            ClientAddress,
            insideTheResturant,
            clientArea: { id },

            paymentMethod: { id: paymentId },
        },
        total,
    } = useSelector((state) => state.home);

    // States
    const [subTotal, setSubTotal] = useState(0);
    const [discountType, setDiscountType] = useState(null);
    const [branches, setBranches] = useState([]);
    const [areaStatus, setAreaStatus] = useState(true);
    const [payments, setPayments] = useState([]);

    // Effect
    useEffect(() => {
        // Calculate the Subtotal
        let counter = 0;
        Items.forEach((item, index) => {
            counter += item.total;
        });
        setSubTotal(counter);

        // Calculat the Total
        const TaxAmountRedux = +TaxAmount * counter;
        const DeliveryAmountRedux = +Delivery;
        let SaleAmount;

        if (discountType === "fixed") {
            SaleAmount = +Sale;
        }

        if (discountType === "ratio") {
            SaleAmount = +Sale * counter;
        }
        // Set the total Amount
        if (
            !isNaN(TaxAmountRedux) ||
            !isNaN(DeliveryAmountRedux) ||
            !isNaN(SaleAmount)
        ) {
            dispatch(
                setTotal({
                    total:
                        counter +
                        (TaxAmountRedux || 0) +
                        (DeliveryAmountRedux || 0) -
                        (SaleAmount || 0),
                })
            );
        }
    }, [Items, TaxAmount, Delivery, Sale, dispatch, total]);

    // Effect to get the settings && Branches && Payment Methods
    useEffect(() => {
        //Set the url based on who is login
        let url = `https://baharapi.kportals.net/api/v1/settings`;
        let branch_url = `https://baharapi.kportals.net/api/v1/branches`;

        if (roleValue === "cashier") {
            url = `https://baharapi.kportals.net/api/v1/cashier/settings`;
            branch_url = `https://baharapi.kportals.net/api/v1/cashier/branches`;
        }

        // Get Settings
        axios
            .get(`${url}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => {
                dispatch(
                    changeInputData({
                        inputName: "TaxAmount",
                        inputValue: res.data.settings.taxRate,
                    })
                );
                dispatch(
                    changeInputData({
                        inputName: "Sale",
                        inputValue: res.data.settings.discountAmount || 0,
                    })
                );
                setDiscountType(res.data.settings.discountType);
            })
            .catch((err) => {
                console.log(err);
            });

        // Get Branches
        axios
            .get(`${branch_url}`, {
                headers: {
                    "Content-Type": "application/json",
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
                // Set the tate
                setBranches(new_branches);
            })
            .catch((err) => {
                console.log(err);
            });

        //Check if the user is a cashier
        if (roleValue === "cashier") {
            // Get Payment Methods
            axios
                .get(
                    `https://baharapi.kportals.net/api/v1/cashier/payment/methods`,
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
                    // set every item to an object with value and label
                    const new_payments = res.data.payments.map((item) => {
                        return {
                            value: item._id,
                            label: item.paymentMethod,
                        };
                    });
                    // Set the tate
                    setPayments(new_payments);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, []);

    // Set the User Cashier Branch Id When Page Load
    useEffect(() => {
        if (roleValue === "cashier") {
            const branchId = localStorage.getItem("branch_id");

            dispatch(
                changeAreaSelect({
                    label: "",
                    id: branchId,
                })
            );
        }
    }, []);

    // Function to handle the change of inputs
    const handleChange = (event) => {
        dispatch(
            changeInputData({
                inputName: event.target.name,
                inputValue: event.target.value,
            })
        );
    };

    // Function to get the object with the same id
    const getSelectedItem = (value, list) => {
        const selectedItem = list.find((item) => item.value === value);
        return selectedItem || "";
    };

    //Effect to get the user info
    useEffect(() => {
        // Get user info url
        let url = `https://baharapi.kportals.net/api/v1/client/info?phoneNumber=`;
        //Check if user is a cashier
        if (roleValue === "cashier") {
            url = `https://baharapi.kportals.net/api/v1/cashier/client/info?phoneNumber=`;
        }

        if (PhoneNumber?.length >= 7) {
            const timer = setTimeout(() => {
                axios
                    .get(`${url}${PhoneNumber}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    })
                    .then((res) => {
                        // Set the client info
                        dispatch(
                            setClientInfo({
                                name: res.data.data.client.clientName,
                                address: res.data.data.client.clientAddress,
                                clientId: res.data.data.client._id,
                            })
                        );

                        if (roleValue !== "cashier") {
                            // set the Area Select Info
                            dispatch(
                                changeAreaSelect({
                                    label: res.data.data.branch.branchRegion,
                                    id: res.data.data.branch._id,
                                })
                            );
                        }
                    })
                    .catch((err) => {
                        //Set the Area status to false
                        if (err.response?.status === 404) {
                            setAreaStatus(false);
                        }
                    });
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [PhoneNumber]);

    //Effect to get the Area if the user was not in DB
    useEffect(() => {
        //Set the url
        let url = `https://baharapi.kportals.net/api/v1/recommend/branch?address=`;
        //check if user is a cashier
        if (roleValue === "cashier") {
            url = `https://baharapi.kportals.net/api/v1/cashier/recommend/branch?address=`;
        }

        if (
            ClientAddress !== "" &&
            areaStatus === false &&
            ClientAddress !== null
        ) {
            const AreaTimer = setTimeout(() => {
                axios
                    .get(`${url}${ClientAddress}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    })
                    .then((res) => {
                        // set the Area Select Info
                        dispatch(
                            changeAreaSelect({
                                label: res.data.branch.branchRegion,
                                id: res.data.branch._id,
                            })
                        );
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }, 1500);

            return () => clearTimeout(AreaTimer);
        }
    }, [ClientAddress]);

    return (
        <section className={classes.Container}>
            <section className={classes.Inputs}>
                <div className={classes.InputContainer}>
                    <input
                        type='tel'
                        className={classes.Input}
                        placeholder={"رقم الهاتف"}
                        name={"PhoneNumber"}
                        value={PhoneNumber != null ? PhoneNumber : ""}
                        onInput={handleChange}
                    />
                    <Image
                        src={"/Icons/Phone.svg"}
                        alt={"Phone icon"}
                        width={20}
                        height={20}
                        className={classes.Icon}
                    />
                </div>
                <div className={classes.InputContainer}>
                    <input
                        type='text'
                        className={classes.Input}
                        placeholder={"اسم العميل"}
                        name={"ClientName"}
                        value={ClientName != null ? ClientName : ""}
                        onInput={handleChange}
                    />
                    <Image
                        src={"/Icons/Client.svg"}
                        alt={"Client icon"}
                        width={20}
                        height={20}
                        className={classes.Icon}
                    />
                </div>
                <div className={classes.InputContainer}>
                    <input
                        type='text'
                        className={classes.Input}
                        placeholder={"العنوان"}
                        name={"ClientAddress"}
                        value={ClientAddress != null ? ClientAddress : ""}
                        onInput={handleChange}
                    />
                    <Image
                        src={"/Icons/Location.svg"}
                        alt={"Location icon"}
                        width={20}
                        height={20}
                        className={classes.Icon}
                    />
                </div>
                <div className={classes.InputContainer}>
                    <CustomSelect
                        label={"الفرع"}
                        arrOfValue={branches}
                        selectedValue={getSelectedItem(id, branches)}
                        disabled={roleValue === "cashier"}
                        change={(opt) => {
                            dispatch(
                                changeAreaSelect({
                                    label: opt?.label || "",
                                    id: opt?.value || "",
                                })
                            );
                        }}
                    />
                </div>
                {roleValue === "cashier" && (
                    <div className={classes.InputContainer}>
                        <CustomSelect
                            label={"وسيلة الدفع"}
                            arrOfValue={payments}
                            selectedValue={getSelectedItem(paymentId, payments)}
                            change={(opt) => {
                                dispatch(
                                    changePaymentMethod({
                                        label: opt?.label || "",
                                        id: opt?.value || "",
                                    })
                                );
                            }}
                        />
                    </div>
                )}
                <div className={classes.CHECKBOX}>
                    <label htmlFor='inside' dir='rtl'>
                        <input
                            type='checkbox'
                            id='inside'
                            checked={insideTheResturant}
                            name={"insideTheResturant"}
                            onChange={(e) => {
                                dispatch(
                                    changeInputData({
                                        inputName: "insideTheResturant",
                                        inputValue: !insideTheResturant,
                                    })
                                );
                            }}
                        />
                        <span className={classes.Checkbox}></span>
                        <span className={classes.Label_text}>في الصالة</span>
                    </label>
                </div>
            </section>
            <section className={classes.Inputs}>
                <div className={classes.InputContainer}>
                    <input
                        type='number'
                        className={classes.Input}
                        placeholder={"قيمة الضريبة"}
                        disabled
                        name={"TaxAmount"}
                        value={TaxAmount > 0 ? TaxAmount : ""}
                    />
                    <Image
                        src={"/Icons/Percent.svg"}
                        alt={"Percent icon"}
                        width={20}
                        height={20}
                        className={classes.Icon}
                    />
                </div>
                <div className={classes.InputContainer}>
                    <input
                        type='number'
                        className={classes.Input}
                        disabled
                        placeholder={"قيمة الخصم"}
                        value={Sale > 0 ? Sale : ""}
                        name={"Sale"}
                    />
                    <Image
                        src={
                            discountType === "fixed"
                                ? "/Icons/Dollar.svg"
                                : "/Icons/Percent.svg"
                        }
                        alt={"Dollar icon"}
                        width={20}
                        height={20}
                        className={classes.Icon}
                    />
                </div>
                <div className={classes.InputContainer}>
                    <input
                        type='number'
                        className={classes.Input}
                        placeholder={"قيمة التوصيل"}
                        value={Delivery > 0 ? Delivery : ""}
                        name={"Delivery"}
                        onInput={(e) => {
                            handleChange(e);

                            if (e.target.value >= 0) {
                                e.target.value = e.target.value;
                            } else {
                                e.target.value = 0;
                            }
                        }}
                    />
                    <Image
                        src={"/Icons/Dollar.svg"}
                        alt={"Dollar icon"}
                        width={20}
                        height={20}
                        className={classes.Icon}
                    />
                </div>

                <section className={classes.Info}>
                    <p className={classes.P2}>
                        المجموع الفرعي: <span>{subTotal.toFixed(3)} KWD</span>
                    </p>
                    <p className={classes.P3}>
                        المجموع الكلي: <span>{total.toFixed(3)} KWD</span>
                    </p>
                </section>
            </section>
        </section>
    );
}

export default Inputs;
