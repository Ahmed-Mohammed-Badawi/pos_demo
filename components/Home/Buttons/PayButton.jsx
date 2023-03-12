import React from "react";
import Image from "next/image";
import classes from "./PayButton.module.scss";
//Redux
import { useSelector, useDispatch } from "react-redux";
import { ResetAll } from "@/Redux/Reducers/HomeReducer";
//Notifications
import { toast } from "react-toastify";
//Axios
import axios from "axios";

function PayButton({ roleValue }) {
    //Redux
    const dispatch = useDispatch();

    const {
        Items,
        InputsData: {
            ClientId,
            PhoneNumber,
            ClientName,
            ClientAddress,
            Delivery,
            insideTheResturant,
            clientArea: { id: AreaId },
            paymentMethod: { label: paymentLabel },
        },
    } = useSelector((state) => state.home);

    let ArrayOfProducts = Items.map((cur, i) => {
        return {
            itemId: cur.itemId,
            quantity: cur.quantity,
        };
    });

    function createOrderHandler(e) {
        // stop reloading
        e.preventDefault();
        // Check if the data is not empty
        if (!PhoneNumber || PhoneNumber.length <= 6) {
            toast.error(`Please Enter a valid Phone Number`);
            return;
        }

        if (!ClientName || ClientName?.length <= 3) {
            toast.error(`Please Enter a valid Name`);
            return;
        }

        if (!ClientAddress || ClientAddress?.length <= 3) {
            toast.error(`Please Enter a valid Address`);
            return;
        }

        if (!AreaId || AreaId.length < 10) {
            toast.error(`Please Select a branch name`);
            return;
        }

        if (!paymentLabel || paymentLabel === "") {
            toast.error(`Please Select the payment Method`);
            return;
        }

        if (!ArrayOfProducts || ArrayOfProducts.length < 1) {
            toast.error(`Can not send an empty order`);
            return;
        }

        // Make the object of request data
        const dataObj = {
            clientId: ClientId,
            phoneNumber: PhoneNumber,
            clientName: ClientName,
            clientAddress: ClientAddress,
            branchId: AreaId,
            orderDetails: ArrayOfProducts,
            deliveryFees: Delivery,
            paymentMethod: paymentLabel,
            takeaway: insideTheResturant,
        };

        // Send the Create Request
        axios
            .post(
                `https://baharapi.kportals.net/api/v1/cashier/create/order`,
                dataObj,
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
                window.open(res.data.receipt, "_blank");
                dispatch(ResetAll(roleValue));
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.response.data.message || res.message);
            });
    }

    return (
        <button className={classes.Pay} onClick={createOrderHandler}>
            دفع
            <Image
                src={"/Icons/OrderIcon.svg"}
                width={20}
                height={20}
                alt={"order icon"}
            />
        </button>
    );
}

export default PayButton;
