import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-[70vh] items-center justify-center gap-6 text-center p-8">
      <h1 className="text-4xl font-bold text-blue-700">404 — Page Not Found</h1>
      <p className="text-gray-700 max-w-md">
        Oops! That page can&apos;t be found.
        <br />
        You can return{" "}
        <Link className="text-blue-600 underline" href="/">
          home
        </Link>
        , or visit{" "}
        <Link className="text-blue-600 underline" href="/dashboard">
          your dashboard
        </Link>{" "}
        or{" "}
        <Link className="text-blue-600 underline" href="/practice">
          practice
        </Link>{" "}
        instead.
      </p>
      <Image
        src="/404.svg"
        alt="404 not found illustration"
        width={300}
        height={300}
        className="max-w-xs"
      />
    </div>
  );
}
