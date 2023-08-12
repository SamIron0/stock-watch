import axios from "axios";
import cheerio from "cheerio";
import { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
    if (req.method === 'GET') {

        const { data } = await axios.get('https://finviz.com/news.ashx');
        const $ = cheerio.load(data);
        const news: string[] = [];

        $("#news-table tr").each((index, element) => {
            const content = $(element).find("td").text();
            if (content) {
                news.push(content);
            }
        });

        res.status(200).json({ news });
    }
};
