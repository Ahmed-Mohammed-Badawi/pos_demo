import { createSlice } from "@reduxjs/toolkit";

const AdminFormsEditReducer = createSlice({
    name: "AdminEdit",
    initialState: {
        categories: {
            categoryName: "",
        },
        items: {
            itemName: "",
            itemPrice: "",
            itemUnit: "",
            itemCategory: "",
        },
        branches: {
            branchName: "",
            branchAddress: "",
            branchArea: "",
        },
        users: {
            user_name: "",
            userName: "",
            userPassword: "",
            userPasswordConfirm: "",
            userRole: "",
            userBranch: "",
        },
        payments: {
            paymentName: "",
        },
        units: {
            unitName: "",
            minUnit: "",
        },
    },
    reducers: {
        categoryItemChanged: (state, action) => {
            state.categories.categoryName = action.payload.value;
        },
        clearCategory: (state) => {
            state.categories.categoryName = "";
        },
        setDefaultItem: (state, action) => {
            state.items.itemName = action.payload.itemName;
            state.items.itemPrice = action.payload.itemPrice;
            state.items.itemUnit = action.payload.itemUnit;
            state.items.itemCategory = action.payload.itemCategory;
        },
        itemChanged: (state, action) => {
            state.items[action.payload.key] = action.payload.value;
        },
        cleaItem: (state) => {
            state.items.itemName = "";
            state.items.itemPrice = "";
            state.items.itemUnit = "";
            state.items.itemCategory = "";
        },
        branchItemChanged: (state, action) => {
            state.branches[action.payload.key] = action.payload.value;
        },
        setDefaultBranch: (state, action) => {
            state.branches.branchName = action.payload.branchName;
            state.branches.branchAddress = action.payload.branchAddress;
            state.branches.branchArea = action.payload.branchArea;
        },
        clearBranch: (state) => {
            state.branches.branchName = "";
            state.branches.branchAddress = "";
            state.branches.branchArea = "";
        },
        userItemChanged: (state, action) => {
            state.users[action.payload.key] = action.payload.value;
        },
        setDefaultUser: (state, action) => {
            state.users.user_name = action.payload.user_name;
            state.users.userName = action.payload.userName;
            state.users.userRole = action.payload.userRole;
            state.users.userBranch = action.payload.userBranch;
        },
        clearUser: (state) => {
            state.users.user_name = "";
            state.users.userName = "";
            state.users.userPassword = "";
            state.users.userPasswordConfirm = "";
            state.users.userRole = "";
            state.users.userBranch = "";
        },
        paymentItemChanged: (state, action) => {
            state.payments[action.payload.key] = action.payload.value;
        },
        clearPayment: (state) => {
            state.payments.paymentName = "";
        },
        setDefaultUnit: (state, action) => {
            state.units.unitName = action.payload.unitName;
            state.units.minUnit = action.payload.minUnit;
        },
        unitItemChanged: (state, action) => {
            state.units[action.payload.key] = action.payload.value;
        },
        clearUnit: (state) => {
            state.units.unitName = "";
            state.units.minUnit = "";
        },
    },
});

export const {
    categoryItemChanged,
    setDefaultItem,
    itemChanged,
    branchItemChanged,
    setDefaultBranch,
    userItemChanged,
    setDefaultUser,
    paymentItemChanged,
    unitItemChanged,
    setDefaultUnit,
    // Clears
    cleaItem,
    clearBranch,
    clearCategory,
    clearPayment,
    clearUnit,
    clearUser,
} = AdminFormsEditReducer.actions;

export default AdminFormsEditReducer;
