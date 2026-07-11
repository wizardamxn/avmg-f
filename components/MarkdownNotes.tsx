"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Renders Gemini's markdown study notes in the AVMG neobrutalist voice —
// neon headings, `>` bullet markers, green timestamps, hard-edged blocks.
export default function MarkdownNotes({ markdown }: { markdown: string }) {
  return (
    <div className="flex flex-col gap-4 normal-case tracking-normal">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white drop-shadow-[3px_3px_0_#9333ea] mb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg md:text-xl font-black uppercase tracking-widest text-purple-400 border-l-4 border-purple-500 pl-3 mt-6 mb-1">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-black uppercase tracking-wider text-cyan-400 mt-4 mb-1">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-white/80 font-medium leading-relaxed text-sm md:text-base">
              {children}
            </p>
          ),
          ul: ({ children }) => <ul className="flex flex-col gap-1.5 my-1">{children}</ul>,
          ol: ({ children }) => (
            <ol className="flex flex-col gap-1.5 my-1 list-decimal list-inside marker:text-purple-500 marker:font-black">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-white/80 font-medium text-sm md:text-base flex gap-2">
              <span className="text-purple-500 font-black shrink-0">{">"}</span>
              <span className="flex-1">{children}</span>
            </li>
          ),
          strong: ({ children }) => (
            <strong className="text-green-500 font-black">{children}</strong>
          ),
          em: ({ children }) => <em className="text-cyan-400 not-italic">{children}</em>,
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 underline hover:text-cyan-300"
            >
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="bg-neutral-900 border border-neutral-700 px-1.5 py-0.5 text-pink-400 font-mono text-sm">
              {children}
            </code>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-cyan-400 bg-cyan-400/5 pl-4 py-2 text-white/70 italic">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-t-4 border-neutral-800 my-4" />,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
