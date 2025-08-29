export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8 bg-gradient-to-b from-blue-50 to-white">
      <main className="max-w-xl flex flex-col gap-8 items-center text-center">
        <h1 className="font-geist-sans text-3xl sm:text-4xl font-extrabold">
          MockMate
        </h1>
        <h2 className="text-lg text-gray-500 mb-3">
          Practice your interviews for free — timed, recorded, private.
        </h2>
        <a
          href="/signup"
          className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
        >
          Get Started
        </a>
        <ol className="font-mono list-inside list-decimal text-sm/6 text-left mt-6">
          <li>Sign in (email or GitHub; no passwords!)</li>
          <li>Pick a question, set your timer, and get started</li>
          <li>Record and review your answer, track your progress</li>
        </ol>
      </main>
    </div>
  );
}
