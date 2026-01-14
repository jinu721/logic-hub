// export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import BlackMarketPage from './components/Market';

export const metadata: Metadata = {
  title: 'Market | LogicHub',
  description: 'Buy Exculsive Items and Upgrade Your Profile.',
};


export default async function MarketPage() {
  return <BlackMarketPage />
}
