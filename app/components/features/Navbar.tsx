// app/components/Navbar.tsx
"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import ColorModeSwitcher from "@/app/components/features/ColorModeSwitcher";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav
      className="w-full flex flex-wrap items-center justify-between px-4 py-3 bg-white border-b shadow-sm fixed top-0 left-0 z-30 gap-4"
      aria-label="Main Navigation"
      role="navigation"
    >
      {/* Left side - Logo and Navigation Links */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <Link
          href="/"
          className="font-bold text-lg text-blue-700 tracking-wide focus:outline-blue-500 whitespace-nowrap"
          aria-label="MockMate Home"
        >
          MockMate
        </Link>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <Link
            href="/practice"
            className="text-gray-700 hover:text-blue-700 font-medium transition focus:outline-blue-500 whitespace-nowrap"
            aria-label="Practice"
          >
            Practice
          </Link>
          <Link
            href="/dashboard"
            className="text-gray-700 hover:text-blue-700 font-medium transition focus:outline-blue-500 whitespace-nowrap"
            aria-label="Dashboard"
          >
            Dashboard
          </Link>
          <Link
            href="/privacy"
            className="text-gray-700 hover:text-blue-700 font-medium transition focus:outline-blue-500 whitespace-nowrap"
            aria-label="Privacy Policy"
          >
            Privacy
          </Link>
        </div>
      </div>

      {/* Right side - Auth and Theme Switcher */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Authentication Section */}
        <div className="flex flex-wrap items-center gap-3">
          {status === "authenticated" ? (
            <>
              <span
                className="hidden sm:inline text-sm text-gray-600 whitespace-nowrap"
                aria-label="User email"
              >
                {session.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="py-1 px-4 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm focus-visible:outline-blue-700 whitespace-nowrap transition-colors"
                aria-label="Sign out"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/signup"
              className="py-1 px-4 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm focus-visible:outline-blue-700 whitespace-nowrap transition-colors"
              aria-label="Sign in"
            >
              Sign in
            </Link>
          )}
        </div>

        {/* Theme Switcher - Always on the far right */}
        <div className="flex items-center">
          <ColorModeSwitcher />
        </div>
      </div>
    </nav>
  );
}
