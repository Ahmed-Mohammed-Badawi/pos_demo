import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
    name: "search",
    initialState: {
        searchKeyword: "",
        searchSection: "",
    },
    reducers: {
        onSearchKeywordChange: (state, action) => {
            // change the search keyword with the recieved value
            state.searchKeyword = action.payload.value;
            state.searchSection = action.payload.section;
        },
        clearSearchKeyword: (state) => {
            // clear the search keyword and section
            state.searchKeyword = "";
            state.searchSection = "";
        },
    },
});

// exports

export const { onSearchKeywordChange, clearSearchKeyword } =
    searchSlice.actions;
export default searchSlice;
