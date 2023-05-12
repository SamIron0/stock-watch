
import { useState, useEffect } from 'react';

type StockData = {
  name: string,
  price: number
};

const Card = () => {
  const [stockData, setStockData] = useState<StockData>({ name: '', price: 0 });

  useEffect(() => {
    const fetchStockData = async () => {
      const response = await fetch('/api/trading-bot');
      const data = await response.json();
      setStockData(data);
    };

    const interval = setInterval(fetchStockData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>{stockData.name}</h2>
      <p>Price: {stockData.price}</p>
    </div>
  );
};

export default Card;