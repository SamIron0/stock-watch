import { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    const bot = {
      name: 'genie',
      price: 0
    };
    //-------------
    const ticker = 'BBIG';
    const url = 'https://twelve-data1.p.rapidapi.com/price?symbol=AMZN&format=json&outputsize=30';
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.XRapidAPIKey,
        'X-RapidAPI-Host': process.env.XRapidAPIHTMLOListElement
      }
    };

    try {
      
      const response = await fetch(url, options);
      const result = await response.text();
      const bot2 = {
        name: ticker,
        price: result
      };
      res.status(200).json(bot2);

    } catch (error) {
      console.error(error);
    }



    //-------------


  }
  else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default handler;
