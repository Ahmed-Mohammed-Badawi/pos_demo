import React, { useState, useEffect } from "react";
import classes from "@/styles/create_Item.module.scss";
import { useRouter } from "next/router";
import Head from "next/head";
// Imports
import BackButton from "@/components/Admin/Dashboard/BackButton/BackButton";
import CustomSelect from "@/components/Admin/Dashboard/CustomSelect/CustomSelect";
import UploadImageInput from "@/components/Admin/Dashboard/uploadImageInput/uploadImageInput";
import Spinner from "@/components/Spinner/Spinner";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { itemChanged, itemsClear } from "@/Redux/Reducers/AdminFormsReducer";

//Axios
import axios from "axios";
// Notifications
import { toast } from "react-toastify";

function Create() {
    // Router
    const router = useRouter();

    // State of the Image file
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);

    // Redux
    const dispatch = useDispatch();
    const { itemName, itemPrice, itemUnit, itemCategory } = useSelector(
        (state) => state.adminforms.items
    );

    // get All the Categories
    useEffect(() => {
        axios
            .get("https://posapi.kportals.net/api/v1/get/all/categories", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => {
                // convert obj keys _id to value && categoryName to label
                const categories_new = res.data.categories.map((category) => {
                    return {
                        value: category._id,
                        label: category.categoryName,
                    };
                });
                setCategories(categories_new);
            })
            .catch((err) => {
                toast.error(err.response.data.message || err.message);
            });
    }, [dispatch]);

    // get All the Units

    useEffect(() => {
        axios
            .get(`https://posapi.kportals.net/api/v1/get/all/units`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => {
                // convert obj keys _id to value && categoryName to label
                const units_new = res.data.units.map((unit) => {
                    return {
                        value: unit._id,
                        label: unit.unitName,
                    };
                });
                setUnits(units_new);
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || err.message);
            });
    }, [dispatch]);

    // Function to get the selected unit || category based on the value
    const getUnitOrCategory = (section, value) => {
        const selectedItem = section.find((item) => item.value === value);
        return selectedItem;
    };

    // Submit handler
    const submitHandler = (e) => {
        // prevent Default
        e.preventDefault();
        // check if items data is not empty
        if (
            itemName === "" ||
            itemPrice === "" ||
            itemUnit === "" ||
            itemCategory === ""
        ) {
            toast.error("Please fill all the fields");
            return;
        }

        // Put all the items in formDate
        const create_formData = new FormData();
        create_formData.append("file", image);
        create_formData.append("itemTitle", itemName);
        create_formData.append("itemPrice", itemPrice);
        create_formData.append("unitId", itemUnit);
        create_formData.append("categoryId", itemCategory);

        // set the loading state
        setLoading(true);
        // send the request
        axios
            .post(
                `https://posapi.kportals.net/api/v1/create/item`,
                create_formData,
                {
                    headers: {
                        // set the headers with the Authorization
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            )
            .then((res) => {
                // set the loading state
                setLoading(false);
                // redirect to the products
                router.push("/admin/products/items");
                // clear the form
                dispatch(itemsClear());
            })
            .catch((err) => {
                // set the loading state
                setLoading(false);
                toast.error(err.response?.data?.message || err.message);
            });
    };

    return (
        <>
            <Head>
                <title>Create Item</title>
                <meta name='description' content='Create Item' />
            </Head>
            <section className={classes.createItem}>
                <div className={classes.createItem__container}>
                    <div className={classes.createItem__header}>
                        <h2 className={classes.createItem__title}>
                            إنشاء منتَج
                        </h2>
                        <BackButton
                            click={() => {
                                dispatch(itemsClear());
                                router.push("/admin/products/items");
                            }}
                        />
                    </div>
                    <form
                        className={classes.createItem__form}
                        onSubmit={submitHandler}
                    >
                        <div className={classes.createItem__formGroup}>
                            <div
                                className={classes.createItem__input_container}
                            >
                                <label htmlFor='itemName'>
                                    اسم المنتَج: <span>*</span>
                                </label>
                                <input
                                    id='itemName'
                                    type='text'
                                    autoComplete='off'
                                    placeholder='اسم المنتج'
                                    className={classes.createItem__input}
                                    value={itemName}
                                    onChange={(e) => {
                                        dispatch(
                                            itemChanged({
                                                key: "itemName",
                                                value: e.target.value,
                                            })
                                        );
                                    }}
                                />
                            </div>
                            <div
                                className={classes.createItem__input_container}
                            >
                                <label htmlFor='itemPrice'>
                                    سعر المنتَج: <span>*</span>
                                </label>
                                <input
                                    id='itemPrice'
                                    type='number'
                                    autoComplete='off'
                                    placeholder='سعر المنتج'
                                    className={classes.createItem__input}
                                    value={itemPrice}
                                    onChange={(e) => {
                                        dispatch(
                                            itemChanged({
                                                key: "itemPrice",
                                                value: e.target.value,
                                            })
                                        );
                                    }}
                                />
                            </div>
                        </div>
                        <div className={classes.createItem__formGroup}>
                            <div
                                className={classes.createItem__input_container}
                            >
                                <label htmlFor='itemUnit'>
                                    الوحدة المستخدمة: <span>*</span>
                                </label>
                                <CustomSelect
                                    label={"اقل وحدة قياس المنتَج"}
                                    arrOfValue={units}
                                    change={(options) => {
                                        dispatch(
                                            itemChanged({
                                                key: "itemUnit",
                                                value: options?.value
                                                    ? options.value
                                                    : "",
                                            })
                                        );
                                    }}
                                    selectedValue={getUnitOrCategory(
                                        units,
                                        itemUnit
                                    )}
                                />
                            </div>
                            <div
                                className={classes.createItem__input_container}
                            >
                                <label htmlFor='itemCategory'>
                                    القسم: <span>*</span>
                                </label>
                                <CustomSelect
                                    arrOfValue={categories}
                                    change={(options) => {
                                        dispatch(
                                            itemChanged({
                                                key: "itemCategory",
                                                value: options?.value
                                                    ? options.value
                                                    : "",
                                            })
                                        );
                                    }}
                                    label={"اسم القسم"}
                                    selectedValue={getUnitOrCategory(
                                        categories,
                                        itemCategory
                                    )}
                                />
                            </div>
                        </div>
                        <div className={classes.createItem__input_container}>
                            <label htmlFor='categoryName'>
                                صورة المنتَج: <span>*</span>
                            </label>
                            <UploadImageInput
                                change={(e) => setImage(e.target.files[0])}
                            />
                        </div>
                        <button type='submit'>
                            {loading ? <Spinner width={`2rem`} /> : "إنشاء"}
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
}

export default Create;

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
