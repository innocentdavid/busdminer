import client from './config'

export default async function createUser(req, res) {
  const { walletAddress } = JSON.parse(req.body)
  try {
    await client.create({
      _type: 'user',
      walletAddress,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({message: `Couldn't create user`, err})
  }
  return res.status(200).json({ message: 'User created' })
}