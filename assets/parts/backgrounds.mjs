// パネル背景のSVGフラグメント。複数パネルを1枚のSVGにまとめるため、
// pattern/gradientのidは呼び出し側から一意なuid接尾辞を渡してもらう。

const PALETTES = ["#FFF6E9", "#E9F5FF", "#F1FFE9", "#FFEFF6", "#F3EEFF"];

export function background(type, uid, w, h) {
  switch (type) {
    case "dots": {
      const id = `dots-${uid}`;
      const base = PALETTES[uid % PALETTES.length];
      return `
        <defs>
          <pattern id="${id}" width="26" height="26" patternUnits="userSpaceOnUse">
            <rect width="26" height="26" fill="${base}"/>
            <circle cx="13" cy="13" r="3" fill="#00000012"/>
          </pattern>
        </defs>
        <rect x="0" y="0" width="${w}" height="${h}" fill="url(#${id})"/>
      `;
    }
    case "impact": {
      const cx = w / 2;
      const cy = h / 2;
      let lines = "";
      const n = 20;
      for (let i = 0; i < n; i++) {
        const angle = (i / n) * Math.PI * 2;
        const r1 = 30;
        const r2 = Math.max(w, h) * 0.85;
        const x1 = cx + Math.cos(angle) * r1;
        const y1 = cy + Math.sin(angle) * r1;
        const x2 = cx + Math.cos(angle) * r2;
        const y2 = cy + Math.sin(angle) * r2;
        lines += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#FFFFFF" stroke-width="3"/>`;
      }
      return `
        <rect x="0" y="0" width="${w}" height="${h}" fill="#FFD166"/>
        <g opacity="0.9">${lines}</g>
      `;
    }
    case "night": {
      const id = `night-${uid}`;
      let stars = "";
      let seed = uid * 7919 + 13;
      const rand = () => {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        return seed / 2147483648;
      };
      for (let i = 0; i < 18; i++) {
        const sx = (rand() * w).toFixed(1);
        const sy = (rand() * h * 0.7).toFixed(1);
        const r = (rand() * 1.6 + 0.6).toFixed(1);
        stars += `<circle cx="${sx}" cy="${sy}" r="${r}" fill="#FFFFFF" opacity="${(rand() * 0.6 + 0.4).toFixed(2)}"/>`;
      }
      return `
        <defs>
          <linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#2B2D6E"/>
            <stop offset="100%" stop-color="#4C3A7A"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${w}" height="${h}" fill="url(#${id})"/>
        ${stars}
      `;
    }
    default: {
      const base = PALETTES[uid % PALETTES.length];
      return `<rect x="0" y="0" width="${w}" height="${h}" fill="${base}"/>`;
    }
  }
}
