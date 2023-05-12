import { ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
import Button from '@/components/ui/Button';
import { useUser } from '@/utils/useUser';

import { Bot } from 'types';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { postData } from '@/utils/helpers';
import LoadingDots from './ui/LoadingDots';

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}





function BotCard({ title, description, footer, children }: Props) {
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

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: '/signin',
        permanent: false
      }
    };

  return {
    props: {
      initialSession: session,
      user: session.user
    }
  };
};

export default function Card() {
  const router = useRouter();
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const { user, isLoading, userDetails } = useUser();

  const [loading, setLoading] = useState(false);

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    try {
      const { url, error } = await postData({
        url: '/api/create-portal-link'
      });
      window.location.assign(url);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
    setLoading(false);
  };

  return (
    <section className="bg-black mb-32">
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

              <BotCard
                title="Bot1"
                description={
                  ""
                }
                footer={
                  <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
                    P/L:
                  </div>
                }
              >
                <div className="text-xl mt-8 mb-4 font-semibold">

                </div>
              </BotCard>


              <BotCard
                title="Bot1"
                description={
                  ""
                }
                footer={
                  <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
                    P/L:
                  </div>
                }
              >
                <div className="text-xl mt-8 mb-4 font-semibold">

                </div>
              </BotCard>


              <BotCard
                title="Bot1"
                description={
                  ""
                }

                footer={
                  <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
                    P/L:
                  </div>
                }
              >
                <div className="text-xl mt-8 mb-4 font-semibold">

                </div>
              </BotCard>


              <BotCard
                title="Bot1"
                description={
                  ""
                }
                footer={
                  <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
                    P/L:
                  </div>
                }
              >
                <div className="text-xl mt-8 mb-4 font-semibold">

                </div>
              </BotCard>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}