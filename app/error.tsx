"use client";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center p-8">
      <h1 className="text-2xl text-red-700 font-bold">
        Oops, something went wrong 😔
      </h1>
      <p className="text-gray-700 max-w-md">
        Sorry, an unexpected error occurred.
        <br />
        <span className="text-sm text-gray-500">{error.message}</span>
      </p>
      <button
        className="btn btn-light border border-blue-600 text-blue-800"
        onClick={() => reset()}
      >
        Try again
      </button>
      <Link href="/" className="text-blue-600 underline">
        Back to home
      </Link>
    </div>
  );
}
