"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");

  if (status === "loading") return <span>Loading...</span>;

  if (session?.user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
        <h1 className="text-2xl font-bold">Welcome, {session.user.email}</h1>
        <Button onClick={() => signOut()} variant="outline">
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8 bg-gradient-to-b from-green-50 to-white">
      <main className="max-w-md w-full flex flex-col gap-6 items-center text-center">
        <h1 className="text-3xl font-extrabold">Sign up / Sign in</h1>
        <p className="text-gray-600">Choose a method to continue</p>

        {/* Email signup */}
        <div className="w-full flex flex-col gap-3 items-center">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded px-3 py-2 w-64"
          />
          <Button
            onClick={() =>
              signIn("email", { email, callbackUrl: "/dashboard" })
            }
            variant="default"
            className="w-64"
          >
            Sign in with Email
          </Button>
        </div>

        <div className="w-full flex flex-col gap-3 items-center">
          <Button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            variant="secondary"
            className="w-64"
          >
            Sign in with GitHub
          </Button>
        </div>
      </main>
    </div>
  );
}
