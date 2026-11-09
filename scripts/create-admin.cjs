// Replaced by scripts/db-setup.mjs (npm run db:setup). Kept so older instructions still work.
const { spawnSync } = require("node:child_process");
const result = spawnSync(process.execPath, ["scripts/db-setup.mjs", "--no-seed", ...process.argv.slice(2)], { stdio: "inherit" });
process.exit(result.status ?? 1);
