import { Suspense } from "react";
import VerifyLogin from "./components/Content";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyLogin />
    </Suspense>
  );
}
