export const dynamic = 'force-dynamic';

import EditProfile from './components/EditProfile';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CodeBreaker Profile - The Digital Abyss',
  description: 'View CodeBreakers coding achievements, badges, and domain statistics in The Digital Abyss platform.',
};

export default async function ProfilePage() {
  return <EditProfile/>;
}
