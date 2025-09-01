export default function PrivacyPolicy() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Privacy &amp; Data Policy</h1>
      <p className="mb-3 text-gray-700">
        <b>Your privacy matters.</b> We never use your answers, feedback, or
        email for advertising or profiling.
        <br />
        All your practice sessions stay private to your browser unless you
        export/share them.
      </p>
      <ul className="mb-5 list-disc pl-6">
        <li>You can delete your practice history at any time.</li>
        <li>
          All video/audio recordings remain on your device, not our servers.
        </li>
        <li>
          Your sign-in is passwordless (email/GitHub); no credentials are
          stored.
        </li>
        <li>
          Want to fully remove your data? Use &quot;Clear History&quot; on the
          dashboard or log out anytime.
        </li>
      </ul>
      <p className="text-gray-500 text-sm">
        For questions or full account deletion, contact us:{" "}
        <b>privacy@mockmate.dev</b>
      </p>
    </div>
  );
}
