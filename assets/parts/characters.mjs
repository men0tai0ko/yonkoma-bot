// キャラクター(ロボ子・にゃん太)のSVGフラグメントを組み立てるユーティリティ。
// panel-local座標系(0..380程度)を前提に、足元アンカー(x,y)を基準に描画する。

function eyesMouth_robo(expression) {
  switch (expression) {
    case "happy":
      return `
        <path d="M -18 -6 Q -12 -14 -6 -6" stroke="#1B4F72" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M 6 -6 Q 12 -14 18 -6" stroke="#1B4F72" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M -14 10 Q 0 22 14 10" stroke="#1B4F72" stroke-width="4" fill="none" stroke-linecap="round"/>
      `;
    case "surprised":
      return `
        <circle cx="-12" cy="-4" r="7" fill="#1B4F72"/>
        <circle cx="12" cy="-4" r="7" fill="#1B4F72"/>
        <circle cx="0" cy="14" r="7" fill="#1B4F72"/>
      `;
    case "angry":
      return `
        <path d="M -20 -12 L -6 -6" stroke="#1B4F72" stroke-width="4" stroke-linecap="round"/>
        <path d="M 20 -12 L 6 -6" stroke="#1B4F72" stroke-width="4" stroke-linecap="round"/>
        <circle cx="-10" cy="-2" r="4" fill="#1B4F72"/>
        <circle cx="10" cy="-2" r="4" fill="#1B4F72"/>
        <path d="M -12 14 L 12 14" stroke="#1B4F72" stroke-width="4" stroke-linecap="round"/>
        <circle cx="-22" cy="8" r="5" fill="#F4A6A6" opacity="0.8"/>
        <circle cx="22" cy="8" r="5" fill="#F4A6A6" opacity="0.8"/>
      `;
    case "sad":
      return `
        <path d="M -18 -2 Q -12 -10 -6 -2" stroke="#1B4F72" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M 6 -2 Q 12 -10 18 -2" stroke="#1B4F72" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M -12 16 Q 0 8 12 16" stroke="#1B4F72" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle cx="-10" cy="4" r="3" fill="#6EC6FF"/>
      `;
    default:
      return `
        <circle cx="-12" cy="-2" r="4" fill="#1B4F72"/>
        <circle cx="12" cy="-2" r="4" fill="#1B4F72"/>
        <path d="M -10 14 L 10 14" stroke="#1B4F72" stroke-width="4" stroke-linecap="round"/>
      `;
  }
}

function armsRobo(pose) {
  switch (pose) {
    case "point":
      return `
        <rect x="-56" y="-4" width="34" height="14" rx="7" fill="#8FD3F4" stroke="#2E86AB" stroke-width="3" transform="rotate(-25 -56 -4)"/>
        <rect x="34" y="4" width="16" height="42" rx="8" fill="#8FD3F4" stroke="#2E86AB" stroke-width="3"/>
      `;
    case "jump":
      return `
        <rect x="-52" y="-38" width="16" height="42" rx="8" fill="#8FD3F4" stroke="#2E86AB" stroke-width="3" transform="rotate(20 -44 -17)"/>
        <rect x="36" y="-38" width="16" height="42" rx="8" fill="#8FD3F4" stroke="#2E86AB" stroke-width="3" transform="rotate(-20 44 -17)"/>
      `;
    default:
      return `
        <rect x="-50" y="4" width="16" height="42" rx="8" fill="#8FD3F4" stroke="#2E86AB" stroke-width="3"/>
        <rect x="34" y="4" width="16" height="42" rx="8" fill="#8FD3F4" stroke="#2E86AB" stroke-width="3"/>
      `;
  }
}

function legsRobo(pose) {
  if (pose === "jump") {
    return `
      <rect x="-30" y="52" width="16" height="30" rx="6" fill="#2E86AB" transform="rotate(-14 -22 52)"/>
      <rect x="14" y="52" width="16" height="30" rx="6" fill="#2E86AB" transform="rotate(14 22 52)"/>
    `;
  }
  return `
    <rect x="-26" y="60" width="16" height="26" rx="6" fill="#2E86AB"/>
    <rect x="10" y="60" width="16" height="26" rx="6" fill="#2E86AB"/>
  `;
}

export function renderRobo({ x, y, expression = "neutral", pose = "stand", flip = false }) {
  const scaleX = flip ? -1 : 1;
  return `
  <g transform="translate(${x} ${y}) scale(${scaleX} 1)">
    ${legsRobo(pose)}
    <rect x="-40" y="-4" width="80" height="70" rx="16" fill="#8FD3F4" stroke="#2E86AB" stroke-width="3"/>
    <rect x="-16" y="18" width="32" height="20" rx="4" fill="#1B4F72" opacity="0.85"/>
    ${armsRobo(pose)}
    <line x1="0" y1="-58" x2="0" y2="-72" stroke="#2E86AB" stroke-width="4" stroke-linecap="round"/>
    <circle cx="0" cy="-76" r="6" fill="#F4D35E" stroke="#2E86AB" stroke-width="2"/>
    <rect x="-38" y="-58" width="76" height="58" rx="18" fill="#EAF6FB" stroke="#2E86AB" stroke-width="3"/>
    <g transform="translate(0 -30)">
      ${eyesMouth_robo(expression)}
    </g>
  </g>`;
}

