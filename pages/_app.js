import "../styles/globals.css";
import { NotificationProvider } from "web3uikit";
import { AppProvider } from "../context/AppContext";

function MyApp({ Component, pageProps }) {

  return (
      <NotificationProvider>
        <AppProvider>
          <Component {...pageProps} />
        </AppProvider>
      </NotificationProvider>
  );
}

export default MyApp;
