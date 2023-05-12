import { GetStaticPropsResult } from 'next';

import Card from '@/components/Card';
import { getActiveProductsWithPrices } from '@/utils/supabase-client';
import { Bot } from 'types';


export default function PricingPage({  }) {
  return <Card/>;
}

