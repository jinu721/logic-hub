export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import MarketManagement from './components/Market';
import { verifyUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'CodeMaze | Admin Market',
  description: 'Mange Market in Admin Side',
};

export default async function MarketPage() {
    await verifyUser("admin");
  return <MarketManagement />
}
