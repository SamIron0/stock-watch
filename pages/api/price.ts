import express from 'express';
import ws from 'ws';
import protobuf from 'protobufjs';
//import { toBase64 } from 'byte-buffer';

const app = express();
const port = process.env.PORT || 4000;

app.get('/api/price', (req, res) => {
  //const ticker = req.params.ticker;
  const ticker = 'BTC-USD'
  const root = protobuf.loadSync('./YPricingData.proto');
  const Yaticker = root.lookupType("yaticker");
  
  const wsc = new ws('wss://streamer.finance.yahoo.com');

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  
  wsc.on('open', () => {
    console.log('connected');
    wsc.send(JSON.stringify({ subscribe: [ticker] }));
  });

  wsc.on('close', () => {
    console.log('disconnected');
  });

  wsc.on('message', (data: string) => {
    console.log('incoming message');

    const decodedData: any = Yaticker.decode(Buffer.from(data as string, 'base64'));
   const result = { name: ticker, price: decodedData.price.toFixed(4) };
    
    res.write(JSON.stringify(result));
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use((req, res) => {
  res.status(405).json({ message: 'Method Not Allowed' });
});

export default app;
