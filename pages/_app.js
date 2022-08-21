import '../styles/globals.css'
import { IoMdMenu } from 'react-icons/io'

function MyApp({ Component, pageProps }) {
  return (<>
    <nav className="flex justify-around items-center w-full h-16 bg-black text-white fixed top-0 left-0">
      <div className="cursor-pointer"><IoMdMenu size="30px" /></div>
      <div className="">
        <img src="/BUSD MINER_LOGO 22.png" alt="LOGO" width="60px" />
      </div>
      <div className="cursor-pointer font-['Poppins'] font-semibold py-1 px-2 border border-[#ffa500] hover:border-white rounded-full">CONNECT</div>
    </nav>
    <div className="mt-16"></div>
    <Component {...pageProps} />
  </>)
}

export default MyApp
