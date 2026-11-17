const input = document.getElementById("videoUrl");
const button = document.getElementById("downloadBtn");
const statusBox = document.getElementById("status");
const platform = document.getElementById("platform");
const auto = document.getElementById("autoDownload");
let busy = false;
let pasteTimer = null;

function detectPlatform(value) {
  try {
    const host = new URL(value).hostname.toLowerCase();
    if (host.includes("instagram.com")) return "Instagram detectado";
    if (host === "youtu.be" || host.includes("youtube.com")) return "YouTube detectado";
  } catch (_) {}
  return value ? "Verificando link..." : "Aguardando link...";
}
function setStatus(message, kind="") {
  statusBox.textContent = message;
  statusBox.className = "status " + kind;
}
async function startDownload() {
  const url = input.value.trim();
  if (busy) return;
  if (!url) { setStatus("Cole primeiro o link do vídeo.", "error"); input.focus(); return; }

  busy = true;
  button.disabled = true;
  button.querySelector("span").textContent = "PROCESSANDO...";
  setStatus("Preparando o vídeo. Isso pode levar alguns instantes...");
  try {
    const response = await fetch("/api/download", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({url})
    });
    const type = response.headers.get("content-type") || "";
    if (!response.ok || type.includes("application/json")) {
      const result = await response.json();
      throw new Error(result.error || "Não foi possível baixar este vídeo.");
    }
    const blob = await response.blob();
    const disposition = response.headers.get("content-disposition") || "";
    const match = disposition.match(/filename\*?=(?:UTF-8''|")?([^";]+)/i);
    let filename = match ? decodeURIComponent(match[1].replace(/"/g,"")) : "video.mp4";
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 30000);
    setStatus("Download preparado! Confira a pasta de downloads do seu dispositivo.", "success");
  } catch (error) {
    setStatus(error.message, "error");
  } finally {
    busy = false;
    button.disabled = false;
    button.querySelector("span").textContent = "BAIXAR VÍDEO";
  }
}
input.addEventListener("input", () => { platform.textContent = detectPlatform(input.value.trim()); });
input.addEventListener("paste", () => {
  clearTimeout(pasteTimer);
  pasteTimer = setTimeout(() => {
    platform.textContent = detectPlatform(input.value.trim());
    if (auto.checked && input.value.trim()) startDownload();
  }, 500);
});
button.addEventListener("click", startDownload);
document.getElementById("clearBtn").addEventListener("click", () => {
  input.value = ""; platform.textContent = "Aguardando link..."; setStatus(""); input.focus();
});
