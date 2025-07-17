export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import Groups from './components/Groups';
import { verifyUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'CodeMaze | Admin Groups',
  description: 'Manage Groups in Admin Side.',
};


export default async function ProfilePage() {
  await verifyUser("admin");
  return <Groups />
}
