import protobuf from 'protobufjs';
import React, { useMemo, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

type StockData = {
  name: string;
  price: string;
  status: string;
  news: any;
};

interface Props {
  title: ReactNode;
  price?: number;
  footer?: ReactNode;
  children: ReactNode;
  status: ReactNode;
}

type NewsType = {
  ticker: string;
  url: string;
  title: string;
};

function PlanCard({ title, price, footer, children, status }: Props) {
  return (
    <div className="border border-zinc-700	max-w-[500px] p rounded-md m-auto">
      <div className="px-5 py-4">
        <div className="flex justify-between">
          <p className="text-left">{title}</p>
          <p className="text-right"></p>

          <div className="flex items-center">{status}</div>
        </div>
        {children}
      </div>
      <div className="border-t border-zinc-700 bg-zinc-900 p-4 text-zinc-500 rounded-b-md">
        {footer}
      </div>
    </div>
  );
}

const Card = () => {
  const [ws, setWs] = useState<WebSocket>();
  const [ticker1, setTicker1] = useState<string>('');
  const [ticker2, setTicker2] = useState<string>('');
  const [ticker3, setTicker3] = useState<string>('');
  const [ticker4, setTicker4] = useState<string>('');
  const [stockData1, setStockData1] = useState<StockData>({
    name: '',
    price: '',
    status: '',
    news: []
  });
  const [stockData2, setStockData2] = useState<StockData>({
    name: '',
    price: '',
    status: '',
    news: []
  });
  const [stockData3, setStockData3] = useState<StockData>({
    name: '',
    price: '',
    status: '',
    news: []
  });
  const [stockData4, setStockData4] = useState<StockData>({
    name: '',
    price: '',
    status: '',
    news: []
  });
  const [inputValue1, setInputValue1] = useState('');
  const [inputValue2, setInputValue2] = useState('');
  const [inputValue3, setInputValue3] = useState('');
  const [inputValue4, setInputValue4] = useState('');
  const [news1, setNews1] = useState([]);
  const [news2, setNews2] = useState<NewsType[]>([]);
  const [news3, setNews3] = useState<NewsType[]>([]);
  const [news4, setNews4] = useState<NewsType[]>([]);
  const handleInputChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue1(event.target.value);
  };
  const handleInputChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue2(event.target.value);
  };
  const handleInputChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue3(event.target.value);
  };
  const handleInputChange4 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue4(event.target.value);
  };

  useEffect(() => {
    const eventSource = new EventSource(`/api/bot/?stock=${ticker1}`);
    eventSource.onopen = (event) => console.log('connection opened');
    eventSource.onerror = (event) => console.log('connection errored');

    eventSource.onmessage = (event) => {
      //console.log('incoming message');
      // This is the stock data

      const data = JSON.parse(event.data);
      //console.log(data);
      setStockData1(data);
      if (stockData1.news) {
        console.log('news valid');
        setNews1(stockData1.news);
      }
    };
    return () => eventSource.close();
  }, [ticker1]);

  useEffect(() => {
    const eventSource = new EventSource(`/api/bot/?stock=${ticker2}`);
    eventSource.onopen = (event) => console.log('connection opened', event);
    eventSource.onerror = (event) => console.log('connection errored', event);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStockData2(data);
    };
    return () => eventSource.close();
  }, [ticker2]);

  useEffect(() => {
    const eventSource = new EventSource(`/api/bot/?stock=${ticker3}`);
    eventSource.onopen = (event) => console.log('connection opened', event);
    eventSource.onerror = (event) => console.log('connection errored', event);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStockData3(data);
    };
    return () => eventSource.close();
  }, [ticker3]);
  useEffect(() => {
    const eventSource = new EventSource(`/api/bot/?stock=${ticker4}`);
    eventSource.onopen = (event) => console.log('connection opened', event);
    eventSource.onerror = (event) => console.log('connection errored', event);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStockData3(data);
    };
    return () => eventSource.close();
  }, [ticker4]);

  /*
  if (stockData2?.news?.length != 0) {
    setNews2(stockData2.news);
  }

  if (stockData3?.news?.length != 0) {
    setNews3(stockData3.news);
  }

  if (stockData4?.news?.length != 0) {
    setNews4(stockData4.news);
  }
*/
  return (
    <section>
      <div className="sm:flex px-4  sm:flex-col h-screen sm:align-center">
        <div className="border border-zinc-700 w-full h-full rounded-md m-auto my-1">
          <div className="px-2 py-2">
            <div className="flex overflow-x-scroll space-x-4">
              <PlanCard
                title={
                  <input
                    type="text"
                    value={inputValue1}
                    onChange={handleInputChange1}
                    className="px-1 py-1 border rounded-md border-gray-300 bg-transparent"
                    placeholder="Enter stock ticker"
                  />
                }
                footer={
                  <div className="flex items-start justify-between  text-black flex-col sm:flex-row sm:items-center">
                    <button
                      onClick={() => setTicker1(inputValue1)}
                      className="group rounded-full px-4 py-1 text-[13px]  font-semibold transition-all flex items-center justify-center bg-white text-white hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] no-underline flex gap-x-2  active:scale-95 scale-100 duration-75"
                    >
                      <p className="text-black"></p>ADD
                    </button>
                  </div>
                }
                status={
                  stockData1.status === 'red' ? (
                    <div
                      style={{
                        backgroundColor: 'red',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%'
                      }}
                    ></div>
                  ) : stockData1.status === 'yellow' ? (
                    <div
                      style={{
                        backgroundColor: 'yellow',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%'
                      }}
                    ></div>
                  ) : stockData1.status === 'green' ? (
                    <div
                      style={{
                        backgroundColor: 'green',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%'
                      }}
                    ></div>
                  ) : null
                }
              >
                <div className="w-[400px]">
                  <div className="text-xl mt-6 h-xl mb-4 flex justify-between ">
                    <div className="flex text-[16px] items-center">
                      {' '}
                      {/* Aligns first word to the left */}
                      <span className="font-bold">Price</span>
                    </div>
                    <div className="flex  text-[15px] items-center">
                      {' '}
                      {/* Aligns second word to the right */}
                      <span className="">{stockData1.price}</span>
                    </div>
                  </div>
                  <div className="text-xl  h-xl mb-4 flex justify-between ">
                    <div className="flex   text-[16px] items-center">
                      {' '}
                      {/* Aligns first word to the left */}
                      <span className="font-bold">Average price</span>
                    </div>
                    <div className="flex text-[15px] items-center">
                      {' '}
                      {/* Aligns second word to the right */}
                      <span className=""></span>
                    </div>
                  </div>
                  <div className="text-xl h-md h-xl mb-4 flex justify-between ">
                    <div className="flex  text-[16px] items-center">
                      {' '}
                      {/* Aligns first word to the left */}
                      <span className="font-bold">% of trading account</span>
                    </div>
                    <div className="flex text-[15px] items-center">
                      {' '}
                      {/* Aligns second word to the right */}
                      <span className=""></span>
                    </div>
                  </div>
                  <div className="text-xl h-md mb-4 flex justify-between ">
                    <div className="flex text-[15px] items-center">
                      {' '}
                      {/* Aligns first word to the left */}
                      <span className="font-bold">Today's return</span>
                    </div>
                    <div className="flex  text-[16px] text-[15px] items-center">
                      {' '}
                      {/* Aligns second word to the right */}
                      <span className=""></span>
                    </div>
                  </div>
                  <div className="text-xl  h-xl mb-4 flex justify-between ">
                    <div className="flex text-[16px] items-center">
                      {' '}
                      {/* Aligns first word to the left */}
                      <span className="font-bold ">Total Return</span>
                    </div>
                    <div className="flex  text-[15px] items-center">
                      {' '}
                      {/* Aligns second word to the right */}
                      <span className="">
                        ${parseInt(stockData1.price) / 100 - 5}
                      </span>
                    </div>
                  </div>
                </div>
              </PlanCard>
              <PlanCard
                title={
                  <input
                    type="text"
                    value={inputValue2}
                    onChange={handleInputChange2}
                    className="px-1 py-1 border rounded-md border-gray-300 bg-transparent"
                    placeholder="Enter stock ticker"
                  />
                }
                status={
                  stockData2.status === 'red' ? (
                    <div
                      style={{
                        backgroundColor: 'red',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%'
                      }}
                    ></div>
                  ) : stockData2.status === 'yellow' ? (
                    <div
                      style={{
                        backgroundColor: 'yellow',
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%'
                      }}
                    ></div>
                  ) : stockData2.status === 'green' ? (
                    <div
                      style={{
                        backgroundColor: 'green',
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%'
                      }}
                    ></div>
                  ) : null
                }
                footer={
                  <div className="flex items-start justify-between  text-black flex-col sm:flex-row sm:items-center">
                    <button
                      onClick={() => setTicker2(inputValue2)}
                      className="group rounded-full px-4 py-1 text-[13px]  font-semibold transition-all flex items-center justify-center bg-white text-white hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] no-underline flex gap-x-2  active:scale-95 scale-100 duration-75"
                    >
                      <p className="text-black"></p>ADD
                    </button>
                  </div>
                }
              >
                <div className="w-[400px]">
                  <div className="text-xl mt-6 h-xl mb-4 flex justify-between ">
                    <div className="flex text-[16px] items-center">
                      {' '}
                      {/* Aligns first word to the left */}
                      <span className="font-bold">Price</span>
                    </div>
                    <div className="flex  text-[15px] items-center">
                      {' '}
                      {/* Aligns second word to the right */}
                      <span className="">{stockData2.price}</span>
                    </div>
                  </div>
                  <div className="text-xl  h-xl mb-4 flex justify-between ">
                    <div className="flex   text-[16px] items-center">
                      {' '}
                      {/* Aligns first word to the left */}
                      <span className="font-bold">Average price</span>
                    </div>
                    <div className="flex text-[15px] items-center">
                      {' '}
                      {/* Aligns second word to the right */}
                      <span className=""></span>
                    </div>
                  </div>
                  <div className="text-xl h-md h-xl mb-4 flex justify-between ">
                    <div className="flex  text-[16px] items-center">
                      {' '}
                      {/* Aligns first word to the left */}
                      <span className="font-bold">% of trading account</span>
                    </div>
                    <div className="flex text-[15px] items-center">
                      {' '}
                      {/* Aligns second word to the right */}
                      <span className=""></span>
                    </div>
                  </div>
                  <div className="text-xl h-md mb-4 flex justify-between ">
                    <div className="flex text-[15px] items-center">
                      {' '}
                      {/* Aligns first word to the left */}
                      <span className="font-bold">Today's return</span>
                    </div>
                    <div className="flex  text-[16px] text-[15px] items-center">
                      {' '}
                      {/* Aligns second word to the right */}
                      <span className=""></span>
                    </div>
                  </div>
                  <div className="text-xl  h-xl mb-4 flex justify-between ">
                    <div className="flex text-[16px] items-center">
                      {' '}
                      {/* Aligns first word to the left */}
                      <span className="font-bold ">Total Return</span>
                    </div>
                    <div className="flex  text-[15px] items-center">
                      {' '}
                      {/* Aligns second word to the right */}
                      <span className="">$0</span>
                    </div>
                  </div>
                </div>
              </PlanCard>
              <PlanCard
                title={
                  <input
                    type="text"
                    value={inputValue3}
                    onChange={handleInputChange3}
                    className="px-1 py-1 border rounded-md border-gray-300 bg-transparent"
                    placeholder="Enter stock ticker"
                  />
                }
                status={
                  stockData3.status === 'red' ? (
                    <div
                      style={{
                        backgroundColor: 'red',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%'
                      }}
                    ></div>
                  ) : stockData3.status === 'green' ? (
                    <div
                      style={{
                        backgroundColor: 'green',
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%'
                      }}
                    ></div>
                  ) : stockData3.status === 'yellow' ? (
                    <div
                      style={{
                        backgroundColor: 'yellow',
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%'
                      }}
                    ></div>
                  ) : null
                }
                footer={
                  <div className="flex items-start justify-between  text-black flex-col sm:flex-row sm:items-center">
                    <button
                      onClick={() => setTicker3(inputValue3)}
                      className="group rounded-full px-4 py-1 text-[13px]  font-semibold transition-all flex items-center justify-center bg-white text-white hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] no-underline flex gap-x-2  active:scale-95 scale-100 duration-75"
                    >
                      <p className="text-black"></p>ADD
                    </button>
                  </div>
                }
              >
                <div className="w-[400px]">
                  <div className="text-xl mt-6 h-xl mb-4 flex justify-between ">
                    <div className="flex text-[16px] items-center">
                      {' '}
                      {/* Aligns first word to the left */}
                      <span className="font-bold">Price</span>
                    </div>
                    <div className="flex  text-[15px] items-center">
                      {' '}
                      {/* Aligns second word to the right */}
                      <span className="">{stockData3.price}</span>
                    </div>
                  </div>
                  <div className="text-xl  h-xl mb-4 flex justify-between ">
                    <div className="flex   text-[16px] items-center">
                      {' '}
                      {/* Aligns first word to the left */}
                      <span className="font-bold">Average price</span>
                    </div>
                    <div className="flex text-[15px] items-center">
                      {' '}
                      {/* Aligns second word to the right */}
                      <span className=""></span>
                    </div>
                  </div>
                  <div className="text-xl h-md h-xl mb-4 flex justify-between ">
                    <div className="flex  text-[16px] items-center">
                      {' '}
                      {/* Aligns first word to the left */}
                      <span className="font-bold">% of trading account</span>
                    </div>
                    <div className="flex text-[15px] items-center">
                      {' '}
                      {/* Aligns second word to the right */}
                      <span className=""></span>
                    </div>
                  </div>
                  <div className="text-xl h-md mb-4 flex justify-between ">
                    <div className="flex text-[15px] items-center">
                      {' '}
                      {/* Aligns first word to the left */}
                      <span className="font-bold">Today's return</span>
                    </div>
                    <div className="flex  text-[16px] text-[15px] items-center">
                      {' '}
                      {/* Aligns second word to the right */}
                      <span className=""></span>
                    </div>
                  </div>
                  <div className="text-xl  h-xl mb-4 flex justify-between ">
                    <div className="flex text-[16px] items-center">
                      {' '}
                      {/* Aligns first word to the left */}
                      <span className="font-bold ">Total Return</span>
                    </div>
                    <div className="flex  text-[15px] items-center">
                      {' '}
                      {/* Aligns second word to the right */}
                      <span className="">$0</span>
                    </div>
                  </div>
                </div>
              </PlanCard>
              <PlanCard
                title={
                  <input
                    type="text"
                    value={inputValue4}
                    onChange={handleInputChange4}
                    className="px-1 py-1 border rounded-md border-gray-300 bg-transparent"
                    placeholder="Enter stock ticker"
                  />
                }
                status={
                  stockData3.status === 'red' ? (
                    <div
                      style={{
                        backgroundColor: 'red',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%'
                      }}
                    ></div>
                  ) : stockData3.status === 'green' ? (
                    <div
                      style={{
                        backgroundColor: 'green',
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%'
                      }}
                    ></div>
                  ) : stockData3.status === 'yellow' ? (
                    <div
                      style={{
                        backgroundColor: 'yellow',
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%'
                      }}
                    ></div>
                  ) : null
                }
                footer={
                  <div className="flex items-start justify-between  text-black flex-col sm:flex-row sm:items-center">
                    <button
                      onClick={() => setTicker4(inputValue4)}
                      className="group rounded-full px-4 py-1 text-[13px]  font-semibold transition-all flex items-center justify-center bg-white text-white hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] no-underline flex gap-x-2  active:scale-95 scale-100 duration-75"
                    >
                      <p className="text-black"></p>ADD
                    </button>
                  </div>
                }
              >
                <div className="w-[400px]">
                  <div className="text-xl mt-6 h-xl mb-4 flex justify-between ">
                    <div className="flex text-[16px] items-center">
                      {' '}
                      {/* Aligns first word to the left */}
                      <span className="font-bold">Price</span>
                    </div>
                    <div className="flex  text-[15px] items-center">
                      {' '}
                      {/* Aligns second word to the right */}
                      <span className="">{stockData4.price}</span>
                    </div>
                  </div>
                  <div className="text-xl  h-xl mb-4 flex justify-between ">
                    <div className="flex   text-[16px] items-center">
                      {' '}
                      {/* Aligns first word to the left */}
                      <span className="font-bold">Average price</span>
                    </div>
                    <div className="flex text-[15px] items-center">
                      {' '}
                      {/* Aligns second word to the right */}
                      <span className=""></span>
                    </div>
                  </div>
                  <div className="text-xl h-md h-xl mb-4 flex justify-between ">
                    <div className="flex  text-[16px] items-center">
                      {' '}
                      {/* Aligns first word to the left */}
                      <span className="font-bold">% of trading account</span>
                    </div>
                    <div className="flex text-[15px] items-center">
                      {' '}
                      {/* Aligns second word to the right */}
                      <span className=""></span>
                    </div>
                  </div>
                  <div className="text-xl h-md mb-4 flex justify-between ">
                    <div className="flex text-[15px] items-center">
                      {' '}
                      {/* Aligns first word to the left */}
                      <span className="font-bold">Today's return</span>
                    </div>
                    <div className="flex  text-[16px] text-[15px] items-center">
                      {' '}
                      {/* Aligns second word to the right */}
                      <span className=""></span>
                    </div>
                  </div>
                  <div className="text-xl  h-xl mb-4 flex justify-between ">
                    <div className="flex text-[16px] items-center">
                      {' '}
                      {/* Aligns first word to the left */}
                      <span className="font-bold ">Total Return</span>
                    </div>
                    <div className="flex  text-[15px] items-center">
                      {' '}
                      {/* Aligns second word to the right */}
                      <span className="">$0</span>
                    </div>
                  </div>
                </div>
              </PlanCard>
            </div>
          </div>
          <div className="border border-zinc-700	w-full p rounded-md m-auto my-8">
            {
              news1?.length != 0 && <>hello</>
              /* news1?.map((item: any, index: any) => (
                <div className="" key={index}>
                  <p className="pb-2">{item.title}</p>
                  <p className="pb-2">{item.url}</p>
                </div>
              ))*/
            }
          </div>
        </div>
      </div>
    </section>
  );
};

export default Card;
