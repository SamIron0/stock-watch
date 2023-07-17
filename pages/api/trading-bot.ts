import { NextApiHandler } from 'next';

import WebSocket from 'isomorphic-ws';
import protobuf from 'protobufjs';

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    const { ticker } = req.query;
    try {
      const root = protobuf.loadSync('./YPricingData.proto');
      const Yaticker = root.lookupType("yaticker");

      const ws = new WebSocket('wss://streamer.finance.yahoo.com');

      ws.onopen = () => {
        console.log('connected');
        ws.send(JSON.stringify({
          subscribe: [ticker]
        }));
      };

      ws.onclose = () => {
        console.log('disconnected');
      };

      ws.onmessage = (data: WebSocket.MessageEvent) => {
        console.log('incoming message');
        const message = Yaticker.decode(Buffer.from(data.data as string, 'base64'));
        //console.log(Yaticker.decode(Buffer.from(data.data as string, 'base64')));
        const bot2 = {
          name: ticker,
          price: message.price
        };
        res.status(200).json(bot2);
      };


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
