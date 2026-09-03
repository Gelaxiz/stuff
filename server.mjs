import { createReadStream, promises as fs } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number.parseInt(process.env.PORT || "4990", 10);

const MIME = new Map([
  [".html", "text/html; charset=utf-8"], [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"], [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"], [".svg", "image/svg+xml"],
  [".png", "image/png"], [".jpg", "image/jpeg"], [".jpeg", "image/jpeg"],
  [".jfif", "image/jpeg"], [".webp", "image/webp"], [".avif", "image/avif"],
  [".gif", "image/gif"], [".ico", "image/x-icon"], [".wasm", "application/wasm"],
  [".swf", "application/x-shockwave-flash"], [".data", "application/octet-stream"],
  [".mp3", "audio/mpeg"], [".ogg", "audio/ogg"], [".wav", "audio/wav"],
  [".mp4", "video/mp4"], [".webm", "video/webm"], [".zip", "application/zip"],
  [".woff", "font/woff"], [".woff2", "font/woff2"], [".ttf", "font/ttf"],
  [".otf", "font/otf"]
]);

function respond(res, status, body, headers = {}) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8", ...headers });
  res.end(body);
}

async function resolveFile(urlPath) {
  let decoded;
  try { decoded = decodeURIComponent(urlPath); } catch { return null; }
  const relative = decoded.replace(/^\/+/, "");
  let candidate = path.resolve(ROOT, relative);
  if (candidate !== ROOT && !candidate.startsWith(`${ROOT}${path.sep}`)) return null;
  let stat;
  try { stat = await fs.stat(candidate); } catch { return null; }
  if (stat.isDirectory()) {
    candidate = path.join(candidate, "index.html");
    try { stat = await fs.stat(candidate); } catch { return null; }
  }
  return stat.isFile() ? { candidate, stat } : null;
}

const server = createServer(async (req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return respond(res, 405, "Method not allowed", { Allow: "GET, HEAD" });
  }

  const requestUrl = new URL(req.url || "/", "http://localhost");
  const file = await resolveFile(requestUrl.pathname);
  if (!file) return respond(res, 404, "Not found");

  const { candidate, stat } = file;
  const type = MIME.get(path.extname(candidate).toLowerCase()) || "application/octet-stream";
  const headers = {
    "Content-Type": type,
    "Accept-Ranges": "bytes",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Embedder-Policy": "require-corp",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": type.startsWith("text/html") ? "no-cache" : "public, max-age=3600"
  };

  let start = 0;
  let end = stat.size - 1;
  let status = 200;
  const range = req.headers.range;
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match) return respond(res, 416, "Invalid range", { "Content-Range": `bytes */${stat.size}` });
    if (match[1]) start = Number(match[1]);
    if (match[2]) end = Number(match[2]);
    if (!match[1] && match[2]) { const suffix = Number(match[2]); start = Math.max(0, stat.size - suffix); end = stat.size - 1; }
    if (start > end || start >= stat.size) return respond(res, 416, "Range not satisfiable", { "Content-Range": `bytes */${stat.size}` });
    end = Math.min(end, stat.size - 1);
    status = 206;
    headers["Content-Range"] = `bytes ${start}-${end}/${stat.size}`;
  }

  headers["Content-Length"] = String(end - start + 1);
  res.writeHead(status, headers);
  if (req.method === "HEAD") return res.end();
  createReadStream(candidate, { start, end }).on("error", () => res.destroy()).pipe(res);
});

server.listen(PORT, HOST, () => {
  console.log(`Nexus School listening on http://${HOST}:${PORT}`);
});

function shutdown() {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000).unref();
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
