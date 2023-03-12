import { createSlice } from "@reduxjs/toolkit";
// Async Search function
import fetchData from "../Actions/search";

const TablesSlice = createSlice({
    name: "tables",
    initialState: {
        categories: [],
        items: [],
        units: [],
        branches: [],
        users: [],
        payments: [],
    },
    reducers: {
        setCategories: (state, action) => {
            state.categories = action.payload;
        },
        setItems: (state, action) => {
            state.items = action.payload;
        },
        setUnits: (state, action) => {
            state.units = action.payload;
        },
        setBranches: (state, action) => {
            state.branches = action.payload;
        },
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        setPayments: (state, action) => {
            state.payments = action.payload;
        },
        // Remove
        removeById: (state, action) => {
            // get the id and section from the payload
            const { id, section } = action.payload;

            console.log(section);
            // find the section equal name in the state and search for item by id
            const items = state[section].filter((item) => item._id !== id);
            // set the new array
            state[section] = items;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchData.fulfilled, (state, action) => {
            // Extract the data from the payload
            const { result, category } = action.payload;
            // check whitch category should we set the result in
            if (category === "categories") {
                state.categories = result;
            } else if (category === "items") {
                state.items = result;
            } else if (category === "branches") {
                state.branches = result;
            } else if (category === "users") {
                state.users = result;
            } else {
                state;
            }
        });
    },
});

export const {
    setCategories,
    removeById,
    setItems,
    setUnits,
    setBranches,
    setUsers,
    setPayments,
} = TablesSlice.actions;
export default TablesSlice;
