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
  var numberOfRuns = 0;
  var hod;
  let resistanceLevels: number[] = [];

  const ticker = req.query.stock;
  let currentVolume = 1000;
  if (ticker) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let volumes: number[] = [];
    const trackVolume = () => {
      volumes.push(currentVolume);
      //console.log(currentVolume)
    };
    // Add a new volume every minute (60000 milliseconds)
    setInterval(trackVolume, 60000);

    let pad = function (number: number): string {
      return (number < 10 ? '0' : '') + number.toString();
    };

    //-----------------------------------------------------
    // - get all news within the past 24 hours
    // - If news is relevant and bullish, save the ticker symbol.
    //-----------------------------------------------------
    let stocksWithNews: any[] = [];
    let importantStocksNews: any[] = [];
    let yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);

    let newsStartTime =
      yesterdayDate.getUTCFullYear().toString() +
      pad(yesterdayDate.getUTCMonth() + 1) + // Months are 0-indexed so we need to add 1
      pad(yesterdayDate.getUTCDate()) +
      'T' +
      pad(yesterdayDate.getUTCHours()) +
      pad(yesterdayDate.getUTCMinutes());

    //console.log('time from: ' + timeFrom)

    const axios = require('axios');
    var url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&time_from=${newsStartTime}&apikey=${process.env.ALPHAVANTAGE_KEY}`;
    var news: any;

    (async function getNews() {
      const res = await axios.get(url, {
        headers: { 'User-Agent': 'request' }
      });
      if (res.status !== 200) {
        console.log('Status:', res.status);
      } else {
        const newsData = res.data;
        news = res.data;
        if (newsData && newsData.feed) {
          let len = Math.min(20, newsData.feed.length);
          for (let i = 0; i < len; i++) {
            //news = newsData.feed[i]
            let sc = newsData.feed[i].overall_sentiment_score;

            // only interested in news with sentiment score above 0.15
            if (0.15 <= sc) {
              for (
                let j = 0;
                j < newsData.feed[i].ticker_sentiment.length;
                j++
              ) {
                if (
                  parseFloat(
                    newsData.feed[i].ticker_sentiment[j].relevance_score
                  ) > 0.4
                ) {
                  //console.log(ticker_sentiment[i])
                  stocksWithNews.push(
                    newsData.feed[i].ticker_sentiment[j].ticker
                  );
                  importantStocksNews.push({
                    ticker: newsData.feed[i].ticker,
                    title: newsData.feed[i].title,
                    url: newsData.feed[i].url
                  });
                }
              }
            }
          }
        }
      }
      //console.log(stocksWithNews);
    })().catch((error) => console.error(error));

    // prepare to read for yahoo finance live stock data
    const root = protobuf.loadSync('./YPricingData.proto');
    const Yaticker = root.lookupType('yaticker');

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
      const decodedData: any = Yaticker.decode(
        Buffer.from(data as string, 'base64')
      );
      //console.log(decodedData)
      // no open stock position
      //if (!stockActive) {

      //call python script to get indicators from yahoo
      const { exec } = require('child_process');
      const argsArray = volumes; // Replace with your array
      const stockTicker = ticker;
      exec(
        `python indicators.py ${stockTicker} `,
        (error: { message: any }, stdout: any, stderr: any) => {
          if (error) {
            console.error(`Error: ${error.message}`);
            return;
          }
          try {
            const indicators = JSON.parse(stdout);
            const vwap = indicators['vwap'];
            const ema9 = indicators['ema9'];
            const ema200 = indicators['ema200'];
            //console.log(vwap)
          } catch (e) {
            console.error('Error parsing python output', e);
          }
        }
      );

      // if indicators checkout, then proceed
      if (
        !(
          decodedData.price.toFixed(4) > vwap &&
          decodedData.price.toFixed(4) > ema200 &&
          decodedData.price.toFixed(4) > ema9 &&
          newsSentiment == 1
        )
      ) {
        stockStatus = 'green';
      }

      // stream price to frontend
      const result = {
        name: ticker,
        price: decodedData.price.toFixed(4),
        status: stockStatus,
        news: numberOfRuns == 0 ? importantStocksNews : []
      };
      numberOfRuns = numberOfRuns + 1;
      res.write('data: ' + JSON.stringify(result) + '\n\n');
    });
  } else {
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
