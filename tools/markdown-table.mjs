export function parseMarkdownTableRow(line) {
  const source = String(line).trim();
  if (!source.startsWith('|') || !source.endsWith('|')) {
    throw new Error('Markdown table row must start and end with |');
  }

  const cells = [];
  let cell = '';
  for (let index = 1; index < source.length - 1; index += 1) {
    const character = source[index];
    if (character === '\\') {
      const next = source[index + 1];
      if (index + 1 < source.length - 1 && (next === '|' || next === '\\')) {
        cell += next;
        index += 1;
      } else {
        cell += character;
      }
    } else if (character === '|') {
      cells.push(cell.trim());
      cell = '';
    } else {
      cell += character;
    }
  }
  cells.push(cell.trim());
  return cells;
}

export function escapeMarkdownTableCell(value) {
  return String(value)
    .replaceAll('\\', '\\\\')
    .replaceAll('|', '\\|')
    .replaceAll('\n', ' ');
}
