export const userAndReferrerFields = `
  'user': user->{_id, tel, level, myTicket, referrer, roi, ri, vrs, tbalance, lastChecked, isAdmin, isValid, lastWithdrawDate, isAdmin},
  'referrer': referrer->{_id, tel, level, myTicket, referrer, roi, ri, vrs, tbalance, lastChecked, isAdmin, isValid, lastWithdrawDate, isAdmin},
`
export const formatWalletAddress = (address) => {
return `${address.slice(0, 5)}...${address.slice(12, 16)}`
}