import React, { useEffect, useState } from "react";
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { AiOutlineStar } from 'react-icons/ai'
import { BiCaretRightCircle } from 'react-icons/bi'
import { BsArrowRight } from 'react-icons/bs'
import { IoMdMenu } from "react-icons/io";
import { ConnectButton } from "web3uikit";
import { FaTicketAlt } from 'react-icons/fa'
import { FcSpeaker } from 'react-icons/fc'
import { FiCopy } from 'react-icons/fi'
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
import { FiLogOut } from 'react-icons/fi'
import { formatWalletAddress } from "../lib/functions";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Home() {
  const router = useRouter()
  const { appStatus, connectWallet, disconnectWallet, currentAccount, userBalance, getUserBalance, currentUser, fetchLastLottery, lastLottery, fetchCurrentLottery, currentLottery } = useContext(AppContext)
  const [balance, setBalance] = useState(userBalance)

  const [ticketBuy, setTicketBuy] = useState()
  const [ticketPlay, setTicketPlay] = useState()

  const countDown = (countDate) => {
    if (!countDate) return;
    var now = new Date().getTime();
    var gap = countDate - now;
    var second = 1000;
    var minute = second * 60;
    var hour = minute * 60;
    var day = hour * 24;

    var d = Math.floor(gap / (day))
    var h = Math.floor((gap % (day)) / (hour))
    var m = Math.floor((gap % (hour)) / (minute))
    var s = Math.floor((gap % (minute)) / (second))

    const dayN = document.getElementById('day')
    if (dayN && d >= 0) {
      dayN.innerText = d
    }
    const hourN = document.getElementById('hour')
    if (hourN && h >= 0) {
      hourN.innerText = h
    }
    const minuteN = document.getElementById('minute')
    if (minuteN && m >= 0) {
      minuteN.innerText = m
    }
    const secondN = document.getElementById('second')
    if (secondN && s >= 0) {
      secondN.innerText = s
    }
  }

  useEffect(() => {
    const count = setInterval(() => {
      var countDate = new Date(currentLottery.start).getTime();
      countDown(countDate)
    }, 1000);
    return () => clearInterval(count);
  }, [currentLottery])

  useEffect(() => {
    const fetch = async () => {
      const b = await getUserBalance(currentAccount)
      b && setBalance(b)
      await fetchLastLottery()
      await fetchCurrentLottery()
    }
    fetch()
  }, [currentAccount])

  if (appStatus === 'loading') {
    return (
      <div className="">
        <div className="">Loading<span className="animate-ping">...</span></div>
      </div>
    )
  }

  return (<div className={`bg-[#ffa500] md:px-8 py-4 px-4`}>
    <Head>
      <title>BUSD MINER</title>
      <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <nav className="flex justify-around items-center w-full h-16 bg-black text-white fixed top-0 left-0">
      {/* <div className="cursor-pointer">
          <IoMdMenu size="30px" />
        </div> */}
      <div className="">
        <img src="/BUSD MINER_LOGO 22.png" alt="LOGO" width="60px" />
      </div>
      {/* <ConnectButton moralisAuth={false} /> */}
      {appStatus === 'notConnected' ?
        <div className="flex gap-3 cursor-pointer border hover:border-[#ffa500] px-4 py-1 rounded-full" onClick={() => connectWallet()}>
          <Image src="/images/metamask.png" width={'20px'} height={'20px'} />
          <div className="font-bold">Connect Wallet</div>
          {/* <div className="">Connect to Metamask.</div> */}
        </div>
        :
        <div className="flex flex-col text-end">
          <div className="font-bold select-none">{currentAccount && formatWalletAddress(currentAccount)} | ${parseFloat(balance).toFixed(4)}</div>
          <div className="text-sm font-semibold">Ticket: <span className="font-bold">{currentUser?.ticket}</span></div>
          {/* <FiLogOut className="cursor-pointer" onClick={disconnectWallet} /> */}
        </div>}
    </nav>

    <div className="mt-16"></div>

    <div className={`${styles.main}`}>
      <section className="mt-10 pb-16 grid place-items-center border-b-2">
        <h1 className={`${styles.title} text-[2.5rem] lg:text-[4rem] font-bold`}>
          Welcome to the <span className="text-[#0070f3]">BUSD MINER LOTTRY!</span>
        </h1>

        <p className="my-3 text-[1.25rem] md:text-[1.2rem] font-['Poppins'] text-center px-1">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem unde expedita commodi beatae vel, eveniet quae.
        </p>

        <div className="flex flex-col md:flex-row gap-6 mt-7">
          <span className="flex items-center justify-between gap-3 text-[1rem] font-semibold font-['Montserrat'] leading-6 bg-white py-2 px-4 hover:text-[#0070f3]"
            onClick={(e) => { e.preventDefault(); router.replace('/?play=1') }}>PLAY NOW </span>

          {/* by referral action */}

          <span className="flex items-center justify-between gap-3 text-[1rem] font-semibold font-['Montserrat'] leading-6 border py-2 px-4  hover:text-[#0070f3] cursor-pointer"
            onClick={(e) => { e.preventDefault(); router.replace('/?buyTicket=1') }}>BUY A TICKET <FaTicketAlt /></span>
        </div>
      </section>

      <section className="py-20 border-b-2">
        <img src="/images/BUSD MINER_LOGO.png" alt="" />
      </section>

      <section className="grid place-items-center mt-10">
        <div className="flex items-center gap-4">
          <div className="md:w-20 w-10 h-[1px] border-b border-b-gray-600"></div>
          <div className="font-bold text-2xl">Last Winner</div>
          <div className="md:w-20 w-10 h-[1px] border-b border-b-gray-600"></div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="text-red-600"><AiOutlineStar size="20px" /></div>
            <span className="text-white">{lastLottery[1]?.winner && formatWalletAddress(lastLottery[1]?.winner)}0xE***35df</span>
          </div>

          <div className="cursor-pointer"><FiCopy /></div>
        </div>

        <div><strong>{lastLottery[1]?.prize}700 BUSD</strong></div>

        <div className="flex items-center gap-2 mt-2 mb-5 px-20">
          <div className=""><FcSpeaker size="30px" /></div>
          <div className="flex items-center">
            <marquee behavior="" direction="">
              {/* {lastLottery && lastLottery?.map((data, index) => {
                return (
                  <span key={index + 1}>congrats {data?.winner && formatWalletAddress(data?.winner)}0x34d***sg32 won ${data?.prize}2, 440 | </span>
                )
              })} */}
              <span>congrats 0x34d***sg32 won $2, 440 | </span>
              <span>congrats 0x34d***sg32 won $2, 440 | </span>
              <span>congrats 0x34d***sg32 won $2, 440 | </span>
              <span>congrats 0x34d***sg32 won $2, 440 | </span>
              <span>congrats 0x34d***sg32 won $2, 440 | </span>
              <span>congrats 0x34d***sg32 won $2, 440 | </span>
              <span>congrats 0x34d***sg32 won $2, 440 | </span>
              <span>congrats 0x34d***sg32 won $2, 440 | </span>
              <span>congrats 0x34d***sg32 won $2, 440 | </span>
              <span>congrats 0x34d***sg32 won $2, 440 | </span>
              <span>congrats 0x34d***sg32 won $2, 440 | </span>
            </marquee>
          </div>
        </div>

        <p align="center">Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur.</p>

        <span className="mt-5 flex items-center justify-between gap-3 text-[1rem] font-semibold font-['Montserrat'] leading-6 bg-white py-2 px-4 hover:text-[#0070f3]"
          onClick={(e) => { e.preventDefault(); router.replace('/?play=1') }}>PLAY NOW </span>
      </section>

      <section className="grid place-items-center mt-8">
        <div className="mt-[50px] mb-1">Next one starts in:</div>
        <div className="countdown flex justify-center gap-2 md:gap-10 pb-10 w-full overflow-auto">
          <div className="flex flex-col justify-center items-center w-[80px] lg:w-[130px]">
            <div id="day" className="w-full bg-[#333] text-white text-[3rem] lg:text-[5rem] py-3 text-center ">0</div>
            <div className="w-full bg-[#ff0] text-[#333] text-center py-2 px-4 ">Days</div>
          </div>
          <div className="flex flex-col justify-center items-center w-[80px] lg:w-[130px]">
            <div id="hour" className="w-full bg-[#333] text-white text-[3rem] lg:text-[5rem] py-3 text-center ">0</div>
            <div className="w-full bg-[#ff0] text-[#333] text-center py-2 px-4 ">Hours</div>
          </div>
          <div className="flex flex-col justify-center items-center w-[80px] lg:w-[130px]">
            <div id="minute" className="w-full bg-[#333] text-white text-[3rem] lg:text-[5rem] py-3 text-center ">0</div>
            <div className="w-full bg-[#ff0] text-[#333] text-center py-2 px-4 ">Minutes</div>
          </div>
          <div className="flex flex-col justify-center items-center w-[80px] lg:w-[130px]">
            <div id="second" className="w-full bg-[#333] text-white text-[3rem] lg:text-[5rem] py-3 text-center ">0</div>
            <div className="w-full bg-[#ff0] text-[#333] text-center py-2 px-4 ">Seconds</div>
          </div>
        </div>

        <h1 className="mt-5 text-3xl">Available slot <span className="py-1 px-2 bg-white font-bold">{currentLottery?.totalTicket}</span></h1>

        {currentLottery?.topDeposited && <p className="md:text-xl text-base font-bold mt-5">Top deposited price: <span>${currentLottery?.topDeposited}</span></p>}

        <div className="flex gap-5 my-5 px-3 lg:px-[25%]">
          <div className="w-[5px] border-l-[3px] border-[#fff]"></div>
          <p className="mt-5">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis hic esse reiciendis recusandae molestias ab consequuntur ratione iure voluptate impedit. Inventore error eum nisi aliquam. Magnam autem nulla beatae.</p>
        </div>

        <div className="mt-5 flex flex-col md:flex-row items-center gap-3">
          <span className="flex items-center justify-between gap-3 text-[1rem] font-semibold font-['Montserrat'] leading-6 bg-white py-1 px-3 hover:text-[#0070f3] cursor-pointer"
            onClick={(e) => { e.preventDefault(); router.replace('/?buyTicket=1') }}>Buy Ticket </span>

          {/* <a href="#" className="hover:text-[#0070f3]">Refer to earn free ticket</a> */}
        </div>
      </section>
    </div>

    <footer className={styles.footer}>
      {/* <Link href="/"><a> */}
      <div>Powered by <span className="font-bold">BINANCE MINERS</span></div>
      {/* </a></Link> */}
    </footer>

    {router?.query?.buyTicket && <BuyTicket router={router} currentUser={currentUser} userBalance={balance}
      setTicketBuy={setTicketBuy}
      ticketBuy={ticketBuy}
    />}
    {router?.query?.play && <Play
      router={router}
      currentUser={currentUser}
      currentLottery={currentLottery}
      setTicketPlay={setTicketPlay}
      ticketPlay={ticketPlay}
    />}
  </div>)
}


