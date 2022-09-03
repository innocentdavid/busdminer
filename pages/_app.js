import "../styles/globals.css";
import { IoMdMenu } from "react-icons/io";
import { ConnectButton } from "web3uikit";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <>
          <nav className="flex justify-around items-center w-full h-16 bg-black text-white fixed top-0 left-0">
            <div className="cursor-pointer">
              <IoMdMenu size="30px" />
            </div>
            <div className="">
              <img src="/BUSD MINER_LOGO 22.png" alt="LOGO" width="60px" />
            </div>
            <ConnectButton moralisAuth={false} />
          </nav>
          <div className="mt-16"></div>
          <Component {...pageProps} />
        </>
      </NotificationProvider>
    </MoralisProvider>
  );
}

export default MyApp;
