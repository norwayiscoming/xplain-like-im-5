declare const PACKS_JSON: string;

import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const PACKS: Record<string, string> = JSON.parse(PACKS_JSON);
const AGENT_PREFIX = "xli5-";
const AGENTS_DIR = path.join(os.homedir(), ".claude", "agents");
const PACK_NAMES = Object.keys(PACKS);

function ensureAgentsDir(): void {
  fs.mkdirSync(AGENTS_DIR, { recursive: true });
}

function getInstalledPacks(): string[] {
  if (!fs.existsSync(AGENTS_DIR)) return [];
  return fs
    .readdirSync(AGENTS_DIR)
    .filter((f) => f.startsWith(AGENT_PREFIX) && f.endsWith(".md"))
    .map((f) => f.slice(AGENT_PREFIX.length, -3));
}

function install(packName: string): void {
  if (!PACKS[packName]) {
    console.error(`❌ Unknown pack: "${packName}". Available: ${PACK_NAMES.join(", ")}`);
    process.exit(1);
  }
  ensureAgentsDir();
  const dest = path.join(AGENTS_DIR, `${AGENT_PREFIX}${packName}.md`);
  fs.writeFileSync(dest, PACKS[packName], "utf-8");
  console.log(`✅ Installed "${packName}" → ${dest}`);
  console.log(`   Open Claude Code → /agents → select "xli5-${packName}"`);
}

function installAll(): void {
  ensureAgentsDir();
  for (const name of PACK_NAMES) {
    const dest = path.join(AGENTS_DIR, `${AGENT_PREFIX}${name}.md`);
    fs.writeFileSync(dest, PACKS[name], "utf-8");
    console.log(`✅ Installed "${name}"`);
  }
  console.log(`\n🎉 All ${PACK_NAMES.length} packs installed! Open Claude Code → /agents to use them.`);
}

function remove(packName: string): void {
  const dest = path.join(AGENTS_DIR, `${AGENT_PREFIX}${packName}.md`);
  if (!fs.existsSync(dest)) {
    console.error(`❌ Pack "${packName}" is not installed.`);
    process.exit(1);
  }
  fs.unlinkSync(dest);
  console.log(`🗑️  Removed "${packName}"`);
}

function reset(): void {
  const installed = getInstalledPacks();
  if (installed.length === 0) {
    console.log("Nothing to remove — no packs installed.");
    return;
  }
  for (const name of installed) {
    fs.unlinkSync(path.join(AGENTS_DIR, `${AGENT_PREFIX}${name}.md`));
  }
  console.log(`🗑️  Removed ${installed.length} pack(s): ${installed.join(", ")}`);
}

function list(): void {
  const installed = getInstalledPacks();
  console.log("📦 xplain-like-im-5 packs\n");
  for (const name of PACK_NAMES) {
    const status = installed.includes(name) ? "✅ installed" : "   available";
    console.log(`  ${status}  ${name}`);
  }
  console.log(`\nInstall: npx xplain-like-im-5 install <pack>`);
  console.log(`Install all: npx xplain-like-im-5 install --all`);
}

function help(): void {
  console.log(`
xplain-like-im-5 — Claude Code agents that explain things simply

Usage:
  xplain-like-im-5 install <pack>    Install a persona pack
  xplain-like-im-5 install --all     Install all packs
  xplain-like-im-5 remove <pack>     Remove a pack
  xplain-like-im-5 reset             Remove all packs
  xplain-like-im-5 list              Show available & installed packs

Packs: ${PACK_NAMES.join(", ")}

After installing, open Claude Code → /agents → select the persona.
`);
}

// --- Main ---
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case "install":
    if (args[1] === "--all") {
      installAll();
    } else if (args[1]) {
      install(args[1]);
    } else {
      console.error("Usage: xplain-like-im-5 install <pack|--all>");
      process.exit(1);
    }
    break;
  case "remove":
    if (args[1]) {
      remove(args[1]);
    } else {
      console.error("Usage: xplain-like-im-5 remove <pack>");
      process.exit(1);
    }
    break;
  case "reset":
    reset();
    break;
  case "list":
    list();
    break;
  default:
    help();
}
