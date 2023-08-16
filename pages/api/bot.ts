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
  let stockStatus = 'red';
  var newsSentiment = 1;
  var vwap: number;
  var ema9: number;
  var ema200: number;
  var hod;
  let resistanceLevels: number[] = [];

  const ticker = req.query.stock;
  let currentVolume = 1000
  if (ticker) {

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

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

    let yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);

    let newsStartTime = yesterdayDate.getUTCFullYear().toString()
      + pad(yesterdayDate.getUTCMonth() + 1) // Months are 0-indexed so we need to add 1
      + pad(yesterdayDate.getUTCDate())
      + 'T'
      + pad(yesterdayDate.getUTCHours())
      + pad(yesterdayDate.getUTCMinutes());

    //newsStartTime = '20230812T0130'
    //console.log('time from: ' + timeFrom)
    // get news sentiment data for ticker
    //var timeFrom = '20220410T0130' // ... your logic here;


    const axios = require('axios');
    var url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&time_from=${newsStartTime}&apikey=Y9TTQONCEK13TRG9`;
    var news: any;

    (async function getNews() {
      const res = await axios.get(url, { headers: { 'User-Agent': 'request' } });
      if (res.status !== 200) {
        console.log('Status:', res.status);
      } else {
        const newsData = res.data;
        news = res.data;
        if (newsData && newsData.feed) {
          let len = Math.min(2, newsData.feed.length);
          for (let i = 0; i < len; i++) {
            //news = newsData.feed[i]

            let item = newsData.feed[i];
            if (item.overall_sentiment_score >= 0.35)
              newsSentiment = 1;
            else if (item.overall_sentiment_score <= -0.15)
              newsSentiment = 0
            else
              newsSentiment = 0.5;
          }
        }
      }
    })().catch((error) => console.error(error));

    //console.log(news);

    //res.write("news: " + JSON.stringify(news) + "\n\n");


    // prepare to read for yahoo finance live stock data
    const root = protobuf.loadSync('./YPricingData.proto');
    const Yaticker = root.lookupType("yaticker");

    //open webscket connection with finance live stock data provider
    const wsc = new ws('wss://streamer.finance.yahoo.com');


    wsc.on('open', () => {
      console.log('connected');
      wsc.send(JSON.stringify({ subscribe: [ticker] }));
    });

    wsc.on('close', () => {
      console.log('disconnected');
    });

    wsc.on('message', (data: string) => {
      const decodedData: any = Yaticker.decode(Buffer.from(data as string, 'base64'));
      //console.log(decodedData)
      // no open stock position
      //if (!stockActive) {

      //call python script to get indicators from yahoo
      const { exec } = require('child_process');
      const argsArray = volumes; // Replace with your array
      const stockTicker = ticker;
      exec(`python indicators.py ${stockTicker} `, (error: { message: any; }, stdout: any, stderr: any) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return;
        }
        // get vwap from python and set buy status
        console.log(`Python Output: ${stdout}`);
        try {
          //const indicators = JSON.parse(stdout);
          //const vwap = indicators['vwap'];
          //const ema9 = indicators['ema9'];
          //const ema200 = indicators['ema200'];
        } catch (e) {
          console.error('Error parsing python output', e);
        }
      });

      // stream price to frontend
      const result = { name: ticker, price: decodedData.price.toFixed(4), status: stockStatus, news: news };


      // if indicators checkout, then proceed
      if ((result.price) > vwap && (result.price > ema200) && (result.price > ema9) && (newsSentiment == 1)) {
        stockStatus = 'yellow'


      }

      res.write("data: " + JSON.stringify(result) + "\n\n");

    });
  }
  else {
    // unmount stock
    // status = false
  }

});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use((req, res) => {
  res.status(405).json({ message: 'Method Not Allowed' });
});

export default app;
