"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return <span>Loading...</span>;

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <span>Signed in as {session.user.email}</span>
        <Button onClick={() => signOut()} variant="outline">
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <Button onClick={() => signIn("email")} variant="default">
        Sign in with Email
      </Button>
      <Button onClick={() => signIn("github")} variant="secondary">
        Sign in with GitHub
      </Button>
    </div>
  );
}
