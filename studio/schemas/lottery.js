export default {
  name: 'lottery',
  title: 'Lottery',
  type: 'document',
  fields: [    
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
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'topDeposit',
      title: 'Top Deposit',
      type: 'string',
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
      to: {type: 'user'}
    },
  ],

  preview: {
    select: {
      title: 'start',
      winner: 'winner.walletAddress',
    },
    prepare(selection) {
      const {winner} = selection
      return Object.assign({}, selection, {
        subtitle: winner && `winner - ${winner}`
      })
    }
  }
}
