// GitHub Pages (https://<owner>.github.io/<repo>/) で動く前提で、
// URLからowner/repoを自動判定してActionsバッジ・リンクを組み立てる。
function detectRepo() {
  const host = location.hostname; // 例: tsax0.github.io
  if (!host.endsWith(".github.io")) return null;
  const owner = host.split(".")[0];
  const repo = location.pathname.split("/").filter(Boolean)[0];
  if (!owner || !repo) return null;
  return `${owner}/${repo}`;
}

function formatDateTime(iso) {
  if (!iso) return "不明";
  const d = new Date(iso);
  return d.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function fetchJson(path) {
  try {
    const res = await fetch(`${path}?_=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function renderStatus(status, repo) {
  const el = document.getElementById("status-badge");
  if (!status) {
    el.textContent = "実行ステータスがまだありません(初回実行待ち)";
    el.className = "status-badge status-loading";
    return;
  }

  const when = formatDateTime(status.timestamp);
  const ok = status.status === "success";
  el.className = `status-badge ${ok ? "status-success" : "status-failed"}`;
  const label = ok ? "成功" : "失敗";
  const text = `最終実行: ${when} / ${label}`;

  if (status.runUrl) {
    el.innerHTML = `<a href="${status.runUrl}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none;">${text} →</a>`;
  } else {
    el.textContent = text;
  }

  if (!ok && status.error) {
    const detail = document.createElement("div");
    detail.style.marginTop = "6px";
    detail.style.fontSize = "12px";
    detail.style.opacity = "0.8";
    detail.textContent = status.error;
    el.appendChild(document.createElement("br"));
    el.appendChild(detail);
  }

  const badgeWrap = document.getElementById("workflow-badge-wrap");
  if (repo) {
    badgeWrap.innerHTML = `<a href="https://github.com/${repo}/actions/workflows/daily-comic.yml" target="_blank" rel="noopener"><img src="https://github.com/${repo}/actions/workflows/daily-comic.yml/badge.svg" alt="workflow status" /></a>`;
    document.getElementById("repo-link").href = `https://github.com/${repo}`;
  }
}

function comicCard(entry) {
  const card = document.createElement("div");
  card.className = "gallery-card";
  card.innerHTML = `
    <img src="${entry.path}" alt="${entry.title}" loading="lazy" />
    <div class="meta">
      <div class="date">${entry.date}</div>
      <div class="title">${entry.title}</div>
    </div>
  `;
  card.addEventListener("click", () => openLightbox(entry));
  return card;
}

function openLightbox(entry) {
  document.getElementById("lightbox-img").src = entry.path;
  document.getElementById("lightbox-img").alt = entry.title;
  document.getElementById("lightbox-caption").textContent = `${entry.date} — ${entry.title}`;
  document.getElementById("lightbox").classList.remove("hidden");
}

function closeLightbox() {
  document.getElementById("lightbox").classList.add("hidden");
}

async function main() {
  const repo = detectRepo();
  const [index, status] = await Promise.all([
    fetchJson("comics/index.json"),
    fetchJson("comics/status.json"),
  ]);

  renderStatus(status, repo);

  const list = Array.isArray(index) ? index : [];
  const latestWrap = document.getElementById("latest-comic");
  const grid = document.getElementById("gallery-grid");

  if (list.length === 0) {
    latestWrap.innerHTML = `<p class="empty">まだ4コマがありません。最初の自動実行をお待ちください。</p>`;
    return;
  }

  const [latest, ...rest] = list;
  latestWrap.innerHTML = "";
  const img = document.createElement("img");
  img.src = latest.path;
  img.alt = latest.title;
  img.addEventListener("click", () => openLightbox(latest));
  latestWrap.appendChild(img);

  grid.innerHTML = "";
  rest.forEach((entry) => grid.appendChild(comicCard(entry)));

  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  document.querySelector(".lightbox-backdrop").addEventListener("click", closeLightbox);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}

main();
