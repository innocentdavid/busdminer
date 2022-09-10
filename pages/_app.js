import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import { AppProvider } from "../context/AppContext";

function MyApp({ Component, pageProps }) {

  return (
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <AppProvider>
          <Component {...pageProps} />
        </AppProvider>
      </NotificationProvider>
    </MoralisProvider>
  );
}

export default MyApp;
