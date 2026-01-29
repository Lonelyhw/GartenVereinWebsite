function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderInline(input: string): string {
  let text = escapeHtml(input);

  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, url) => {
    const safeUrl = String(url).trim();
    if (!safeUrl.startsWith('http://') && !safeUrl.startsWith('https://')) {
      return label;
    }
    return `<a href="${safeUrl}" target="_blank" rel="noopener">${label}</a>`;
  });

  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  return text;
}

export function renderMarkdown(input: string | null | undefined): string {
  const text = (input ?? '').replace(/\r\n/g, '\n');
  const lines = text.split('\n');
  let html = '';
  let inList = false;

  const closeList = (): void => {
    if (inList) {
      html += '</ul>';
      inList = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      closeList();
      continue;
    }

    if (line.startsWith('### ')) {
      closeList();
      html += `<h3 class="text-lg font-semibold text-slate-900">${renderInline(line.slice(4))}</h3>`;
      continue;
    }
    if (line.startsWith('## ')) {
      closeList();
      html += `<h2 class="text-xl font-semibold text-slate-900">${renderInline(line.slice(3))}</h2>`;
      continue;
    }
    if (line.startsWith('# ')) {
      closeList();
      html += `<h1 class="text-2xl font-semibold text-slate-900">${renderInline(line.slice(2))}</h1>`;
      continue;
    }

    if (line.startsWith('- ')) {
      if (!inList) {
        html += '<ul class="list-disc pl-5 space-y-1">';
        inList = true;
      }
      html += `<li>${renderInline(line.slice(2))}</li>`;
      continue;
    }

    closeList();
    html += `<p>${renderInline(line)}</p>`;
  }

  closeList();
  return html;
}
