import {useRouter} from "next/router";
import Image from "next/image";
import classes from '@/styles/pos_name.module.scss';
import LogoutIcon from "@/components/SVGS/LogoutIcon";
import React from "react";

function Pos_name() {

    //Router
    const router = useRouter();

    //Click Handler
    function buttonClickHandler(value) {
        //Set the branch name in localStorage
        localStorage.setItem(`branch_name`, value);
        // Redirect to pos page
        router.push(`/callcenter`);
    }

    // LOGOUT HANDLER
    function logoutHandler() {
        // Clear the local storage
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("login_id");
        localStorage.removeItem("user_name");
        localStorage.removeItem("branch_id");
        localStorage.removeItem('cashbox_id')
        localStorage.removeItem(`branch_name`);

        // Remove Cookies (role && authenticated)
        document.cookie =
            "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
            "authenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // Reload the page
        window.location.reload();
    }

    return (
        <>
            <div className={"Container"}>
                <div className={classes.Main}>
                    <div className={classes.Navigation_Logout} onClick={logoutHandler}>
                        <LogoutIcon/>
                    </div>
                    <section className={classes.Buttons}>
                        <button onClick={() => buttonClickHandler('basha')}>
                            <Image src={'/Images/basha.png'} alt={'Basha Name Logo'} width={96} height={129}/>
                        </button>
                        <button onClick={() => buttonClickHandler('bahar')}>
                            <Image src={'/Images/bahar.png'} alt={'Bahar Name Logo'} width={137} height={123}/>
                        </button>
                    </section>
                </div>
            </div>
        </>
    )
}

export default Pos_name



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
    if (authenticatedValue === "true" && (roleValue === "callcenter")) {
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
