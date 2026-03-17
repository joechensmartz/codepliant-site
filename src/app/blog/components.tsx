export function CodeBlock({
  filename,
  children,
}: {
  filename?: string;
  children: string;
}) {
  return (
    <div className="rounded-xl overflow-hidden my-6">
      {filename && (
        <div className="bg-code-bg px-4 py-2 text-code-fg text-xs font-mono opacity-70 border-b border-border-subtle">
          {filename}
        </div>
      )}
      <pre className="bg-code-bg text-code-fg px-4 py-4 overflow-x-auto text-sm leading-relaxed" role="region" aria-label={filename ? `Code: ${filename}` : "Code example"} tabIndex={0}>
        <code>{children}</code>
      </pre>
    </div>
  );
}
