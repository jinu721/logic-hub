export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import MarketManagement from './components/Market';

export const metadata: Metadata = {
  title: 'LogicHub | Admin Market',
  description: 'Mange Market in Admin Side',
};

export default async function MarketPage() {
  return <MarketManagement />
}
