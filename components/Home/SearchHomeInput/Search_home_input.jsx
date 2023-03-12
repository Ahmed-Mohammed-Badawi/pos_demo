import Image from "next/image";
import React, {useState} from "react";
import classes from "./Search_home_input.module.scss";
// Redux
import {useDispatch, useSelector} from "react-redux";
import {setItemsPreview} from "@/Redux/Reducers/HomeReducer";
// Notifications
import {toast} from "react-toastify";
//Axios
import axios from "axios";

function SearchInput({roleValue, resetTheLastPage}) {
    // Redux
    const dispatch = useDispatch();
    //Get the Active Category to Send with the request
    const {ActiveCategory} = useSelector(state => state.home);

    //Check if there is an active category
    let categoryForSearch;
    if (ActiveCategory){
        categoryForSearch = ActiveCategory;
    }else {
        categoryForSearch = ''
    }

    //States
    const [searchKeyword, setSearchKeyword] = useState();

    // Handlers
    const handleSubmit = async (e) => {
        //Set the url
        let url = `https://baharapi.kportals.net/api/v1/callcenter/search?searchCategory=`;
        //check if user is a cashier
        if(roleValue === "cashier"){
            url = `https://baharapi.kportals.net/api/v1/cashier/search?searchCategory=`
        }


        // prevent Default
        e.preventDefault();
        // check that the search keyword is not empty
        if (searchKeyword === "") {
            toast.info("please fill the search box");
            return;
        }
        // Dispatch the fetch data action
        axios.get(`${url}${categoryForSearch}&searchTerm=${searchKeyword}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(res => {
                dispatch(setItemsPreview(res.data.results));
                // Reset the last page
                resetTheLastPage()
            })
            .catch(err => {
                console.log(err)
            })
    };

    return (
        <form className={classes.Search} onSubmit={handleSubmit}>
            <input
                type={"text"}
                placeholder={"بحث"}
                onChange={(e) => {
                    // Change the Keyword in the state
                    setSearchKeyword(e.target.value);
                }}
                value={searchKeyword || ''}
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
