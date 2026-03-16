/**
 * Section-level customization for generated compliance documents.
 *
 * Users can override any generated section by specifying the heading text
 * and the replacement body in their config's `sectionOverrides` map.
 */

/**
 * Apply section overrides to a markdown document.
 *
 * For each key in `overrides`, finds a matching `## <key>` heading in the
 * content and replaces everything between that heading and the next `##`
 * heading (or end of document) with the override text. The heading line
 * itself is preserved; only the body is replaced.
 *
 * Matching is case-insensitive.
 */
export function applyOverrides(
  content: string,
  overrides: Record<string, string>
): string {
  let result = content;

  for (const [heading, body] of Object.entries(overrides)) {
    result = replaceSection(result, heading, body);
  }

  return result;
}

function replaceSection(
  content: string,
  heading: string,
  newBody: string
): string {
  // Match ## heading (case-insensitive), capture everything until the next
  // ## heading or end of string.
  const escapedHeading = escapeRegExp(heading);
  const pattern = new RegExp(
    `(^## ${escapedHeading}[ \\t]*\\n)([\\s\\S]*?)(?=^## |\\z)`,
    "im"
  );

  // The \z anchor isn't universally supported in JS — use a two-pass approach:
  // first try to match with a lookahead for the next heading, then handle the
  // case where the section runs to the end of the document.
  const withNextHeading = new RegExp(
    `(^## ${escapedHeading}[ \\t]*\\n)([\\s\\S]*?)(?=^## )`,
    "im"
  );

  if (withNextHeading.test(content)) {
    return content.replace(withNextHeading, `$1\n${newBody}\n\n`);
  }

  // Section is at the end of the document
  const atEnd = new RegExp(
    `(^## ${escapedHeading}[ \\t]*\\n)([\\s\\S]*)$`,
    "im"
  );

  if (atEnd.test(content)) {
    return content.replace(atEnd, `$1\n${newBody}\n`);
  }

  // No matching section found — return content unchanged
  return content;
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
