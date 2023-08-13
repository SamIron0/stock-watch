import protobuf from 'protobufjs';
import React, { useMemo, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

type StockData = {
  name: string,
  price: string
};

interface Props {
  title: ReactNode;
  price?: number;
  footer?: ReactNode;
  children: ReactNode;
}

function PlanCard({ title, price, footer, children }: Props) {
  return (
    <div className="border border-zinc-700	max-w-[500px] p rounded-md m-auto my-8">
      <div className="px-5 py-4">
        <div className="flex justify-between">
          <p className="text-left">{title}</p>
          <p className="text-right">$50</p>
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
  const [ticker, setTicker] = useState<string>("");  const [stockData, setStockData] = useState<StockData>({ name: '', price: '' });
  const [inputValue, setInputValue] = useState("")
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  }

  useEffect(() => {
    const eventSource = new EventSource(`/api/bot/?stock=${ticker}`)
    eventSource.onopen = (event) => console.log('connection opened', event);
    eventSource.onerror = (event) => console.log('connection errored', event);

    eventSource.onmessage = (event) => {
      console.log('incoming message');

      const data = JSON.parse(event.data);
      console.log(data);
      setStockData(data);
    }
    return () => eventSource.close();
  }, [ticker]);

  return (
    <section>


      <div className="sm:flex px-4  sm:flex-col h-screen sm:align-center">
        <div className="border border-zinc-700 w-full h-full rounded-md m-auto my-4">
          <div className="px-2">
            <div className="flex overflow-x-scroll space-x-4">
              <PlanCard
                title={<input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  className="px-1 py-1 border rounded-md border-gray-300 bg-transparent"
                  placeholder="Enter text"
                />
                }

                footer={
                  <div className="flex items-start justify-between  text-black flex-col sm:flex-row sm:items-center">
                    <button
                      onClick={() => setTicker(inputValue)}
                      className="group rounded-full px-4 py-1 text-[13px]  font-semibold transition-all flex items-center justify-center bg-white text-white hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] no-underline flex gap-x-2  active:scale-95 scale-100 duration-75"

                    >
                      <p className="text-black"></p>ADD
                    </button>
                  </div>
                }
              >
                <div className='w-[400px]'>

                  <div className="text-xl mt-8 h-xl mb-4 flex justify-between ">
                    <div className="flex text-[16px] items-center"> {/* Aligns first word to the left */}
                      <span className="font-bold">Price</span>
                    </div>
                    <div className="flex  text-[15px] items-center"> {/* Aligns second word to the right */}
                      <span className="">{stockData.price}</span>
                    </div>
                  </div>
                  <div className="text-xl mt-8 h-xl mb-4 flex justify-between ">
                    <div className="flex   text-[16px] items-center"> {/* Aligns first word to the left */}
                      <span className="font-bold">Average price</span>
                    </div>
                    <div className="flex text-[15px] items-center"> {/* Aligns second word to the right */}
                      <span className="">{stockData.price}</span>
                    </div>
                  </div>
                  <div className="text-xl mt-8 h-xl mb-4 flex justify-between ">
                    <div className="flex  text-[16px] items-center"> {/* Aligns first word to the left */}
                      <span className="font-bold">% of trading account</span>
                    </div>
                    <div className="flex text-[15px] items-center"> {/* Aligns second word to the right */}
                      <span className="">{stockData.price}</span>
                    </div>
                  </div>
                  <div className="text-xl mt-8 h-xl mb-4 flex justify-between ">
                    <div className="flex text-[16px] items-center"> {/* Aligns first word to the left */}
                      <span className="font-bold">Today's return</span>
                    </div>
                    <div className="flex  text-[16px] text-[15px] items-center"> {/* Aligns second word to the right */}
                      <span className="">{stockData.price}</span>
                    </div>
                  </div>
                  <div className="text-xl mt-8 h-xl mb-4 flex justify-between ">
                    <div className="flex text-[16px] items-center"> {/* Aligns first word to the left */}
                      <span className="font-bold ">Total Return</span>
                    </div>
                    <div className="flex  text-[15px] items-center"> {/* Aligns second word to the right */}
                      <span className="">{stockData.price}</span>
                    </div>
                  </div>
                </div>
              </PlanCard>
              <PlanCard
                title={<input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  className="px-1 py-1 border rounded-md border-gray-300 bg-transparent"
                  placeholder="Enter text"
                />
                }

                footer={
                  <div className="flex items-start justify-between  text-black flex-col sm:flex-row sm:items-center">
                    <button
                      onClick={() => setTicker(inputValue)}
                      className="group rounded-full px-4 py-1 text-[13px]  font-semibold transition-all flex items-center justify-center bg-white text-white hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] no-underline flex gap-x-2  active:scale-95 scale-100 duration-75"

                    >
                      <p className="text-black"></p>ADD
                    </button>
                  </div>
                }
              >
                <div className='w-[400px]'>

                  <div className="text-xl mt-8 h-xl mb-4 flex justify-between text-[12px]">
                    <div className="flex  items-center"> {/* Aligns first word to the left */}
                      <span className="font-bold">Price</span>
                    </div>
                    <div className="flex  text-[15px] items-center"> {/* Aligns second word to the right */}
                      <span className="">{stockData.price}</span>
                    </div>
                  </div>
                  <div className="text-xl mt-8 h-xl mb-4 flex justify-between ">
                    <div className="flex  items-center"> {/* Aligns first word to the left */}
                      <span className="font-bold">Average price</span>
                    </div>
                    <div className="flex text-[15px] items-center"> {/* Aligns second word to the right */}
                      <span className="">{stockData.price}</span>
                    </div>
                  </div>
                  <div className="text-xl mt-8 h-xl mb-4 flex justify-between ">
                    <div className="flex items-center"> {/* Aligns first word to the left */}
                      <span className="font-bold">% of Non-registered account</span>
                    </div>
                    <div className="flex text-[15px] items-center"> {/* Aligns second word to the right */}
                      <span className="">{stockData.price}</span>
                    </div>
                  </div>
                  <div className="text-xl mt-8 h-xl mb-4 flex justify-between ">
                    <div className="flex items-center"> {/* Aligns first word to the left */}
                      <span className="font-bold">Today's return</span>
                    </div>
                    <div className="flex text-[15px] items-center"> {/* Aligns second word to the right */}
                      <span className="">{stockData.price}</span>
                    </div>
                  </div>
                  <div className="text-xl mt-8 h-xl mb-4 flex justify-between ">
                    <div className="flex items-center"> {/* Aligns first word to the left */}
                      <span className="font-bold">Total Return</span>
                    </div>
                    <div className="flex text-[15px] items-center"> {/* Aligns second word to the right */}
                      <span className="">{stockData.price}</span>
                    </div>
                  </div>
                </div>
              </PlanCard>
              <PlanCard
                title={<input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  className="px-1 py-1 border rounded-md border-gray-300 bg-transparent"
                  placeholder="Enter text"
                />
                }

                footer={
                  <div className="flex items-start justify-between  text-black flex-col sm:flex-row sm:items-center">
                    <button
                      onClick={() => setTicker(inputValue)}
                      className="group rounded-full px-4 py-1 text-[13px]  font-semibold transition-all flex items-center justify-center bg-white text-white hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] no-underline flex gap-x-2  active:scale-95 scale-100 duration-75"

                    >
                      <p className="text-black"></p>ADD
                    </button>
                  </div>
                }
              >
                <div className='w-[400px]'>

                  <div className="text-xl mt-8 h-xl mb-4 flex justify-between text-[12px]">
                    <div className="flex  items-center"> {/* Aligns first word to the left */}
                      <span className="font-bold">Price</span>
                    </div>
                    <div className="flex  text-[15px] items-center"> {/* Aligns second word to the right */}
                      <span className="">{stockData.price}</span>
                    </div>
                  </div>
                  <div className="text-xl mt-8 h-xl mb-4 flex justify-between ">
                    <div className="flex  items-center"> {/* Aligns first word to the left */}
                      <span className="font-bold">Average price</span>
                    </div>
                    <div className="flex text-[15px] items-center"> {/* Aligns second word to the right */}
                      <span className="">{stockData.price}</span>
                    </div>
                  </div>
                  <div className="text-xl mt-8 h-xl mb-4 flex justify-between ">
                    <div className="flex items-center"> {/* Aligns first word to the left */}
                      <span className="font-bold">% of Non-registered account</span>
                    </div>
                    <div className="flex text-[15px] items-center"> {/* Aligns second word to the right */}
                      <span className="">{stockData.price}</span>
                    </div>
                  </div>
                  <div className="text-xl mt-8 h-xl mb-4 flex justify-between ">
                    <div className="flex items-center"> {/* Aligns first word to the left */}
                      <span className="font-bold">Today's return</span>
                    </div>
                    <div className="flex text-[15px] items-center"> {/* Aligns second word to the right */}
                      <span className="">{stockData.price}</span>
                    </div>
                  </div>
                  <div className="text-xl mt-8 h-xl mb-4 flex justify-between ">
                    <div className="flex items-center"> {/* Aligns first word to the left */}
                      <span className="font-bold">Total Return</span>
                    </div>
                    <div className="flex text-[15px] items-center"> {/* Aligns second word to the right */}
                      <span className="">{stockData.price}</span>
                    </div>
                  </div>
                </div>
              </PlanCard>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Card;