import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// delete user
const deleteUser = createAsyncThunk("user/deleteUser", async (id, thunkAPI) => {
    const data = await axios.delete(
        `https://baharapi.kportals.net/api/v1/remove/user?userId=${id}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
    return data;
});

// delete category
const deleteCategory = createAsyncThunk(
    "category/deleteCategory",
    async (id, thunkAPI) => {
        const data = await axios.delete(
            `https://baharapi.kportals.net/api/v1/remove/category?categoryId=${id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        return data;
    }
);

// delete item
const deleteItem = createAsyncThunk("Item/deleteItem", async (id, thunkAPI) => {
    const data = await axios.delete(
        `https://baharapi.kportals.net/api/v1/delete/item?itemId=${id}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
    return data;
});

// delete Unit
const deleteUnit = createAsyncThunk("Unit/deleteUnit", async (id, thunkAPI) => {
    const data = await axios.delete(
        `https://baharapi.kportals.net/api/v1/delete/unit?unitId=${id}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
    return data;
});

// delete Branch
const deleteBranch = createAsyncThunk(
    "Branch/deleteBranch",
    async (id, thunkAPI) => {
        const data = await axios.delete(
            `https://baharapi.kportals.net/api/v1/remove/branch?branchId=${id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        return data;
    }
);

// delete Payment
const deletePayment = createAsyncThunk(
    "Payment/deletePayment",
    async (id, thunkAPI) => {
        const data = await axios.delete(
            `https://baharapi.kportals.net/api/v1/delete/payment?paymentId=${id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        return data;
    }
);

export {
    deleteUser,
    deleteCategory,
    deleteItem,
    deleteUnit,
    deleteBranch,
    deletePayment,
};
