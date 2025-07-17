export const dynamic = 'force-dynamic';

import Users from './components/Users';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CodeMaze | Admin Users',
  description: 'Manage users in Admin Side',
};



export default async function UsersPage() {
  return <Users />;
}
