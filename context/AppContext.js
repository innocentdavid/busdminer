import { createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { client } from '../lib/client'
import { ethers } from 'ethers'

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [appStatus, setAppStatus] = useState('')
  const [formattedAccount, setFormattedAccount] = useState('')
  const [currentAccount, setCurrentAccount] = useState('')
  const [currentUser, setCurrentUser] = useState({})
  const [userBalance, setUserBalance] = useState(0)
  const router = useRouter()

  useEffect(() => { // checkIfWalletIsConnected
    const fetch = async () => {
      await checkIfWalletIsConnected()
    }      
    return fetch
  }, [])

  async function checkIfWalletIsConnected(location) {
    // console.log(location)
    if (!window.ethereum) return setAppStatus('notConnected')
    try {
      const addressArray = await window.ethereum.request({
        method: 'eth_accounts',
      })
      // console.log(window.ethereum.selectedAddress)
      // console.log({addressArray})
      if (addressArray.length > 0) {
        setAppStatus('connected')
        // alert('connected')
        setCurrentAccount(addressArray[0])
        await getUserBalance(addressArray[0])
        let fAccount = addressArray[0].slice(0, 4) + '...' + addressArray[0].slice(-4)
        setFormattedAccount(fAccount);
        await createUserAccount(addressArray[0])
      } else {
        setAppStatus('notConnected')
      }
    } catch (err) {
      // alert('An error occured')
      setAppStatus('notConnected')
      // router.push('/')
    }
  }

  useEffect(() => { // on change listener
    if (window) {
      const et = window.ethereum;
      // alert("No MetaMask!")
      if (!et) return setAppStatus('notConnected');

      et.on('accountsChange', accountsChangeHandler)
      et.on('chainChange', chainChangeHandler)
      checkIfWalletIsConnected()
    }
  }, [])

  const accountsChangeHandler = async () => {
    console.log('accountsChangeHandler')
    await checkIfWalletIsConnected("acChanged")
    if (currentAccount) {
      await getCurrentUserDetails(currentAccount)
      await createUserAccount(currentAccount)
      await getUserBalance(currentAccount)
    }
  }

  const chainChangeHandler = async () => {
    console.log('chainChangeHandler')
    await checkIfWalletIsConnected()
    window.location.reload()
  }

  const connectWallet = async () => {
    if (!window.ethereum) return setAppStatus('notConnected')
    try {
      setAppStatus('loading')

      const addressArray = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      const account = addressArray[0]

      if (account) {
        setCurrentAccount(account)
        // console.log('connect', currentAccount)
        let fAccount = account.slice(0, 4) + '...' + account.slice(-4)
        setFormattedAccount(fAccount);
        await getUserBalance(account)
        await createUserAccount(account)
        // console.log(ethers.utils.formatBytes32String(account))
      } else {
        // alert('notConnected')
        console.log('err connectWallet wa', addressArray?.length)
        setAppStatus('notConnected')
        // router.push('/')
      }
    } catch (err) {
      setAppStatus('error')
    }
  }

  const disconnectWallet = async () => {
    // logout();
  }

  const getUserBalance = async (account) => {
    if (!window.ethereum) return setAppStatus('notConnected')
    const balance = await window.ethereum.request({
      method: 'eth_getBalance', params: [account, 'latest']
    })
    const b = ethers.utils.formatEther(balance)
    b && setUserBalance(b)
    // console.log({b})
    return b
  }

  const createUserAccount = async (userAddress = currentAccount) => {
    if (!window.ethereum) return setAppStatus('notConnected')
    try {
      const userDoc = {
        _type: 'user',
        _id: userAddress,
        walletAddress: userAddress,
        ticket: 0,
      }
      const newUser = await client.createIfNotExists(userDoc)

      newUser && setCurrentUser(newUser);
      // console.log({ newUser })
      setAppStatus('connected')
      return { message: 'success' }
    } catch (error) {
      // router.push('/')
      setAppStatus('error')
      return { message: 'error', error }
    }
  }

  useEffect(() => { // getCurrentUserDetails
    if (!currentAccount && appStatus == 'connected') return
      ;(async function () {
        const d = await getCurrentUserDetails(currentAccount)
        console.log({d})
      })
    // getTodayLottery()
  }, [currentAccount, appStatus])
  // console.log('check', currentAccount)
  const getCurrentUserDetails = async (userAccount = currentAccount) => {
    if (appStatus !== 'connected') return;

    const query = `
      *[_type == "user" && _id == "${userAccount}"][0]
    `
    const response = await client.fetch(query)
    setCurrentUser(response)
  }
  
  const [currentLottery, setCurrentLottery] = useState([])

  const fetchCurrentLottery = async () => {
    const query = `
      *[_type == "lottery" && current == true] | order(_createdAt desc)[0]
     `
    const res = await client.fetch(query).catch(err => {
      return { message: 'error', err }
    })
    // console.log({res})
    setCurrentLottery(res)
    return { message: 'success' }
  }

  const [lastLottery, setLastLottery] = useState([])

  const fetchLastLottery = async () => {
    const query = `
      *[_type == "lottery" && current == true] | order(_createdAt desc)
     `
    const res = await client.fetch(query).catch(err => {
      return { message: 'error', err }
    })
    // console.log({res})
    setLastLottery(res)
    return;
  }

  return (
    <AppContext.Provider
      value={{
        appStatus,
        setAppStatus,
        currentAccount,
        formattedAccount,
        userBalance,
        connectWallet,
        disconnectWallet,
        getUserBalance,
        setAppStatus,
        currentUser,
        getCurrentUserDetails,
        fetchCurrentLottery,
        currentLottery,
        fetchLastLottery,
        lastLottery,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
