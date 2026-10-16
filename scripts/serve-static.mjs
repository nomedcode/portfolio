// Serves the static export in CI, where `next start` refuses output: "export". No dependencies.
import { createReadStream, statSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";

const TYPES = {
  ".css": "text/css",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".js": "text/javascript",
  ".json": "application/json",
  ".map": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

// ponytail: serves files and directory indexes only; add a "<path>.html" lookup if a multi-page export ever 404s.
export function createStaticServer(root) {
  const base = path.resolve(root);
  return http.createServer((req, res) => {
    let file = path.join(base, decodeURIComponent(new URL(req.url, "http://localhost").pathname));
    if (file !== base && !file.startsWith(base + path.sep)) {
      res.writeHead(404).end("not found");
      return;
    }
    try {
      if (statSync(file).isDirectory()) file = path.join(file, "index.html");
      if (!statSync(file).isFile()) throw new Error("not a file");
    } catch {
      res.writeHead(404).end("not found");
      return;
    }
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" });
    createReadStream(file).pipe(res);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = process.argv[2] ?? "out";
  const port = Number(process.argv[3] ?? 3100);
  createStaticServer(root).listen(port, () => {
    console.log(`serving ${root} on http://localhost:${port}`);
  });
}
