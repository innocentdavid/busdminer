import { createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { client } from '../lib/client'
import { ethers } from 'ethers'

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [appStatus, setAppStatus] = useState('')
  const [currentAccount, setCurrentAccount] = useState('')
  const [currentUser, setCurrentUser] = useState({})
  const [tweets, setTweets] = useState([])
  const router = useRouter()

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  useEffect(() => {
    if (window) {
      window.ethereum.on('accountsChange', accountsChangeHandler)
      window.ethereum.on('chainChange', chainChangeHandler)
    }
  }, [])

  const accountsChangeHandler = async () => {
    console.log('accountsChangeHandler')
    checkIfWalletIsConnected()
    if (currentAccount) {
      await getCurrentUserDetails(currentAccount)
      await createUserAccount(currentAccount)
      await getUserBalance(currentAccount)
    }
  }

  const chainChangeHandler = () => {
    console.log('chainChangeHandler')
    window.location.reload()
  }

  useEffect(() => {
    if (!currentAccount && appStatus == 'connected') return
    getCurrentUserDetails(currentAccount)
    // getTodayLottery()
  }, [currentAccount, appStatus])

  /**
   * Checks if there is an active wallet connection
   */
  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return setAppStatus('noMetaMask')
    try {
      const addressArray = await window.ethereum.request({
        method: 'eth_accounts',
      })
      if (addressArray.length > 0) {
        setAppStatus('connected')
        // alert('connected')
        setCurrentAccount(addressArray[0])

        createUserAccount(addressArray[0])
      } else {
        // alert('notConnected')
        setAppStatus('notConnected')
        // router.push('/')
      }
    } catch (err) {
      // alert('An error occured')
      setAppStatus('error')
      // router.push('/')
    }
  }

  /**
   * Initiates MetaMask wallet connection
   */
  const [userBalance, setUserBalance] = useState(0)

  const connectWallet = async () => {
    if (!window.ethereum) return setAppStatus('noMetaMask')
    try {
      setAppStatus('loading')

      const addressArray = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      // console.log('connectWallet wa', addressArray)

      if (addressArray.length > 0) {
        setCurrentAccount(addressArray[0])
        await getUserBalance(addressArray[0])
        await createUserAccount(addressArray[0])
        // console.log(ethers.utils.formatBytes32String(addressArray[0]))
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
    try {
      setAppStatus('loading')

      const addressArray = await window.ethereum.request({
        method: 'eth_requestAccounts',
        params: [{ eth_accounts: {} }]
      })

      // if (addressArray.length > 0) {
      console.log({ addressArray })
      //   setCurrentAccount(addressArray[0])
      //   createUserAccount(addressArray[0])
      //   getUserBalance(addressArray[0])
      // } else {
      setCurrentAccount(null)
      // createUserAccount(null)
      setUserBalance(0)
      // alert('notConnected')
      setAppStatus('notConnected')
      // router.push('/')
      // }
    } catch (err) {
      setAppStatus('error')
    }
  }

  /**
   * Get current user's balance
   */
  const getUserBalance = async (account) => {
    const balance = await window.ethereum.request({
      method: 'eth_getBalance', params: [account, 'latest']
    })
    const b = ethers.utils.formatEther(balance)
    b && setUserBalance(b)
    console.log({b})
    return b
  }

  /**
   * Creates an account in Sanity DB if the user does not already have one
   * @param {String} userAddress Wallet address of the currently logged in user
   */
  const createUserAccount = async (userAddress = currentAccount) => {
    if (!window.ethereum) return setAppStatus('noMetaMask')
    try {
      const userDoc = {
        _type: 'user',
        _id: userAddress,
        walletAddress: userAddress,
      }

      const newUser = await client.createIfNotExists(userDoc)
      newUser && setCurrentUser(newUser);
      console.log({newUser})
      setAppStatus('connected')
      return { message: 'success' }
    } catch (error) {
      // router.push('/')
      setAppStatus('error')
      return { message: 'error', error }
    }
  }

  /**
   * Generates NFT profile picture URL or returns the image URL if it's not an NFT
   * @param {String} imageUri If the user has minted a profile picture, an IPFS hash; if not then the URL of their profile picture
   * @param {Boolean} isNft Indicates whether the user has minted a profile picture
   * @returns A full URL to the profile picture
   */
  const getNftProfileImage = async (imageUri, isNft) => {
    if (isNft) {
      return `https://gateway.pinata.cloud/ipfs/${imageUri}`
    } else if (!isNft) {
      return imageUri
    }
  }

  /**
   * Gets all the tweets stored in Sanity DB.
   */
  // const fetchTweets = async () => {
  //   const query = `
  //     *[_type == "tweets"]{
  //       "author": author->{name, walletAddress, profileImage, isProfileImageNft},
  //       tweet,
  //       timestamp
  //     }|order(timestamp desc)
  //   `

  //   // setTweets(await client.fetch(query))

  //   const sanityResponse = await client.fetch(query)

  //   setTweets([])

  //   /**
  //    * Async await not available with for..of loops.
  //    */
  //   sanityResponse.forEach(async item => {
  //     const profileImageUrl = await getNftProfileImage(
  //       item.author.profileImage,
  //       item.author.isProfileImageNft,
  //     )

  //     if (item.author.isProfileImageNft) {
  //       const newItem = {
  //         tweet: item.tweet,
  //         timestamp: item.timestamp,
  //         author: {
  //           name: item.author.name,
  //           walletAddress: item.author.walletAddress,
  //           profileImage: profileImageUrl,
  //           isProfileImageNft: item.author.isProfileImageNft,
  //         },
  //       }

  //       setTweets(prevState => [...prevState, newItem])
  //     } else {
  //       setTweets(prevState => [...prevState, item])
  //     }
  //   })
  // }

  /**
   * Gets the current user details from Sanity DB.
   * @param {String} userAccount Wallet address of the currently logged in user
   * @returns null
   */
  const getCurrentUserDetails = async (userAccount = currentAccount) => {
    if (appStatus !== 'connected') return;

    const query = `
      *[_type == "user" && _id == "${userAccount}"][0]
    `
    const response = await client.fetch(query)
    setCurrentUser(response)
  }

  /**
   * Gets the Current lottery.
   */
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

  /**
   * Gets the last lottery.
   */
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
        currentAccount,
        userBalance,
        connectWallet,
        disconnectWallet,
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
