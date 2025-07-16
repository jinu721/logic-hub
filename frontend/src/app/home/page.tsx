// export const dynamic = "force-dynamic";

import { Metadata } from "next";
import Home from "./components/Home";

export const metadata: Metadata = {
  title: "Home | CodeMaze",
  description: "Explore the domains",
};

export default async function CodeDomainsPage() {
  return <Home />;
}
