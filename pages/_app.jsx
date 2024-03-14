import Head from "next/head";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>App</title>
      </Head>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Component {...pageProps} />
      </LocalizationProvider>
    </>
  );
}
