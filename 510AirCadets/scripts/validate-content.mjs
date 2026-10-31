import { fileURLToPath } from "node:url";
import { loadContent } from "../plugins/squadron-content/load.mjs";
try {
  const data = await loadContent(
    fileURLToPath(new URL("../", import.meta.url)),
  );
  console.log(
    `Content valid: ${data.events.length} events, ${data.announcements.length} announcements.`,
  );
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
}
