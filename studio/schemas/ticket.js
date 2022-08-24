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
      name: 'user',
      title: 'User Wallet Address',
      type: 'reference',
      to: {type: 'user'},
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'lid',
      title: 'Lottery Id',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    // {
    //   name: 'lid',
    //   title: 'Lottery Id',
    //   type: 'reference',
    //   to: {type: 'lottery'},
    //   validation: (Rule) => Rule.required(),
    // },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
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
