import React, {useEffect, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/router";
import classes from './CreateButton.module.scss';
//Redux
import {useDispatch, useSelector} from "react-redux";
import {ResetAll} from "@/Redux/Reducers/HomeReducer";
//Axios
import axios from "axios";
//Notifications
import {toast} from "react-toastify";


function CreateButton() {

    //ROUTER
    const router = useRouter();

    //States
    const [branchName, setBranchName] = useState('');

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
            clientArea: {id: AreaId},
        }
    } = useSelector(state => state.home)

    let ArrayOfProducts = Items.map((cur, i) => {
        return {
            itemId: cur.itemId,
            quantity: cur.quantity
        }
    });


    //Effect to redirect to choose the branch name if it's not found
    useEffect(() => {
        // GET THE BRANCH NAME FROM LOCALSTORAGE
        const branch_name = localStorage.getItem(`branch_name`);
        const role = localStorage.getItem(`role`);
        // Check if no Branch name Redirect to Choose branch name
        if ((!branch_name || branch_name === '') && role === 'callcenter') {
            router.push(`/callcenter/pos_name`)
        } else {
            setBranchName(branch_name);
        }
    }, [])


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
            flag: branchName
        }

        // Send the Create Request
        axios.post(`https://baharapi.kportals.net/api/v1/create/order`, dataObj, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(res => {
                dispatch(ResetAll());
                // Clear the branch name and redirect
                localStorage.removeItem(`branch_name`);
                // Redirect
                router.push(`/callcenter/pos_name`)
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <button className={classes.Create} onClick={createOrderHandler}>
            إرسال
            <Image
                src={"/Icons/OrderIcon.svg"}
                width={20}
                height={20}
                alt={"order icon"}
            />
        </button>
    );
}

export default CreateButton;