function eyesMouth_nyan(expression) {
  switch (expression) {
    case "happy":
      return `
        <path d="M -16 0 Q -10 -8 -4 0" stroke="#7A3E1D" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M 4 0 Q 10 -8 16 0" stroke="#7A3E1D" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M -8 12 Q 0 20 8 12" stroke="#7A3E1D" stroke-width="4" fill="none" stroke-linecap="round"/>
      `;
    case "surprised":
      return `
        <circle cx="-11" cy="0" r="6" fill="#3A1F0F"/>
        <circle cx="11" cy="0" r="6" fill="#3A1F0F"/>
        <ellipse cx="0" cy="14" rx="6" ry="8" fill="#3A1F0F"/>
      `;
    case "angry":
      return `
        <path d="M -18 -8 L -4 -2" stroke="#7A3E1D" stroke-width="4" stroke-linecap="round"/>
        <path d="M 18 -8 L 4 -2" stroke="#7A3E1D" stroke-width="4" stroke-linecap="round"/>
        <path d="M -10 12 L 10 12" stroke="#7A3E1D" stroke-width="4" stroke-linecap="round"/>
        <path d="M -6 12 L -8 20" stroke="#7A3E1D" stroke-width="3" stroke-linecap="round"/>
        <path d="M 6 12 L 8 20" stroke="#7A3E1D" stroke-width="3" stroke-linecap="round"/>
      `;
    case "sad":
      return `
        <path d="M -16 -2 Q -10 4 -4 -2" stroke="#7A3E1D" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M 4 -2 Q 10 4 16 -2" stroke="#7A3E1D" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M -8 16 Q 0 10 8 16" stroke="#7A3E1D" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M -12 4 L -14 16" stroke="#8FD3F4" stroke-width="4" stroke-linecap="round"/>
      `;
    default:
      return `
        <circle cx="-11" cy="0" r="4" fill="#3A1F0F"/>
        <circle cx="11" cy="0" r="4" fill="#3A1F0F"/>
        <path d="M -6 13 Q 0 17 6 13" stroke="#7A3E1D" stroke-width="3" fill="none" stroke-linecap="round"/>
      `;
  }
}

function limbsNyan(pose) {
  switch (pose) {
    case "point":
      return `
        <ellipse cx="-46" cy="-6" rx="20" ry="9" fill="#FFB26B" stroke="#C1622B" stroke-width="3" transform="rotate(-20 -46 -6)"/>
        <ellipse cx="34" cy="18" rx="10" ry="18" fill="#FFB26B" stroke="#C1622B" stroke-width="3"/>
      `;
    case "jump":
      return `
        <ellipse cx="-40" cy="-24" rx="10" ry="20" fill="#FFB26B" stroke="#C1622B" stroke-width="3" transform="rotate(24 -40 -24)"/>
        <ellipse cx="40" cy="-24" rx="10" ry="20" fill="#FFB26B" stroke="#C1622B" stroke-width="3" transform="rotate(-24 40 -24)"/>
      `;
    default:
      return `
        <ellipse cx="-32" cy="20" rx="10" ry="20" fill="#FFB26B" stroke="#C1622B" stroke-width="3"/>
        <ellipse cx="32" cy="20" rx="10" ry="20" fill="#FFB26B" stroke="#C1622B" stroke-width="3"/>
      `;
  }
}

function tailNyan(pose) {
  const d =
    pose === "sad"
      ? "M 30 40 Q 60 60 46 86"
      : pose === "jump" || pose === "happy"
      ? "M 30 30 Q 66 10 58 -22"
      : "M 30 34 Q 62 30 56 4";
  return `<path d="${d}" stroke="#C1622B" stroke-width="10" fill="none" stroke-linecap="round"/>`;
}

export function renderNyan({ x, y, expression = "neutral", pose = "stand", flip = false }) {
  const scaleX = flip ? -1 : 1;
  return `
  <g transform="translate(${x} ${y}) scale(${scaleX} 1)">
    ${tailNyan(pose === "jump" ? "jump" : expression === "sad" ? "sad" : "stand")}
    ${limbsNyan(pose)}
    <ellipse cx="0" cy="10" rx="42" ry="46" fill="#FFB26B" stroke="#C1622B" stroke-width="3"/>
    <ellipse cx="0" cy="26" rx="20" ry="22" fill="#FFE3BF"/>
    <circle cx="0" cy="-40" r="34" fill="#FFB26B" stroke="#C1622B" stroke-width="3"/>
    <path d="M -30 -58 L -14 -34 L -38 -30 Z" fill="#FFB26B" stroke="#C1622B" stroke-width="3"/>
    <path d="M 30 -58 L 14 -34 L 38 -30 Z" fill="#FFB26B" stroke="#C1622B" stroke-width="3"/>
    <path d="M -24 -50 L -16 -38 L -30 -36 Z" fill="#FFDFB3"/>
    <path d="M 24 -50 L 16 -38 L 30 -36 Z" fill="#FFDFB3"/>
    <line x1="-34" y1="-38" x2="-58" y2="-42" stroke="#7A3E1D" stroke-width="2"/>
    <line x1="-34" y1="-32" x2="-58" y2="-30" stroke="#7A3E1D" stroke-width="2"/>
    <line x1="34" y1="-38" x2="58" y2="-42" stroke="#7A3E1D" stroke-width="2"/>
    <line x1="34" y1="-32" x2="58" y2="-30" stroke="#7A3E1D" stroke-width="2"/>
    <g transform="translate(0 -40)">
      ${eyesMouth_nyan(expression)}
    </g>
  </g>`;
}

export function renderCharacter(name, opts) {
  return name === "nyan" ? renderNyan(opts) : renderRobo(opts);
}
