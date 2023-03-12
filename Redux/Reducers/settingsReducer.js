import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
    name: "settings",
    initialState: {
        taxAmount: 0,
        discount: {
            amount: 0,
            type: "",
        },
    },
    reducers: {
        setTaxAmount: (state, action) => {
            state.taxAmount = action.payload.value;
        },
        clearTaxAmount: (state) => {
            state.taxAmount = 0;
        },
        setDiscount: (state, action) => {
            state.discount[action.payload.key] = action.payload.value;
        },
        clearDiscount: (state) => {
            state.discount = {
                amount: 0,
                type: "",
            };
        },
    },
});

export const { setTaxAmount, clearTaxAmount, setDiscount, clearDiscount } =
    settingsSlice.actions;
export default settingsSlice;
