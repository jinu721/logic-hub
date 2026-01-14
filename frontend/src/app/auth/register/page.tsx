
import { Metadata } from "next";

import Register from "./components/Register";

export const metadata: Metadata = {
  title: "Register | LogicHub",
  description: "Create an account and start your journey",
};

export default function RegisterPage() {
  return (
    <Register />
  );
}
