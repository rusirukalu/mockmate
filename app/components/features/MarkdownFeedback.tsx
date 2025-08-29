"use client";
import ReactMarkdown from "react-markdown";

export default function MarkdownFeedback({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown
      components={{
        div: ({ node, ...props }) => (
          <div className="prose prose-sm" {...props} />
        ),
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}
