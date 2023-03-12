//Redux
import { createSlice } from "@reduxjs/toolkit";

const AdminFormsReducer = createSlice({
    name: "adminforms",
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
        reports:{
            ordersReport: {
                startingFrom: '',
                endDate: '',
                branchId: '',
            },
            mealsReport:{
                startingFrom: '',
                endDate: '',
                branchId: '',
            }
        }
    },
    reducers: {
        categoryItemChanged: (state, action) => {
            state.categories.categoryName = action.payload.value;
        },
        categoriesClear: (state, action) => {
            state.categories.categoryName = "";
        },
        itemChanged: (state, action) => {
            state.items[action.payload.key] = action.payload.value;
        },
        itemsClear: (state, action) => {
            state.items.itemName = "";
            state.items.itemPrice = "";
            state.items.itemUnit = "";
            state.items.itemCategory = "";
        },
        branchItemChanged: (state, action) => {
            state.branches[action.payload.key] = action.payload.value;
        },
        branchItemsClear: (state, action) => {
            state.branches.branchName = "";
            state.branches.branchAddress = "";
            state.branches.branchArea = "";
        },
        userItemChanged: (state, action) => {
            state.users[action.payload.key] = action.payload.value;
        },
        userItemsClear: (state, action) => {
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
        paymentItemClear: (state, action) => {
            state.payments.paymentName = "";
        },
        unitItemChanged: (state, action) => {
            state.units[action.payload.key] = action.payload.value;
        },
        unitItemsClear: (state, action) => {
            state.units.unitName = "";
            state.units.minUnit = "";
        },
        setOrdersReport: (state, action) => {
            state.reports.ordersReport[action.payload.key] = action.payload.value
        },
        ordersReportClear: (state) => {
            state.reports.ordersReport.startingFrom = '';
            state.reports.ordersReport.endDate = '';
            state.reports.ordersReport.branchId = '';
        },
        setMealsReport: (state, action) => {
            state.reports.mealsReport[action.payload.key] = action.payload.value
        },
        mealsReportClear: (state) => {
            state.reports.mealsReport.startingFrom = '';
            state.reports.mealsReport.endDate = '';
            state.reports.mealsReport.branchId = '';
        },
    },
});

export const {
    categoryItemChanged,
    categoriesClear,
    itemChanged,
    itemsClear,
    branchItemChanged,
    branchItemsClear,
    userItemChanged,
    userItemsClear,
    paymentItemChanged,
    paymentItemClear,
    unitItemChanged,
    unitItemsClear,
    setMealsReport,
    ordersReportClear,
    setOrdersReport,
    mealsReportClear
} = AdminFormsReducer.actions;

export default AdminFormsReducer;
