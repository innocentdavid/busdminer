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
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    },
  ],

  preview: {
    select: {
      title: 'walletAddress'
    }
  }
}
