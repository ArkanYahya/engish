// Grammar content mixes short English terms into Arabic sentences — e.g. "my وyour وhis
// وher وits وour وtheir توضح ملكية الشيء." Rendered as plain text inside dir="rtl", the
// browser's bidi algorithm can reorder those adjacent Latin runs relative to each other
// (the classic "mixed English word list inside Arabic" bug). Wrapping each Latin run in
// its own <bdi> (bidirectional isolate) keeps it internally LTR without letting it affect,
// or be affected by, the surrounding RTL text's ordering — the standards-correct fix,
// rather than hand-editing every content string.
const LATIN_RUN = /[A-Za-z0-9][A-Za-z0-9'".,%/-]*(?:\s[A-Za-z0-9][A-Za-z0-9'".,%/-]*)*/g;

export function bidiSafe(text) {
  if (!text) return text;
  LATIN_RUN.lastIndex = 0;
  if (!LATIN_RUN.test(text)) return text;
  LATIN_RUN.lastIndex = 0;

  const parts = [];
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = LATIN_RUN.exec(text))) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(
      <bdi key={key++} dir="ltr">
        {match[0]}
      </bdi>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}
