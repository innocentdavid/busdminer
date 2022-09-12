import { ticketNumberGenerator } from '../../lib/functions';
import client from './config'

export default async function play(req, res) {
  const { user, lotteryId, ticket } = JSON.parse(req.body)
  if (!user) return res.status(500).json({ message: `user not connected` });

  let list = []
  for (let i = 0; i < ticket; i++) {
    const ticketNumber = ticketNumberGenerator()
    const t = user._id + "_" + ticketNumber
    list.push(t)
  }
  
  try {
    const resp = await client
      .patch(lotteryId)
      .setIfMissing({ ticketsPlayed: [] })
      .insert('after', 'ticketsPlayed[-1]', list)
      .dec({ totalTicket: parseInt(ticket) })
      .commit()
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: `Couldn't play`, err })
  }

  await client
    .patch(user._id)
    .dec({ ticket: parseInt(ticket) })
    .commit()

  return res.status(200).json({ message: 'success' })
}