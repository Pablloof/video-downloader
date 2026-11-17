from flask import Flask, render_template, request, jsonify, send_file
from pathlib import Path
from urllib.parse import urlparse
import tempfile
import threading
import yt_dlp
import os

app = Flask(__name__)
ALLOWED_HOSTS = {
    "youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be",
    "instagram.com", "www.instagram.com"
}

def valid_video_url(value):
    try:
        parsed = urlparse(value.strip())
        host = (parsed.hostname or "").lower()
        return parsed.scheme in ("http", "https") and any(
            host == domain or host.endswith("." + domain) for domain in ALLOWED_HOSTS
        )
    except Exception:
        return False

@app.get("/")
def index():
    return render_template("index.html")

@app.post("/api/download")
def download_video():
    data = request.get_json(silent=True) or {}
    url = (data.get("url") or "").strip()

    if not valid_video_url(url):
        return jsonify(error="Cole um link válido do Instagram ou YouTube."), 400

    temp_dir = tempfile.mkdtemp(prefix="video_dl_")
    output_template = os.path.join(temp_dir, "%(title).100B-%(id)s.%(ext)s")
    options = {
        "format": "bestvideo*+bestaudio/best",
        "merge_output_format": "mp4",
        "outtmpl": output_template,
        "noplaylist": True,
        "restrictfilenames": True,
        "quiet": True,
        "no_warnings": True,
        "windowsfilenames": True,
    }

    try:
        with yt_dlp.YoutubeDL(options) as ydl:
            ydl.download([url])

        candidates = [p for p in Path(temp_dir).iterdir() if p.is_file()]
        if not candidates:
            raise RuntimeError("O serviço não retornou um arquivo de vídeo.")
        result = max(candidates, key=lambda p: p.stat().st_size)

        response = send_file(
            result,
            as_attachment=True,
            download_name=result.name,
            mimetype="video/mp4" if result.suffix.lower() == ".mp4" else "application/octet-stream"
        )

        def cleanup():
            import shutil
            shutil.rmtree(temp_dir, ignore_errors=True)

        response.call_on_close(cleanup)
        return response

    except Exception as exc:
        import shutil
        shutil.rmtree(temp_dir, ignore_errors=True)
        message = str(exc)
        if "Sign in" in message or "login" in message.lower() or "cookies" in message.lower():
            message = "A plataforma exige autenticação ou não permite este acesso. Use apenas conteúdo que você tenha autorização para baixar."
        elif "Unsupported URL" in message:
            message = "Não foi possível reconhecer esse link. Confira se é do Instagram ou YouTube."
        return jsonify(error=message[:500]), 422

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=False)
