export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import ChallengeManagement from './components/Domain';
import { verifyUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'CodeMaze | Admin Domains',
  description: 'Mange Challenges in Admin Side',
};



export default async function DomainPage() {
  await verifyUser("admin");
  return <ChallengeManagement />
}
