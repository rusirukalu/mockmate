"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="w-full flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm fixed top-0 left-0 z-30">
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="font-bold text-lg text-blue-700 tracking-wide hover:opacity-80 transition"
        >
          MockMate
        </Link>
        <Link
          href="/practice"
          className="text-gray-700 hover:text-blue-700 font-medium transition"
        >
          Practice
        </Link>
        <Link
          href="/dashboard"
          className="text-gray-700 hover:text-blue-700 font-medium transition"
        >
          Dashboard
        </Link>
      </div>

      <div>
        {status === "authenticated" ? (
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-gray-600">
              {session.user?.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="py-1 px-4 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
            >
              Sign out
            </button>
          </div>
        ) : (
          <Link
            href="/signup"
            className="py-1 px-4 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}
