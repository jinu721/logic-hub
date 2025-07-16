export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import DomainView from "../components/DomainView";

export const metadata: Metadata = {
  title: "Home | CodeMaze",
  description: "Explore the domains",
};

type Props = {
  params: {
    id: string;
  };
};

export default async function CodeDomainsPage({ params: { id } }: Props) {
  return <DomainView challengeId={id}  />;
}
