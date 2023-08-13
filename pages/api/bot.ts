import express from 'express';
import ws from 'ws';
import protobuf from 'protobufjs';
//import { Timer } from 'set-interval';

const app = express();
const port = 4000;
const cors = require('cors');
let status = false;

// Use cors middleware
app.use(cors());

app.get('/api/bot', (req, res) => {
  const ticker = req.query.stock;
  let currentVolume = 1000
  if (ticker) {
    let volumes: number[] = [];
    const trackVolume = () => {
      volumes.push(currentVolume);
      console.log(currentVolume)
    }
    // Add a new volume every minute (60000 milliseconds)
    setInterval(trackVolume, 60000);

    // prepare readfile for yahoo finance data
    const root = protobuf.loadSync('./YPricingData.proto');
    const Yaticker = root.lookupType("yaticker");

    //open webscket connection with yfinance
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
      const decodedData: any = Yaticker.decode(Buffer.from(data as string, 'base64'));
      const result = { name: ticker, price: decodedData.price.toFixed(4) };

      //call python script
      const { exec } = require('child_process');
      const argsArray = volumes; // Replace with your array
      const stockTicker = ticker;
      exec(`python buy.py ${argsArray.join(' ')} ${stockTicker}`, (error: { message: any; }, stdout: any, stderr: any) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return;
        }
        // get output from python and set buy status
        console.log(`Python Output: ${stdout}`);
        if (stdout == 'buy') {
          // buy
          status = true
        }
      });

      // stream price to frontend
      res.write("data: " + JSON.stringify(result) + "\n\n");
    });
  }
  else {
    // unmount stock
    status = false
  }

});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use((req, res) => {
  res.status(405).json({ message: 'Method Not Allowed' });
});

export default app;
