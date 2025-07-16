export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import Reports from './components/Reports';
import { verifyUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'CodeMaze | Admin Reports',
  description: 'Mange Reports in Admin Side.',
};
export default async function ReportsPage() {
    await verifyUser("admin");
  return <Reports/>
}
