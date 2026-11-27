import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import {
  assertHistory,
  commitDate,
  latestChange,
  matchingChanges,
  buildManifest,
} from "../plugins/page-modified/history.mjs";

const empty = { updates: [], meetings: [] };
async function repository(t) {
  const root = await mkdtemp(path.join(tmpdir(), "modified-test-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const git = (...args) =>
    execFileSync("git", ["-C", root, ...args], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  git("init", "-q");
  git("config", "user.name", "Fixture");
  git("config", "user.email", "fixture@example.invalid");
  async function put(file, body) {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await writeFile(path.join(root, file), body);
  }
  function commit(date) {
    git("add", ".");
    execFileSync("git", ["-C", root, "commit", "-qm", "Fixture content"], {
      env: { ...process.env, GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date },
    });
  }
  return { root, git, put, commit };
}

test("dates use Newfoundland date at UTC midnight and daylight-saving boundaries", () => {
  assert.equal(
    commitDate(Date.parse("2026-11-27T02:00:00Z") / 1000),
    "2026-11-26",
  );
  assert.equal(
    commitDate(Date.parse("2026-07-01T03:00:00Z") / 1000),
    "2026-07-01",
  );
});

test("Markdown, MDX and TSX pages keep committed dates across rebuilds and unrelated changes", async (t) => {
  const r = await repository(t);
  for (const ext of ["md", "mdx", "tsx"])
    await r.put(`src/pages/${ext}.${ext}`, "Initial content");
  r.commit("2026-11-01T16:00:00Z");
  const pages = ["md", "mdx", "tsx"].map((ext) => ({
    source: `@site/src/pages/${ext}.${ext}`,
    permalink: "/" + ext,
  }));
  const initial = await buildManifest(r.root, pages, empty);
  assert.deepEqual(initial, {
    "/md/": "2026-11-01",
    "/mdx/": "2026-11-01",
    "/tsx/": "2026-11-01",
  });
  await r.put("src/css/custom.css", "Changed colour");
  await r.put("docusaurus.config.ts", "Changed navigation");
  r.commit("2026-11-03T16:00:00Z");
  assert.deepEqual(await buildManifest(r.root, pages, empty), initial);
  await r.put("src/pages/tsx.tsx", "Revised content");
  r.commit("2026-11-04T16:00:00Z");
  assert.equal(
    (await buildManifest(r.root, pages, empty))["/tsx/"],
    "2026-11-04",
  );
  await r.put("src/pages/uncommitted.tsx", "New draft");
  const uncommitted = await buildManifest(
    r.root,
    [{ source: "@site/src/pages/uncommitted.tsx", permalink: "/uncommitted/" }],
    empty,
  );
  assert.equal(uncommitted["/uncommitted/"], null);
});

test("Git history follows a rename and data dependencies include deletions", async (t) => {
  const r = await repository(t);
  await r.put("src/pages/old.mdx", "This content survives a path change.");
  await r.put("content/events/first.json", '{"date":"2026-11-01"}');
  r.commit("2026-11-01T16:00:00Z");
  r.git("mv", "src/pages/old.mdx", "src/pages/new.mdx");
  r.commit("2026-11-02T16:00:00Z");
  assert.equal(
    commitDate(latestChange(r.root, ["src/pages/new.mdx"], true)),
    "2026-11-01",
  );
  await rm(path.join(r.root, "content/events/first.json"));
  r.commit("2026-11-05T16:00:00Z");
  assert.equal(
    commitDate(latestChange(r.root, ["content/events"])),
    "2026-11-05",
  );
  assert.equal(latestChange(r.root, []), 0);
});

test("only promotion changes affect calendar dependencies, including unpromotion and deletion", async (t) => {
  const r = await repository(t);
  const dir = "src/pages/parents-guardians/support-committee/updates";
  const promoted = (text) => /^promoteToAnnouncements: true$/m.test(text);
  await r.put(dir + "/public.mdx", "promoteToAnnouncements: true");
  r.commit("2026-11-01T16:00:00Z");
  await r.put(dir + "/listing-only.mdx", "promoteToAnnouncements: false");
  r.commit("2026-11-03T16:00:00Z");
  assert.equal(
    commitDate(matchingChanges(r.root, dir, promoted)),
    "2026-11-01",
  );
  await r.put(dir + "/public.mdx", "promoteToAnnouncements: false");
  r.commit("2026-11-04T16:00:00Z");
  assert.equal(
    commitDate(matchingChanges(r.root, dir, promoted)),
    "2026-11-04",
  );
  await r.put(dir + "/delete-me.mdx", "promoteToAnnouncements: true");
  r.commit("2026-11-05T16:00:00Z");
  await rm(path.join(r.root, dir, "delete-me.mdx"));
  r.commit("2026-11-06T16:00:00Z");
  assert.equal(
    commitDate(matchingChanges(r.root, dir, promoted)),
    "2026-11-06",
  );
});

test("data pages receive record changes while other pages retain source dates", async (t) => {
  const r = await repository(t);
  const sources = [
    "calendar",
    "other",
    "parents-guardians/support-committee/updates/index",
  ];
  for (const source of sources) await r.put(`src/pages/${source}.tsx`, "Page");
  r.commit("2026-11-01T16:00:00Z");
  await r.put("content/events/event.json", '{"category":"training"}');
  r.commit("2026-11-02T16:00:00Z");
  await r.put(
    "src/pages/parents-guardians/support-committee/updates/example.mdx",
    "promoteToAnnouncements: false",
  );
  r.commit("2026-11-03T16:00:00Z");
  const manifest = await buildManifest(
    r.root,
    sources.map((source) => ({
      source: `@site/src/pages/${source}.tsx`,
      permalink: "/" + source.replace(/\/index$/, ""),
    })),
    empty,
  );
  assert.equal(manifest["/calendar/"], "2026-11-02");
  assert.equal(manifest["/other/"], "2026-11-01");
  assert.equal(
    manifest["/parents-guardians/support-committee/updates/"],
    "2026-11-03",
  );
});

test("missing or shallow Git history is an explicit validation error", async (t) => {
  const r = await repository(t);
  assert.throws(() => assertHistory(r.root), /full history/);
  await r.put("src/pages/index.tsx", "Initial");
  r.commit("2026-11-01T16:00:00Z");
  assertHistory(r.root);
  const shallow = r.root + "-shallow";
  t.after(() => rm(shallow, { recursive: true, force: true }));
  execFileSync("git", [
    "clone",
    "-q",
    "--depth=1",
    "file://" + r.root,
    shallow,
  ]);
  assert.throws(() => assertHistory(shallow), /full history/);
});

test("the build rejects a future page that bypasses the shared date layout", async (t) => {
  const r = await repository(t);
  await r.put("src/pages/new.tsx", "A new page");
  r.commit("2026-11-01T16:00:00Z");
  const { createRequire } = await import("node:module");
  const plugin = createRequire(import.meta.url)(
    "../plugins/page-modified/index.cjs",
  )({ siteDir: r.root });
  await plugin.allContentLoaded({
    allContent: {
      "docusaurus-plugin-content-pages": {
        default: [{ source: "@site/src/pages/new.tsx", permalink: "/new/" }],
      },
      "squadron-content": { default: { ssc: empty } },
    },
    actions: { setGlobalData() {} },
  });
  const outDir = path.join(r.root, "build");
  await r.put("build/new/index.html", "<main>A page missing its date</main>");
  await assert.rejects(
    plugin.postBuild({ outDir }),
    /Missing modification date rendering/,
  );
});
