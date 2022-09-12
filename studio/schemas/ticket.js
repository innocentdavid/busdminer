export default {
  name: 'ticket',
  title: 'Ticket',
  type: 'document',
  fields: [
    {
      name: 'tid',
      title: 'Ticket Id',
      type: 'string',
    },
    {
      name: 'userWallet',
      title: 'User Wallet',
      type: 'string',
    },
    {
      name: 'lid',
      title: 'Lottery Id',
      type: 'string',
    },
  ],

  preview: {
    select: {
      title: 'tid',
      lottery: 'lottery._id'
    },
    prepare(selection) {
      const {lottery} = selection
      return Object.assign({}, selection, {
        subtitle: lottery && `lotteryId - ${lottery}`
      })
    }
  }
}
