import { useRouter } from "next/router";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "../components/Layout";
import SessionProvider from "../utils/SessionProvider.client";

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  return (
    <SessionProvider>
      <Layout pathname={pathname}>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;
