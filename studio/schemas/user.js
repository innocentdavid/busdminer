export default {
  name: 'user',
  title: 'User',
  type: 'document',
  initialValue: {
    ticket: 0
  },
  fields: [
    {
      name: 'walletAddress',
      title: 'Wallet Address',
      type: 'string',
    },
    {
      name: 'ticket',
      title: 'Ticket',
      type: 'number',
    },
  ],

  preview: {
    select: {
      title: 'walletAddress',
      ticket: 'ticket',
    },
    prepare(selection) {
      const {ticket} = selection
      return Object.assign({}, selection, {
        subtitle: ticket
      })
    }
  }
}