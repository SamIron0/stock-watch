import { useState, useEffect, ReactNode } from 'react';

type StockData = {
  name: string,
  price: number
};

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

function PlanCard({ title, description, footer, children }: Props) {
  return (
    <div className="border border-zinc-700	max-w-3xl w-full p rounded-md m-auto my-8">
      <div className="px-5 py-4">
        <h3 className="text-2xl mb-1 font-medium">{title}</h3>
        <p className="text-zinc-300">{description}</p>
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
          <div className="px-5">
            <div className="flex overflow-x-scroll space-x-4">

              <PlanCard
                title="Genie"
                description={
                  ''
                }
                footer={
                  <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
                    P/L: N/A
                  </div>
                }
              >
                <div className="text-xl mt-8 mb-4 font-semibold">
                  <h2>Model: {stockData.name}</h2>
                  <p>Price: {stockData.price}</p>

                </div>
              </PlanCard>
            </div>
          </div>
        </div>
    </section>
  );
};

export default Card;