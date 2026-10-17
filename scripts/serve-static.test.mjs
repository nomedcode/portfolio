import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, expect, test } from "vitest";
import { createStaticServer } from "./serve-static.mjs";

let server;
let base;

beforeAll(async () => {
  const root = mkdtempSync(path.join(tmpdir(), "serve-static-"));
  writeFileSync(path.join(root, "index.html"), "<h1>home</h1>");
  writeFileSync(path.join(root, "404.html"), "<h1>gone</h1>");
  writeFileSync(path.join(root, "CV.pdf"), "%PDF-1.4");
  mkdirSync(path.join(root, "_next"));
  writeFileSync(path.join(root, "_next", "app.js"), "console.log(1)");
  server = createStaticServer(root);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

afterAll(() => server.close());

test("serves index.html at / as text/html", async () => {
  const res = await fetch(`${base}/`);
  expect(res.status).toBe(200);
  expect(res.headers.get("content-type")).toContain("text/html");
  expect(await res.text()).toBe("<h1>home</h1>");
});

test("serves js with a javascript content type", async () => {
  const res = await fetch(`${base}/_next/app.js`);
  expect(res.status).toBe(200);
  expect(res.headers.get("content-type")).toContain("javascript");
  expect(await res.text()).toBe("console.log(1)");
});

test("404s missing files and rejects path traversal", async () => {
  expect((await fetch(`${base}/nope.js`)).status).toBe(404);
  expect((await fetch(`${base}/%2e%2e/package.json`)).status).toBe(404);
});

test("a malformed escape returns 400 instead of crashing the process", async () => {
  const res = await fetch(`${base}/%`);
  expect(res.status).toBe(400);
  // The server must still answer after the bad request.
  expect((await fetch(`${base}/`)).status).toBe(200);
});

test("missing pages return the exported 404 page with a 404 status", async () => {
  const res = await fetch(`${base}/nope`);
  expect(res.status).toBe(404);
  expect(res.headers.get("content-type")).toContain("text/html");
  expect(await res.text()).toBe("<h1>gone</h1>");
});

test("serves pdf with an application/pdf type", async () => {
  const res = await fetch(`${base}/CV.pdf`);
  expect(res.headers.get("content-type")).toBe("application/pdf");
});

test("every response carries nosniff", async () => {
  for (const url of ["/", "/_next/app.js", "/CV.pdf"]) {
    expect((await fetch(base + url)).headers.get("x-content-type-options")).toBe(
      "nosniff"
    );
  }
});
