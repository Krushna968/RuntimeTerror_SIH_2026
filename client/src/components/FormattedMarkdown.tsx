import React from 'react';

interface FormattedMarkdownProps {
  content: string;
  className?: string;
  strongClassName?: string;
  bulletClassName?: string;
}

export const FormattedMarkdown: React.FC<FormattedMarkdownProps> = ({
  content,
  className = "text-zinc-800",
  strongClassName = "font-bold text-zinc-900",
  bulletClassName = "text-blue-600"
}) => {
  if (!content) return null;

  // Helper to parse inline markdown (bold, italic, inline code)
  const renderInline = (text: string): React.ReactNode[] => {
    // Matches **bold**, __bold__, `code`, *italic*, _italic_
    const regex = /(\*\*[^*]+?\*\*|__[^_]+?__|`[^`]+?`|\*[^*]+?\*|_[^_]+?_)/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (!part) return null;

      // Bold: **text** or __text__
      if ((part.startsWith('**') && part.endsWith('**') && part.length >= 4) ||
          (part.startsWith('__') && part.endsWith('__') && part.length >= 4)) {
        return (
          <strong key={index} className={strongClassName}>
            {part.slice(2, -2)}
          </strong>
        );
      }

      // Inline code: `code`
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        return (
          <code key={index} className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[11px] font-mono text-blue-600 border border-zinc-200/60">
            {part.slice(1, -1)}
          </code>
        );
      }

      // Italic: *text* or _text_
      if ((part.startsWith('*') && part.endsWith('*') && part.length >= 2) ||
          (part.startsWith('_') && part.endsWith('_') && part.length >= 2)) {
        return (
          <em key={index} className="italic text-zinc-700">
            {part.slice(1, -1)}
          </em>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  const lines = content.split('\n');

  return (
    <div className={`space-y-1.5 ${className}`}>
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIdx} className="h-1.5" />;
        }

        // Headers: ###, ##, #
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={lineIdx} className="text-sm font-bold text-zinc-900 mt-2 mb-0.5">
              {renderInline(trimmed.slice(4))}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={lineIdx} className="text-base font-bold text-zinc-900 mt-2.5 mb-1">
              {renderInline(trimmed.slice(3))}
            </h3>
          );
        }
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={lineIdx} className="text-lg font-black text-zinc-900 mt-3 mb-1">
              {renderInline(trimmed.slice(2))}
            </h2>
          );
        }

        // Bullet point lines: •, -, *, +
        const isBullet = /^[•\-\*\+]\s+/.test(trimmed) || trimmed.startsWith('•');
        if (isBullet) {
          const bulletContent = trimmed.replace(/^[•\-\*\+]\s*/, '');
          return (
            <div key={lineIdx} className="flex items-start space-x-2 pl-1 py-0.5">
              <span className={`${bulletClassName} font-bold select-none text-xs mt-0.5 shrink-0`}>•</span>
              <div className="flex-1 leading-relaxed">
                {renderInline(bulletContent)}
              </div>
            </div>
          );
        }

        // Numbered list item: 1. 2. etc.
        const numberMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numberMatch) {
          return (
            <div key={lineIdx} className="flex items-start space-x-2 pl-1 py-0.5">
              <span className="font-bold text-blue-600 text-xs select-none min-w-[1.2rem] mt-0.5 shrink-0">
                {numberMatch[1]}.
              </span>
              <div className="flex-1 leading-relaxed">
                {renderInline(numberMatch[2])}
              </div>
            </div>
          );
        }

        // Blockquote
        if (trimmed.startsWith('> ')) {
          return (
            <div key={lineIdx} className="border-l-2 border-blue-500 pl-3 py-1 my-1 italic text-zinc-600 bg-blue-50/40 rounded-r text-xs">
              {renderInline(trimmed.slice(2))}
            </div>
          );
        }

        // Regular paragraph
        return (
          <p key={lineIdx} className="leading-relaxed">
            {renderInline(line)}
          </p>
        );
      })}
    </div>
  );
};
