export const dynamic = 'force-dynamic';

import UserProfileView from '../components/Profile';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LogicHub | User Profile',
  description: 'View CodeBreakers coding achievements, badges, and domain statistics in The Digital Abyss platform.',
};

type Props = {
  params: {
    username: string
  }
}

export default async function ProfilePage({ params: { username } }: Props) {
  return <UserProfileView username={username} />;
}
