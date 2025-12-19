export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import DomainView from "../components/DomainView";

export const metadata: Metadata = {
  title: "Domain | LogicHub",
  description: "Explore the domains",
};


export default async function CodeDomainsPage() {
  return <DomainView />;
}
