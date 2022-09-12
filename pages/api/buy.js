import client from './config'

export default async function play(req, res) {
  const { user, balance, ticket } = JSON.parse(req.body)
  if (!user) return res.status(500).json({ message: `user not connected` });
  // if (balance < ticket) return res.status(500).json({ message: `Not enough money to buy this ticket` });

  try {
    await client
      .patch(user._id)
      .inc({ ticket: parseInt(ticket) })
      .commit()
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: `Couldn't buy ticket`, err })
  }
  return res.status(200).json({ message: 'success' })
}