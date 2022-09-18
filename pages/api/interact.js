import { ticketNumberGenerator } from '../../lib/functions';

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

const web3 = createAlchemyWeb3(process.env.NEXT_PUBLIC_BSC_RPC_URL);
import client from "./config";
import { dappconfig } from "./dapp.config";

const contract = require("../artifacts/contracts/Raffle.sol/Raffle.json");
const raffleContract = new web3.eth.Contract(
  contract.abi,
  dappconfig.contractAddress
);

// export const getTotalMinted = async () => {
//   const totalMinted = await raffleContract.methods.totalSupply().call()
//   return totalMinted
// }

// export const getMaxSupply = async () => {
//   const maxSupply = await raffleContract.methods.maxSupply().call()
//   return maxSupply
// }

// export const isPausedState = async () => {
//   const paused = await raffleContract.methods.paused().call()
//   return paused
// }

// export const isPublicSaleState = async () => {
//   const publicSale = await raffleContract.methods.publicM().call()
//   return publicSale
// }

// export const isPreSaleState = async () => {
//   const preSale = await raffleContract.methods.presaleM().call()
//   return preSale
// }

// export const getPrice = async () => {
//   const price = await raffleContract.methods.price().call()
//   return price
// }

export const enterRaffle = async (lotteryId, ticketAmount) => {
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: "To be able to play, you need to connect your wallet",
    };
  }

  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    "latest"
  );
//
  // Set up our Ethereum transaction
  const tx = {
    to: dappconfig.contractAddress,
    from: window.ethereum.selectedAddress,
    value: parseInt(
      web3.utils.toWei(String(dappconfig.price * ticketAmount), "ether")
    ).toString(16), // hex
    data: raffleContract.methods
      .enterRaffle(window.ethereum.selectedAddress, ticketAmount)
      .encodeABI(),
    nonce: nonce.toString(16),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [tx],
    });

    if (txHash) {
      let list = []
      for (let i = 0; i < ticketAmount; i++) {
        const ticketNumber = ticketNumberGenerator()
        const t = window.ethereum.selectedAddress + "_" + ticketNumber
        list.push(t)
      }

      await client
        .patch(lotteryId)
        .setIfMissing({ ticketsPlayed: [] })
        .insert('after', 'ticketsPlayed[-1]', list)
        .dec({ totalTicket: parseInt(ticketAmount) })
        .commit()

      return {
        success: true,
        status: (
          <a href={`https://rinkeby.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer">
            <p>✅ Check out your transaction on Etherscan:</p>
            <p>{`https://rinkeby.etherscan.io/tx/${txHash}`}</p>
          </a>
        ),
      };
    }
  } catch (error) {
    return {
      success: false,
      status: "😞 Smth went wrong:" + error.message,
    };
  }
};
