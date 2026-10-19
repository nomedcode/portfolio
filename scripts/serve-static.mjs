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
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

// ponytail: serves files and directory indexes only; add a "<path>.html" lookup if a multi-page export ever 404s.
export function createStaticServer(root) {
  const base = path.resolve(root);

  const send = (res, status, body, type = "text/plain; charset=utf-8") => {
    res.writeHead(status, {
      "content-type": type,
      "x-content-type-options": "nosniff",
    });
    res.end(body);
  };

  // The export's own 404 page keeps a missing URL inside the design instead of a bare "not found".
  const notFound = (res) => {
    const page = path.join(base, "404.html");
    try {
      if (statSync(page).isFile()) {
        res.writeHead(404, {
          "content-type": TYPES[".html"],
          "x-content-type-options": "nosniff",
        });
        createReadStream(page).pipe(res);
        return;
      }
    } catch {}
    send(res, 404, "not found");
  };

  return http.createServer((req, res) => {
    let file;
    try {
      file = path.join(
        base,
        decodeURIComponent(new URL(req.url, "http://localhost").pathname)
      );
    } catch {
      // A malformed escape (e.g. "/%") must not take the whole server down.
      send(res, 400, "bad request");
      return;
    }
    if (file !== base && !file.startsWith(base + path.sep)) {
      notFound(res);
      return;
    }
    try {
      if (statSync(file).isDirectory()) file = path.join(file, "index.html");
      if (!statSync(file).isFile()) throw new Error("not a file");
    } catch {
      notFound(res);
      return;
    }
    res.writeHead(200, {
      "content-type": TYPES[path.extname(file)] ?? "application/octet-stream",
      "x-content-type-options": "nosniff",
    });
    createReadStream(file).pipe(res);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = process.argv[2] ?? "out";
  const port = Number(process.argv[3] ?? 3100);
  // Loopback only: a preview server should not be reachable from the local network.
  createStaticServer(root).listen(port, "127.0.0.1", () => {
    console.log(`serving ${root} on http://127.0.0.1:${port}`);
  });
}
