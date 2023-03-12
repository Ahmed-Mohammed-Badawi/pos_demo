import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const fetchData = createAsyncThunk("fetchData/tables", async (data) => {
    const result = await axios.get(
        `https://baharapi.kportals.net/api/v1/search?searchCategory=${data.searchSection}&searchTerm=${data.searchKeyword || ''}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );

    if (result?.data?.results) {
        // Return the result object
        return { result: result.data.results, category: data.searchSection };
    }
});

export default fetchData;
