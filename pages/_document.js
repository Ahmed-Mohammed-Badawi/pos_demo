import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang='en'>
            <Head>
                <link rel='preconnect' href='https://fonts.googleapis.com' />
                <link
                    rel='preconnect'
                    href='https://fonts.gstatic.com'
                    crossOrigin={"true"}
                />
                <link
                    href='https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700&family=Montserrat:wght@300;400&display=swap'
                    rel='stylesheet'
                />
                <link rel='icon' type='image/x-icon' href='/pos_favicon.png' />
            </Head>
            <body>
                <Main></Main>
                <NextScript />
            </body>
        </Html>
    );
}
