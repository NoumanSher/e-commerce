import Login from "@/components/Login";
import { Suspense } from "react";
export default function LogInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Login />
    </Suspense>
  );
}
