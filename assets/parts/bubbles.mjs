// セリフ用の吹き出しSVGフラグメント。日本語テキストは文字数ベースで簡易折返しする。

function wrapText(text, maxChars) {
  const chars = Array.from(text);
  const lines = [];
  let line = "";
  for (const ch of chars) {
    if (ch === "\n" || line.length >= maxChars) {
      lines.push(line);
      line = ch === "\n" ? "" : ch;
    } else {
      line += ch;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

function textBlock(text, cx, cy, maxChars, fontSize, color) {
  const lines = wrapText(text, maxChars);
  const lineHeight = fontSize * 1.3;
  const startY = cy - ((lines.length - 1) * lineHeight) / 2;
  const tspans = lines
    .map(
      (l, i) =>
        `<tspan x="${cx}" y="${(startY + i * lineHeight).toFixed(1)}">${escapeXml(l)}</tspan>`
    )
    .join("");
  return `<text text-anchor="middle" font-size="${fontSize}" font-family="'Hiragino Sans','Yu Gothic',sans-serif" fill="${color}" font-weight="600">${tspans}</text>`;
}

function escapeXml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function bubble({ type = "speech", text, x, y, w = 200, h = 90, tailTo = "bottom" }) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const maxChars = Math.max(4, Math.floor(w / 15));
  const fontSize = 17;

  if (type === "narration") {
    return `
      <g>
        <rect x="${x}" y="${y}" width="${w}" height="${h * 0.6}" fill="#2E2E2E" opacity="0.85"/>
        ${textBlock(text, cx, y + (h * 0.6) / 2, maxChars, 15, "#FFFFFF")}
      </g>`;
  }

  const tailPath =
    tailTo === "bottom-left"
      ? `M ${cx - 30} ${y + h - 4} L ${cx - 46} ${y + h + 28} L ${cx - 4} ${y + h - 4} Z`
      : tailTo === "bottom-right"
      ? `M ${cx + 4} ${y + h - 4} L ${cx + 46} ${y + h + 28} L ${cx + 30} ${y + h - 4} Z`
      : `M ${cx - 14} ${y + h - 4} L ${cx} ${y + h + 26} L ${cx + 14} ${y + h - 4} Z`;

  if (type === "shout") {
    const spikes = 14;
    let pts = "";
    for (let i = 0; i < spikes; i++) {
      const angle = (i / spikes) * Math.PI * 2;
      const rBase = i % 2 === 0 ? 1 : 0.82;
      const rx = (w / 2) * rBase;
      const ry = (h / 2) * rBase;
      pts += `${(cx + Math.cos(angle) * rx).toFixed(1)},${(cy + Math.sin(angle) * ry).toFixed(1)} `;
    }
    return `
      <g>
        <polygon points="${pts.trim()}" fill="#FFFFFF" stroke="#222222" stroke-width="3"/>
        ${textBlock(text, cx, cy, maxChars, fontSize, "#222222")}
      </g>`;
  }

  if (type === "thought") {
    return `
      <g>
        <ellipse cx="${cx}" cy="${cy}" rx="${w / 2}" ry="${h / 2}" fill="#FFFFFF" stroke="#888888" stroke-width="2.5"/>
        <circle cx="${cx - w / 6}" cy="${y + h + 14}" r="9" fill="#FFFFFF" stroke="#888888" stroke-width="2"/>
        <circle cx="${cx - w / 3}" cy="${y + h + 30}" r="5" fill="#FFFFFF" stroke="#888888" stroke-width="2"/>
        ${textBlock(text, cx, cy, maxChars, fontSize, "#444444")}
      </g>`;
  }

  return `
    <g>
      <path d="${tailPath}" fill="#FFFFFF" stroke="#222222" stroke-width="3"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2.6}" fill="#FFFFFF" stroke="#222222" stroke-width="3"/>
      ${textBlock(text, cx, cy, maxChars, fontSize, "#222222")}
    </g>`;
}
