'use strict';

import express from 'express';
import ws from 'ws';
import protobuf from 'protobufjs';
//import { Timer } from 'set-interval';

const app = express();
const port = 4000;
const cors = require('cors');

// Use cors middleware
app.use(cors());


app.get('/api/bot', (req, res) => {
  let status = false;

  const ticker = req.query.stock;
  let currentVolume = 1000
  if (ticker) {
    var sentiment;

    let volumes: number[] = [];
    const trackVolume = () => {
      volumes.push(currentVolume);
      //console.log(currentVolume)
    }
    // Add a new volume every minute (60000 milliseconds)
    setInterval(trackVolume, 60000);

    // get the time 48 hours ago
    var currentDate = new Date();
    currentDate.setHours(currentDate.getHours() - 48); // Subtract 48 hours


    let pad = function (number: number): string {
      return (number < 10 ? '0' : '') + number.toString();
    }

    var timeFrom = currentDate.getUTCFullYear().toString()
      + pad(currentDate.getUTCMonth() + 1) // Months are 0-indexed so we need to add 1
      + pad(currentDate.getUTCDate())
      + 'T'
      + pad(currentDate.getUTCHours())
      + pad(currentDate.getUTCMinutes());
    timeFrom = '20220410T0130'
    //console.log('time from: ' + timeFrom)
    // get news sentiment data for ticker
    //var timeFrom = '20220410T0130' // ... your logic here;
    var url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${ticker}&apikey=Y9TTQONCEK13TRG9}&limit=3`;
    var request = require('request');

    request.get({
      url: url,
      json: true,
      headers: { 'User-Agent': 'request' }
    }, (err: any, res: { statusCode: number; }, data: any) => {
      if (err) {
        console.log('Error:', err);
      } else if (res.statusCode !== 200) {
        console.log('Status:', res.statusCode);
      } else {
        // data is successfully parsed as a JSON object:
        // ensure data is an array before attempting to use Array methods
        console.log(data);

        if (Array.isArray(data)) {
          console.log(data);

          data.forEach((item: any) => {

            var sentiment;
            if (item.overall_sentiment_score >= 0.35)
              sentiment = 1;
            else if (item.overall_sentiment_score <= -0.15)
              sentiment = 0;
            else
              sentiment = 0.5;
          });
        }

      }
    })

    // console.log(sentiment);

    // prepare to read for yahoo finance live stock data
    const root = protobuf.loadSync('./YPricingData.proto');
    const Yaticker = root.lookupType("yaticker");

    //open webscket connection with finance live stock data provider
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
      exec(`python buy.py ${stockTicker}`, (error: { message: any; }, stdout: any, stderr: any) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return;
        }
        // get output from python and set buy status
        console.log(`Python Output: ${stdout}`);
        if (stdout) {
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
