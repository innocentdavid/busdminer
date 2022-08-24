export default {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'walletAddress',
      title: 'Wallet Address',
      type: 'string',
    },
    {
      name: 'tickets',
      title: 'Tickets',
      type: 'array',
      of: [{type: 'string'}]
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
      walletAddress: 'walletAddress'
    },
    prepare(selection) {
      const {walletAddress} = selection
      return Object.assign({}, selection, {
        subtitle: walletAddress && `${walletAddress}`
      })
    }
  }
}
