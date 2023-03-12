import { createSlice } from "@reduxjs/toolkit";

import {
    deleteUser,
    deleteBranch,
    deleteCategory,
    deleteItem,
    deletePayment,
    deleteUnit,
} from "../Actions/delete";

const initialState = {
    overlay: false,
    deleteBox: false,
    deleteMessage: "",
    deleteStatus: "",
    deleteBoxData: {
        heading: "",
        content: "",
    },
    deleteType: "",
    user: {
        id: "",
    },
    category: {
        id: "",
    },
    item: {
        id: "",
    },
    unit: {
        id: "",
    },
    branch: {
        id: "",
    },
    payment: {
        id: "",
    },
};

const deleteAll = createSlice({
    name: "deleteAll",
    initialState: {
        ...initialState,
    },
    reducers: {
        showOverlay: (state, action) => {
            state.overlay = true;
            state.deleteBox = true;
            state.deleteBoxData = {
                heading: action?.payload?.heading || "قم بتأكيد الحذف",
                content:
                    action?.payload?.content ||
                    "برجاء العلم انه عند الحذف سيتم حذف هذا العنصر نهائيا من قاعدة البيانات. هل ترغب في المتابعة؟",
            };
            state.deleteType = action?.payload?.deleteType || "";
            state[action.payload.deleteType].id = action?.payload?.id || "";
        },
        cancel_delete: (state) => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(deleteUser.fulfilled, (state, action) => {
            return {
                ...initialState,
                deleteMessage: "User Deleted Successfully",
                deleteStatus: "success",
            };
        });
        builder.addCase(deleteUser.rejected, (state, action) => {
            return {
                ...initialState,
                deleteMessage: "Something went wrong while deleting user",
                deleteStatus: "error",
            };
        });
        builder.addCase(deleteCategory.fulfilled, (state, action) => {
            return {
                ...initialState,
                deleteMessage: "Category Deleted Successfully",
                deleteStatus: "success",
            };
        });
        builder.addCase(deleteCategory.rejected, (state, action) => {
            return {
                ...initialState,
                deleteMessage: "Something went wrong while deleting category",
                deleteStatus: "error",
            };
        });
        builder.addCase(deleteItem.fulfilled, (state, action) => {
            return {
                ...initialState,
                deleteMessage: "Item Deleted Successfully",
                deleteStatus: "success",
            };
        });
        builder.addCase(deleteItem.rejected, (state, action) => {
            return {
                ...initialState,
                deleteMessage: "Something went wrong while deleting item",
                deleteStatus: "error",
            };
        });
        builder.addCase(deleteUnit.fulfilled, (state, action) => {
            return {
                ...initialState,
                deleteMessage: "Unit Deleted Successfully",
                deleteStatus: "success",
            };
        });
        builder.addCase(deleteUnit.rejected, (state, action) => {
            return {
                ...initialState,
                deleteMessage: "Something went wrong while deleting Unit",
                deleteStatus: "error",
            };
        });
        builder.addCase(deleteBranch.fulfilled, (state, action) => {
            return {
                ...initialState,
                deleteMessage: "Branch Deleted Successfully",
                deleteStatus: "success",
            };
        });
        builder.addCase(deleteBranch.rejected, (state, action) => {
            return {
                ...initialState,
                deleteMessage: "Something went wrong while deleting Branch",
                deleteStatus: "error",
            };
        });
        builder.addCase(deletePayment.fulfilled, (state, action) => {
            return {
                ...initialState,
                deleteMessage: "Payment Method Deleted Successfully",
                deleteStatus: "success",
            };
        });
        builder.addCase(deletePayment.rejected, (state, action) => {
            return {
                ...initialState,
                deleteMessage: "Something went wrong while deleting the Payment Method",
                deleteStatus: "error",
            };
        });
    },
});

export const { showOverlay, cancel_delete } = deleteAll.actions;

export default deleteAll;
