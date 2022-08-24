export default {
  name: 'ticket',
  title: 'Ticket',
  type: 'document',
  fields: [
    {
      name: 'uid',
      title: 'User Wallet Address',
      type: 'reference',
      to: {type: 'user'},
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'ticket_id',
      title: 'Ticket Id',
      type: 'string',
    },
    {
      name: 'prize',
      title: 'Prize',
      type: 'string',
    },
    {
      name: 'lid',
      title: 'Lottery Id',
      type: 'reference',
      to: {type: 'lottery'},
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'user',
      title: 'User Wallet Address',
      type: 'reference',
      to: {type: 'user'},
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    },
  ],

  preview: {
    select: {
      winnerAddress: 'user.walletAddress',
      lottery: 'lottery.lid',
      ticket: 'ticket.tid'
    },
    prepare(selection) {
      const {lottery} = selection
      return Object.assign({}, selection, {
        subtitle: lottery && `for ${lottery}`
      })
    }
  }
}
