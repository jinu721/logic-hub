export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import Reports from './components/Reports';

export const metadata: Metadata = {
  title: 'LogicHub | Admin Reports',
  description: 'Mange Reports in Admin Side.',
};
export default async function ReportsPage() {
  return <Reports />
}
