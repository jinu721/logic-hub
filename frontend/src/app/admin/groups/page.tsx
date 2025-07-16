export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import Groups from './components/Groups';

export const metadata: Metadata = {
  title: 'CodeMaze | Admin Groups',
  description: 'Manage Groups in Admin Side.',
};


export default async function ProfilePage() {
  return <Groups />
}
