import { useEffect, useState } from "react";
import {router} from "next/router";
import Head from "next/head";
import classes from "@/styles/Home.module.scss";
// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
// Items
import HomeNavbar from "@/components/Home/HomeNavbar/HomeNavbar";
import Item from "@/components/Home/Item/Item";
import CardContainer from "@/components/Home/CardConatiner/CardContainer";
import Pagination from "@/components/Home/Pagination/Pagination";
import Inputs from "@/components/Home/Inputs/Inputs";
import Buttons from "@/components/Home/Buttons/Buttons";
import SwiperButton from "@/components/Home/SwipperButton/SwiperButton";
// Redux
import { useSelector, useDispatch } from "react-redux";
import {
    setActiveCategory,
    setItemsPreview,
} from "@/Redux/Reducers/HomeReducer";

// Axios
import axios from "axios";
import { toast } from "react-toastify";

//Run Socket
import socket from "@/helpers/socket";
import {useRouter} from "next/router";
socket.on('connect', () => {
    console.log('Socket Starts')
});


export default function Home({roleValue}) {

    //Router
    const router = useRouter();

    // Redux
    const { Items, ActiveCategory, ActiveCategoryId } = useSelector(
        (state) => state.home
    );
    const dispatch = useDispatch();

    // State
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPageNumber, setLastPageNumber] = useState(1);

    // When Category is selected
    async function categoryClickHandler(e, categoryId) {
        // Get the category from the e
        let category = e.target.innerText;

        // if the category is equal to the Active Category return
        if (category === ActiveCategory) return;

        // Check if no category || category is empty || null set it to all
        if (!category || category === "" || category === null) {
            category === "الكل";
        }

        // Set the Active Category to the category
        dispatch(
            setActiveCategory({ category: category, categoryId: categoryId })
        );
        // set the page current number to 1
        setCurrentPage(1);
    }

    // When Pagination Button Click to change the data
    const currentPageplus = function () {
        setCurrentPage(+currentPage + 1);
    };
    const currentPageMinus = function () {
        setCurrentPage(+currentPage - 1);
    };


    //Effect to redirect to choose the branch name if it's not found
    useEffect(() => {
        // GET THE BRANCH NAME FROM LOCALSTORAGE
        const branch_name = localStorage.getItem(`branch_name`);
        const role = localStorage.getItem(`role`);
        // Check if no Branch name Redirect to Choose branch name
        if((!branch_name || branch_name === '') && role === 'callcenter'){
            router.push(`/callcenter/pos_name`)
        }
    }, [])



    // Effect to set the data
    useEffect(() => {
        if (!ActiveCategoryId) {
            // Set the Category when first load on All
            dispatch(setActiveCategory({ category: "الكل" }));
        }
        // init the url
        let url = `https://posapi.kportals.net/api/v1/items?page=${currentPage}`;

        if (ActiveCategoryId) {
            url = `https://posapi.kportals.net/api/v1/cate/items?page=${currentPage}&categoryId=${ActiveCategoryId}`;
        }

        //Check if user is a cashier
        if(roleValue === 'cashier'){
            url = `https://posapi.kportals.net/api/v1/cashier/items?page=${currentPage}`;
        }

        if(roleValue === 'cashier' && ActiveCategoryId){
            url = `https://posapi.kportals.net/api/v1/cashier/cate/items?page=${currentPage}&categoryId=${ActiveCategoryId}`;
        }

        // Get the Data of All
        axios
            .get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => {
                dispatch(setItemsPreview(res.data.data.items));
                // Set the Pagination States
                setLastPageNumber(res.data.data.lastPage);
            })
            .catch((err) => {
                toast.error(err.response.data.message || err.message);
            });
    }, [dispatch, ActiveCategoryId, currentPage]);

    // Get the Category Data
    async function getCategoryData(url) {
        const data = await axios
            .get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => res.data.data.items)
            .catch((err) => {
                toast.error(err.response.data.message || err.message);
            });
        // return data
        return data;
    }

    useEffect(() => {
        // Get All Categories from the server
        let url;
        if(roleValue === 'callcenter'){
            url = `https://posapi.kportals.net/api/v1/categories`;
        }
        if(roleValue === 'cashier'){
            url = `https://posapi.kportals.net/api/v1/cashier/categories`;
        }

        axios
            .get(`${url}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => {
                // Set the Categories in the state
                setCategories(res.data.categories);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [dispatch]);

    return (
        <>
            <Head>
                <title>Home</title>
            </Head>
            <div className='Container '>
                <main className={classes.Main}>
                    {/* Content */}
                    <div className={classes.Content}>
                        <section className={classes.Left}>
                            <div className={classes.Titles}>
                                <span className={classes.Span_1}>المنتج</span>
                                <span className={classes.Span_2}>الكمية</span>
                                <span className={classes.Span_3}>السعر</span>
                                <span className={classes.Span_4}>المجموع</span>
                            </div>
                            <div className={classes.Items}>
                                {Items &&
                                    Items.map((d, i) => {
                                        return (
                                            <Item
                                                key={i}
                                                name={d.name}
                                                price={d.price}
                                                quantity={d.quantity}
                                                step={d.unit.unitValue}
                                            />
                                        );
                                    })}
                            </div>
                            <div className={classes.Left_Bottom}>
                                <Inputs roleValue={roleValue} />
                                <Buttons roleValue={roleValue} />
                            </div>
                        </section>
                        <section className={classes.Right}>
                            <HomeNavbar roleValue={roleValue} resetTheLastPage={() => {setLastPageNumber(1)}}/>
                            <div className={classes.SwiperContainer}>
                                <SwiperButton
                                    clicked={(e) => categoryClickHandler(e)}
                                    text={"الكل"}
                                    activeCategory={ActiveCategory}
                                />
                                <Swiper
                                    loop={categories.length > 7}
                                    slidesPerView={"auto"}
                                    spaceBetween={15}
                                    dir={"rtl"}
                                >
                                    {categories &&
                                        categories.map((cur) => {
                                            return (
                                                <SwiperSlide key={cur._id}>
                                                    <SwiperButton
                                                        clicked={(e) => {
                                                            categoryClickHandler(
                                                                e,
                                                                cur._id
                                                            );
                                                        }}
                                                        text={cur.categoryName}
                                                        activeCategory={
                                                            ActiveCategory
                                                        }
                                                    />
                                                </SwiperSlide>
                                            );
                                        })}
                                </Swiper>
                            </div>
                            <CardContainer />
                            <Pagination
                                pageMinus={currentPageMinus}
                                pagePlus={currentPageplus}
                                currentPage={currentPage}
                                lastPage={lastPageNumber}
                            />
                        </section>
                    </div>
                </main>
            </div>
        </>
    );
}


// Serverside function
export async function getServerSideProps(context) {
    // get the role and authenticated from cookie
    const cookie = context.req.headers.cookie;
    // get the role and authenticated from cookie
    const role = cookie?.split(";")?.find((c) => c.trim().startsWith("role="));
    const authenticated = cookie
        ?.split(";")
        ?.find((c) => c.trim().startsWith("authenticated="));

    // redirect if not authenticated || no role
    if (!authenticated || !role) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    //  get the role and authenticated values
    const roleValue = role.split("=")[1];
    const authenticatedValue = authenticated.split("=")[1];

    // check and redirect to the right page
    if (authenticatedValue === "true" && (roleValue === "callcenter" || roleValue === "cashier")) {
        return {
            props: {
                roleValue
            },
        };
    } else {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
}
