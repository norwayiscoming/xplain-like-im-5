declare const PACKS_JSON: string;

import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const PACKS: Record<string, string> = JSON.parse(PACKS_JSON);
const AGENT_PREFIX = "xli5-";
const AGENTS_DIR = path.join(os.homedir(), ".claude", "agents");
const PACK_NAMES = Object.keys(PACKS);

function printHeader(): void {
  console.log(`
  ██╗  ██╗██╗     ██╗███████╗
  ╚██╗██╔╝██║     ██║██╔════╝
   ╚███╔╝ ██║     ██║███████╗
   ██╔██╗ ██║     ██║╚════██║
  ██╔╝ ██╗███████╗██║███████║
  ╚═╝  ╚═╝╚══════╝╚═╝╚══════╝
  xplain-like-im-5 — Claude speaks human
  `);
}

function printPackPreview(packName: string): void {
  const previews: Record<string, string> = {
    eli5: '  🧒 "Your website is open! Everyone can see it now,\n     like opening the doors of your shop! 🏪"',
    grandma: '  👵 "It\'s up and running now, dear! Anyone can visit it,\n     just like when grandma\'s shop is open for customers"',
    business: '  💼 "The update is live. Users can access the new\n     version now. No downtime reported."',
    "gen-z": '  ⚡ "it\'s live 🚀 everyone can see it now"',
    teacher: '  📚 "The website is now published — think of it like\n     printing a book and putting it in bookstores"',
  };
  if (previews[packName]) {
    console.log("  Preview (how it explains 'deploy'):\n");
    console.log(previews[packName]);
  }
}

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
  console.log(`\n  ✅ Installed "${packName}"\n`);
  printPackPreview(packName);
  console.log(`\n  Start chatting:\n`);
  console.log(`    claude --agent xli5-${packName}\n`);
}

function installAll(): void {
  printHeader();
  ensureAgentsDir();
  const descriptions: Record<string, string> = {
    eli5: "🧒 Explains like you're 5 — simple words, fun analogies",
    grandma: "👵 Patient grandma — warm, step-by-step, never rushes",
    business: "💼 Executive briefing — impact, timeline, outcomes",
    "gen-z": "⚡ Gen-Z vibes — short, casual, no fluff",
    teacher: "📚 Teacher mode — structured, with examples and checks",
  };
  for (const name of PACK_NAMES) {
    const dest = path.join(AGENTS_DIR, `${AGENT_PREFIX}${name}.md`);
    fs.writeFileSync(dest, PACKS[name], "utf-8");
    console.log(`  ✅ ${descriptions[name] || name}`);
  }
  console.log(`\n  🎉 All ${PACK_NAMES.length} packs installed!\n`);
  console.log(`  Start chatting with any persona:\n`);
  for (const name of PACK_NAMES) {
    console.log(`    claude --agent xli5-${name}`);
  }
  console.log();
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
  printHeader();
  const installed = getInstalledPacks();
  const descriptions: Record<string, string> = {
    eli5: "🧒 Explains like you're 5",
    grandma: "👵 Patient grandma style",
    business: "💼 Executive briefing",
    "gen-z": "⚡ Gen-Z vibes",
    teacher: "📚 Teacher mode",
  };
  console.log("  Packs:\n");
  for (const name of PACK_NAMES) {
    const status = installed.includes(name) ? "✅" : "  ";
    console.log(`  ${status} ${descriptions[name] || name}  (xli5-${name})`);
  }
  console.log(`\n  Install:     npx xplain-like-im-5 install <pack>`);
  console.log(`  Install all: npx xplain-like-im-5 install --all`);
  console.log(`  Start chat:  claude --agent xli5-<pack>\n`);
}

function help(): void {
  printHeader();
  console.log(`  Usage:
    xplain-like-im-5 install <pack>    Install a persona
    xplain-like-im-5 install --all     Install all personas
    xplain-like-im-5 remove <pack>     Remove a persona
    xplain-like-im-5 reset             Remove all personas
    xplain-like-im-5 list              Show available personas

  Packs: ${PACK_NAMES.join(", ")}

  After installing:
    claude --agent xli5-<pack>
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
