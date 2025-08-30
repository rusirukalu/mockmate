export default function NotFound() {
  return (
    <div className="flex flex-col min-h-[70vh] items-center justify-center gap-6 text-center p-8">
      <h1 className="text-4xl font-bold text-blue-700">404 — Page Not Found</h1>
      <p className="text-gray-700 max-w-md">
        Oops! That page doesn't exist.
        <br />
        You can return{" "}
        <a className="text-blue-600 underline" href="/">
          home
        </a>
        , or visit{" "}
        <a className="text-blue-600 underline" href="/dashboard">
          your dashboard
        </a>{" "}
        or{" "}
        <a className="text-blue-600 underline" href="/practice">
          practice
        </a>{" "}
        instead.
      </p>
      <img
        src="/public/404.svg"
        alt="404 not found illustration"
        className="max-w-xs"
      />
    </div>
  );
}
