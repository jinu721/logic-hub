export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import ChallengeManagement from './components/Domain';

export const metadata: Metadata = {
  title: 'LogicHub | Admin Domains',
  description: 'Mange Challenges in Admin Side',
};



export default async function DomainPage() {
  return <ChallengeManagement />
}
