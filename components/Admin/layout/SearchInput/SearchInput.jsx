import Image from "next/image";
import React from "react";
import classes from "./SearchInput.module.scss";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { onSearchKeywordChange } from "@/Redux/Reducers/searchReducer";
import fetchData from "@/Redux/Actions/search";
// Notifications
import { toast } from "react-toastify";

function SearchInput({ click, searchSection }) {
    // Redux
    const dispatch = useDispatch();
    const { searchKeyword } = useSelector((state) => state.search);

    // Handlers
    const handleSubmit = async (e) => {
        // prevent Default
        e.preventDefault();
        // check that the search keyword is not empty
        if (searchKeyword === "") {
            toast.info("please fill the search box");
            return;
        }
        // Dispatch the fetch data action
        dispatch(fetchData({ searchKeyword, searchSection }));
    };

    return (
        <form className={classes.Search} onSubmit={handleSubmit}>
            <input
                type={"text"}
                placeholder={"بحث"}
                onChange={(e) => {
                    // Change the Keyword in the state
                    dispatch(
                        onSearchKeywordChange({
                            value: e.target.value,
                            section: searchSection,
                        })
                    );
                    // Send a request to get all data if the value is ''
                    if (e.target.value === "") {
                        dispatch(fetchData({ searchSection }));
                    }
                }}
                value={searchKeyword}
            />
            <button>
                <Image
                    src={"/Icons/Search.svg"}
                    width={20}
                    height={20}
                    alt={"search"}
                />
            </button>
        </form>
    );
}

export default SearchInput;
