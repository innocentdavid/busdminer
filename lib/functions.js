export const formatWalletAddress = (address) => {
  return `${address.slice(0, 4)}...${address.slice(38, 42)}`
}

export const ticketNumberGenerator = function () {
  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const randomLetter = Math.floor(Math.random() * letters.length);
  const numbers = Math.floor(Math.random() * 100000);

  return letters[randomLetter].toUpperCase() + numbers;
};