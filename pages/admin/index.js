import React from "react";
import classes from "@/styles/Dashboard.module.scss";
import Head from "next/head";
// Imports
import DashboardCard from "@/components/Admin/Dashboard/DashboardCard/DashboardCard";
import TotalIcon from "@/components/SVGS/TotalIcon";

function Dashboard() {
    return (
        <>
            <Head>
                <title>Dashboard | Admin</title>
                <meta name='description' content='Dashboard main page' />
            </Head>
            <section className={classes.Dashboard}>
                <div className={classes.Top}>
                    <DashboardCard
                        background={"#0099fb"}
                        background2={"#66c2fd"}
                        title={"الإجمالي"}
                        value={"10000"}
                    >
                        <TotalIcon />
                    </DashboardCard>
                    <DashboardCard
                        background={"#6571ff"}
                        background2={"#a3aaff"}
                        title={"الإجمالي"}
                        value={"10000"}
                    >
                        <TotalIcon />
                    </DashboardCard>
                </div>
                <div className={classes.Bottom}>
                    <h2>المنتجات الأكثر مبيعاً</h2>
                    <div className={classes.Table}>
                        <div className={classes.Head}>
                            <span
                                className={[
                                    classes.Head_Title,
                                    classes.Cell,
                                ].join(" ")}
                            >
                                المنتج
                            </span>
                            <span
                                className={[
                                    classes.Head_Title,
                                    classes.Cell,
                                ].join(" ")}
                            >
                                العدد الكلي
                            </span>
                            <span
                                className={[
                                    classes.Head_Title,
                                    classes.Cell,
                                ].join(" ")}
                            >
                                المجموع الكلي
                            </span>
                        </div>
                        <div className={classes.Rows}>
                            <div className={classes.Row}>
                                <span className={classes.Cell_TD}>
                                    بيتزا بالفراخ
                                </span>
                                <span className={classes.Cell_TD}>5000</span>
                                <span className={classes.Cell_TD}>KWD 340,000</span>
                            </div>
                            <div className={classes.Row}>
                                <span className={classes.Cell_TD}>
                                    بيتزا بالفراخ
                                </span>
                                <span className={classes.Cell_TD}>5000</span>
                                <span className={classes.Cell_TD}>KWD 340,000</span>
                            </div>
                            <div className={classes.Row}>
                                <span className={classes.Cell_TD}>
                                    بيتزا بالفراخ
                                </span>
                                <span className={classes.Cell_TD}>5000</span>
                                <span className={classes.Cell_TD}>KWD 340,000</span>
                            </div>
                            <div className={classes.Row}>
                                <span className={classes.Cell_TD}>
                                    بيتزا بالفراخ
                                </span>
                                <span className={classes.Cell_TD}>5000</span>
                                <span className={classes.Cell_TD}>KWD 340,000</span>
                            </div>
                            <div className={classes.Row}>
                                <span className={classes.Cell_TD}>
                                    بيتزا بالفراخ
                                </span>
                                <span className={classes.Cell_TD}>5000</span>
                                <span className={classes.Cell_TD}>KWD 340,000</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Dashboard;

// Serverside function
export async function getServerSideProps(context) {
    // get the crole and authenticated from cookie
    const cookie = context.req.headers.cookie;
    // get the role and authenticated from cooki
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
    if (authenticatedValue === "true" && roleValue === "admin") {
        return {
            props: {},
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
