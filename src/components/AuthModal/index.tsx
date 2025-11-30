// components/auth-modal.tsx
"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/Login";
import RegisterForm from "@/components/Register";

import { useStore } from "@/Context/storeContext";
type AuthModalProps = {
  from?: string;
};

export function AuthModal({ from }: AuthModalProps) {
  const { isAuthModalOpen, setIsAuthModalOpen, activeTab, setActiveTab } =
    useStore();

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mt-4"
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
