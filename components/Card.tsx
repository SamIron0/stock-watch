import { useState, useEffect, ReactNode } from 'react';

type StockData = {
  name: string,
  price: number
};

interface Props {
  title: string;
  price?: number;
  footer?: ReactNode;
  children: ReactNode;
}

function PlanCard({ title, price, footer, children }: Props) {
  return (
    <div className="border border-zinc-700	max-w-3xl w-full p rounded-md m-auto my-8">
      <div className="px-5 py-4">
        <div className="flex justify-between">
          <p className="text-left">
            <input
              type="text"
              className="bg-gray-700 rounded-full py-2 px-4 text-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </p>
          <p className="text-right">{price}</p>
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
    <section>



      <div className="sm:flex px-4 sm:flex-col sm:align-center">
        <div className="border border-zinc-700	max-w-3xl w-full p rounded-md m-auto">
          <div className="px-5">
            <h3 className="text-xl my-1 font-medium">Hello Samuel</h3>
          </div>
        </div>
      </div>

      <div className="sm:flex px-4 sm:flex-col sm:align-center">
        <div className="border border-zinc-700	max-w-3xl w-full rounded-md m-auto my-4">
          HOLDINGS
          <div className="px-5">
            <div className="flex overflow-x-scroll space-x-4">

              <PlanCard
                title="BBIG"
                price={
                  stockData.price
                }
                footer={
                  <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
                    P/L: N/A
                  </div>
                }
              >
                <div className="text-xl mt-8 mb-4 font-semibold">
                  <p>Avg price: {stockData.price}</p>

                </div>

              </PlanCard>

              <PlanCard
                title="BBIG"
                price={
                  stockData.price
                }
                footer={
                  <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
                    <button
                      className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#1E2B3A] text-white hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] no-underline flex gap-x-2  active:scale-95 scale-100 duration-75"
                      style={{
                        boxShadow:
                          "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      BUY
                    </button>
                  </div>
                }
              >
                <div className="text-xl mt-8 mb-4 font-semibold">
                  <p>Avg price: {stockData.price}</p>

                </div>

              </PlanCard>
              <PlanCard
                title="BBIG"
                price={
                  stockData.price
                }
                footer={
                  <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
                    P/L: N/A
                  </div>
                }
              >
                <div className="text-xl mt-8 mb-4 font-semibold">
                  <p>Avg price: {stockData.price}</p>

                </div>

              </PlanCard>
              <PlanCard
                title="BBIG"
                price={
                  stockData.price
                }
                footer={
                  <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
                    P/L: N/A
                  </div>
                }
              >
                <div className="text-xl mt-8 mb-4 font-semibold">
                  <p>Avg price: {stockData.price}</p>

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