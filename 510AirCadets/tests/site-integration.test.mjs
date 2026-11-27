import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { contactLinks } from "../src/contactLinks.ts";

const root = fileURLToPath(new URL("../", import.meta.url));

test("SSC and website forms share the supplied URL until verified recipient links exist", () => {
  assert.equal(contactLinks.committee, "https://forms.gle/5aLU45ygLnfTy9yAA");
  assert.equal(contactLinks.website, contactLinks.committee);
});

test("existing public Parents routes redirect to canonical replacements", async () => {
  const redirects = {
    "parents/index.tsx": "/parents-guardians/",
    "parents-cadets.tsx": "/parents-guardians/",
    "parents/support-group/index.tsx": "/parents-guardians/support-committee/",
    "parents/support-group/updates/index.tsx":
      "/parents-guardians/support-committee/updates/",
    "parents/support-group/meetings/index.tsx":
      "/parents-guardians/support-committee/meetings/",
    "parents/support-group/updates/2026-11-23-flea-market.tsx":
      "/parents-guardians/support-committee/updates/2026-11-23-flea-market/",
  };
  for (const [source, target] of Object.entries(redirects)) {
    const text = await readFile(path.join(root, "src/pages", source), "utf8");
    assert.match(text, /CompatibilityRoute/);
    assert.ok(text.includes(`target="${target}"`), source);
  }
});

test("public page source avoids obsolete committee terminology and maintenance email addresses", async () => {
  async function walk(directory) {
    for (const file of await readdir(directory, { withFileTypes: true })) {
      const source = path.join(directory, file.name);
      if (file.isDirectory()) await walk(source);
      else if (/\.(tsx|mdx|md)$/.test(file.name)) {
        const text = await readFile(source, "utf8");
        assert.doesNotMatch(
          text,
          /Parents Support Group|\bPSG\b|parent volunteer|Parent Pickup/,
        );
        assert.doesNotMatch(text, /mailto:/);
      }
    }
  }
  await walk(path.join(root, "src"));
});

test("footer and primary navigation use the requested inclusive labels", async () => {
  const config = await readFile(
    path.join(root, "docusaurus.config.ts"),
    "utf8",
  );
  assert.match(config, /Parents & Guardians/);
  assert.match(
    config,
    /Independently maintained by volunteers of the Squadron Support Committee/,
  );
  assert.match(config, /View website source on GitHub/);
  assert.match(config, /https:\/\/github.com\/Infomatron\/510aircadets.ca/);
});
