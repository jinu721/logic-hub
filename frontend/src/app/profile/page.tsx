export const dynamic = 'force-dynamic';


import UserProfileView from './components/Profile';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LogicHub | User Profile',
  description: 'View CodeBreakers coding achievements, badges, and domain statistics in The Digital Abyss platform.',
};



export default async function ProfilePage() {
  return <UserProfileView username='me' />;
}
