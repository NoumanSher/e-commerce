import { Suspense } from "react";
import Register from "@/components/Register";
export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Register />
    </Suspense>
  );
}
