// components/auth-modal.tsx
"use client";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import dynamic from "next/dynamic";
const LoginForm = dynamic(() => import("@/components/Login"), { ssr: false });
const RegisterForm = dynamic(() => import("@/components/Register"), { ssr: false });

import { useAppUIContext } from "@/context/AppUIContext";
type AuthModalProps = {
  from?: string;
};

export function AuthModal({ from }: AuthModalProps) {
  const { isAuthModalOpen, setIsAuthModalOpen, activeTab, setActiveTab } =
    useAppUIContext();

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle className="text-center hidden">welcome to pakshipper store</DialogTitle>
        <DialogDescription className="text-lg font-semibold">
          Login or register to continue.
        </DialogDescription>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <LoginForm from={from} />
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <RegisterForm from={from} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
