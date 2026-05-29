import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type LegalMarkdownProps = {
  content: string;
};

export default function LegalMarkdown({ content }: LegalMarkdownProps) {
  const normalizedContent = content
    .split(/\r?\n/)
    .map((line) => {
      const trimmed = line.trim();

      if (trimmed === "Définitions") {
        return "## Définitions";
      }

      const definitionMatch = line.match(/^([A-Za-zÀ-ÿ0-9'’()\-. ]{2,60})\s:\s(.+)$/);
      if (definitionMatch && !trimmed.startsWith("Date ")) {
        const term = definitionMatch[1].trim();
        const definition = definitionMatch[2].trim();
        return `- **${term}** : ${definition}`;
      }

      return line;
    })
    .join("\n");

  return (
    <div className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-white prose-hr:border-white/10">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h2 className="mb-5 mt-2 text-3xl font-black">{children}</h2>,
          h2: ({ children }) => <h3 className="mb-4 mt-8 text-2xl font-bold">{children}</h3>,
          h3: ({ children }) => <h4 className="mb-3 mt-6 text-xl font-semibold">{children}</h4>,
          p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="mb-5 list-disc space-y-2 pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="mb-5 list-decimal space-y-2 pl-5">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
        }}
      >
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
}