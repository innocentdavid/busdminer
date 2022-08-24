export default {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'lid',
      title: 'Lottery Id',
      type: 'string',
    },
    {
      name: 'start',
      title: 'Start',
      type: 'string',
    },
    {
      name: 'end',
      title: 'End',
      type: 'string',
    },
    {
      name: 'initialPrize',
      title: 'Initial Prize',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'winner',
      title: 'Winner',
      type: 'reference',
      to: {type: 'user'},
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'winnerTicket',
      title: 'Winner Ticket',
      type: 'string',
    },
    {
      name: 'topDeposit',
      title: 'Top Deposit',
      type: 'string',
    },
    {
      name: 'totalTicket',
      title: 'Total Ticket',
      type: 'string',
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
      start: 'start',
      end: 'end',
    },
    prepare(selection) {
      const {start, end} = selection
      return Object.assign({}, selection, {
        subtitle: `${start} to ${end}`
      })
    }
  }
}
