import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const markdownComponents = {
  h1: ({ children }) => <h2 className="text-sm font-semibold">{children}</h2>,
  h2: ({ children }) => <h3 className="text-sm font-semibold">{children}</h3>,
  h3: ({ children }) => <h4 className="text-sm font-semibold">{children}</h4>,
  p: ({ children }) => <p className="text-xs leading-relaxed">{children}</p>,
  ul: ({ children }) => (
    <ul className="list-disc space-y-1 pl-5 text-xs">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal space-y-1 pl-5 text-xs">{children}</ol>
  ),
  li: ({ children }) => <li className="text-xs">{children}</li>,
  code: ({ inline, children }) =>
    inline ? (
      <code className="rounded bg-base-300 px-1 font-mono text-[11px]">
        {children}
      </code>
    ) : (
      <code className="font-mono text-[11px]">{children}</code>
    ),
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-lg bg-base-300 p-3">{children}</pre>
  ),
  hr: () => <hr className="border-base-300" />,
};

function AiMarkdown({ text }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={markdownComponents}
    >
      {text}
    </ReactMarkdown>
  );
}

export default AiMarkdown;