const Play = ({ router, currentUser, currentLottery, setTicketPlay, ticketPlay }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!currentUser) return;    

    const res = await fetch('/api/play', {
      method: 'POST',
      body: JSON.stringify({ user: currentUser, lotteryId: currentLottery?._id, ticket: ticketPlay}),
      type: 'application/json'
    })
    const resp = await res.json()
    if (res.status == 200) {
      // router.reload();
      router.replace('/')
      return;
    }else{
      console.log(resp)
    }
  }

  return (<>
    <div className="z-50">
      <div className="fixed top-0 left-0 w-full h-full"
        style={{ background: "rgba(0,0,0,.5)" }}
        onClick={() => { router.push('/') }}></div>
      <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] min-w-[300px] md:min-w-[450px]">
        <div className="header font-bold p-2 text-white flex justify-between rounded-t-lg bg-[#ffa500]">
          <div className="">SHOW IMG</div>
        </div>
        <div className="body rounded-b-lg bg-white p-2">
          <div className="text-right text-sm">Available slots <span className="font-bold">{currentLottery?.totalTicket}</span></div>
          <form className="mt-6 px-[30%]" onSubmit={handleSubmit}>
            <div>
              <input type="number" placeholder="1 ticket per slot"
                min={0}
                max={currentLottery?.totalTicket}
                onChange={(e) => { setTicketPlay(e.target.value) }}
                value={ticketPlay}
                className="w-full outline-none border-b" />
            </div>
            <div className="mt-5 flex justify-end">
              <button type="submit">
                <BsArrowRight className="outline-none font-[900] text-black text-xl" />
              </button>
            </div>
          </form>

          <div className="border-b mt-8"></div>

          <div className="text-center text-sm">
            <div>You have {currentUser?.ticket} Ticket(s)</div>
            <div><Link href="/?buyTicket=1"><a className="text-blue-600">Buy More</a></Link></div>
          </div>
        </div>
      </div>
    </div>
  </>)
}

