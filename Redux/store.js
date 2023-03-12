import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { composeWithDevTools } from "redux-devtools-extension";

// Import Reducers
import HomeReducer from "./Reducers/HomeReducer";
import DashboardReducer from "./Reducers/DashboardReducer";
import AdminFormsReducer from "./Reducers/AdminFormsReducer";
import AdminFormsEditReducer from "./Reducers/AdminFormsEditReducer";
import deleteAll from "./Reducers/Delete_all__Reducer";
import settingsSlice from "./Reducers/settingsReducer";
import TablesSlice from "./Reducers/TablesReducer";
import searchSlice from "./Reducers/searchReducer";

// Put All Reducers Together
const AllReducers = {
    reducer: {
        [HomeReducer.name]: HomeReducer.reducer,
        [DashboardReducer.name]: DashboardReducer.reducer,
        [AdminFormsReducer.name]: AdminFormsReducer.reducer,
        [AdminFormsEditReducer.name]: AdminFormsEditReducer.reducer,
        [deleteAll.name]: deleteAll.reducer,
        [settingsSlice.name]: settingsSlice.reducer,
        [TablesSlice.name]: TablesSlice.reducer,
        [searchSlice.name]: searchSlice.reducer,
    },
};

// Make the Store with All Reducers
const makeStore = () => configureStore(AllReducers);

//  Create the next Wrapper to apply the store
export const wrapper = createWrapper(
    makeStore,
    applyMiddleware(composeWithDevTools)
);
