import { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    const bot = {
      name: 'genie',
      price: 0
    };
    res.status(200).json(bot);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default handler;
