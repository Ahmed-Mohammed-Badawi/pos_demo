import "@/styles/globals.css";
// Redux
import { Provider } from "react-redux";
import { wrapper } from "@/Redux/store";
// Router
import { useRouter } from "next/router";
// Layout
import Layout from "@/components/Layout";
// Notifications
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Loading bar
import NextNProgress from "nextjs-progressbar";


function MyApp({ Component, ...rest }) {
    // Redux
    const { store, props } = wrapper.useWrappedStore(rest);

    // Router
    const router = useRouter();

    return (
        <>
            <Provider store={store}>
                <NextNProgress
                    color='#6571ff'
                    startPosition={0.3}
                    stopDelayMs={200}
                    height={3}
                />
                <Layout path={router.pathname}>
                    <Component {...props.pageProps} />
                </Layout>
                <ToastContainer
                    position='bottom-left'
                    autoClose={5000}
                    hideProgressBar={false}
                    closeOnClick
                    pauseOnFocusLoss
                    pauseOnHover
                />
            </Provider>
        </>
    );
}

export default MyApp;
