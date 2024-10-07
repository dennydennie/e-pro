import Layout from "@/app/components/shared/Layout";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: any) {
    const renderComponent = (
        <Component {...pageProps} />
    );
    return (
        <ChakraProvider>
            <SessionProvider>
                {Component.noLayout
                    ? renderComponent
                    : <Layout>{renderComponent}</Layout>
                }
            </SessionProvider>
        </ChakraProvider>
    );
}