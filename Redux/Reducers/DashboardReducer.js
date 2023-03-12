//Redux
import { createSlice } from "@reduxjs/toolkit";

const DashboardReducer = createSlice({
    name: "dashboard",
    initialState: {
        AsideMini: false,
    },
    reducers: {
        toggleAsideSize: (state, action) => {
            state.AsideMini = !state.AsideMini;
        },
    },
});

export const { toggleAsideSize } = DashboardReducer.actions;

export default DashboardReducer;
