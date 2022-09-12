export default {
  name: 'lottery',
  title: 'Lottery',
  type: 'document',
  initialValue: {
    current: false,
    topDeposit: 0,
    tickets: [],
  },
  fields: [
    {
      name: 'current',
      title: 'Current ?',
      type: 'boolean'
    },
    {
      name: 'initialPrize',
      title: 'Initial Prize',
      type: 'string'
    },
    {
      name: 'start',
      title: 'Start',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'end',
      title: 'End',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'totalTicket',
      title: 'Total Ticket',
      type: 'number',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'topDeposit',
      title: 'Top Deposit',
      type: 'number',
    },
    {
      name: 'winningTicket',
      title: 'Winning Ticket',
      type: 'string',
    },
    {
      name: 'winner',
      title: 'Winner',
      type: 'reference',
      to: { type: 'user' }
    },
    {
      name: 'ticketsPlayed',
      title: 'Tickets',
      type: 'array',
      of: [{ type: 'string' }],
    },
  ],

  preview: {
    select: {
      title: 'start',
      winner: 'winner.walletAddress',
      current: 'current',
      tickets: 'ticketsPlayed',
    },
    prepare(selection) {
      const { winner, current, tickets } = selection
      return Object.assign({}, selection, {
        subtitle: winner ? `winner - ${winner}` : `current? ${current}; played: ${tickets?.length}`
      })
    }
  }
}