const BuyTicket = ({ router, currentUser, balance, setTicketBuy, ticketBuy }) => {
const handleSubmit = async (e) => {
    e.preventDefault();
    if(!currentUser) return;    

    const res = await fetch('/api/buy', {
      method: 'POST',
      body: JSON.stringify({ user: currentUser, balance: balance, ticket: ticketBuy}),
      type: 'application/json'
    })
    const resp = await res.json()
    if (res.status == 200) {
      // router.reload();
      router.replace('/')
      return;
    }else{
      console.log(resp)
    }
  }

  return (<>
    <div className="z-50">
      <div className="fixed top-0 left-0 w-full h-full"
        style={{ background: "rgba(0,0,0,.5)" }}
        onClick={() => { router.push('/') }}></div>
      <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] min-w-[300px] md:min-w-[450px]">
        <div className="header font-bold p-2 text-white flex justify-between rounded-t-lg bg-[#ffa500]">
          <div className="text-lg">Buy Ticket</div>
          <div>$1 per ticket</div>
        </div>
        <div className="body rounded-b-lg bg-white py-4">
          <form className="px-[20%]" onSubmit={handleSubmit}>
            <div>
              <div>Number of Tickets</div>
              <input type="number" placeholder="Enter number of tickets"
                min={0}
                max={balance}
                onChange={(e) => { setTicketBuy(e.target.value) }}
                value={ticketBuy}
                className="w-full outline-none" />
            </div>
            <div className="mt-6">
              <input type="submit" value="Continue"
                className="w-full outline-none bg-black text-white" />
            </div>
          </form>

          <div className="border-b mt-8"></div>

          <div className="text-center text-sm">
            <div>You have {currentUser?.ticket} ticket currently
              {/* <Link href="/?buyticket=1"><a className="text-blue-600">Buy More</a></Link> */}
            </div>
            <div className="text-[.8rem] font-[fona]">Your Balance: <span>${balance}</span></div>
          </div>
        </div>
      </div>
    </div>
  </>)
}