declare const PACKS_JSON: string;

import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const PACKS: Record<string, string> = JSON.parse(PACKS_JSON);
const AGENT_PREFIX = "xli5-";
const AGENTS_DIR = path.join(os.homedir(), ".claude", "agents");
const PACK_NAMES = Object.keys(PACKS);

// ANSI colors
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;
const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
const magenta = (s: string) => `\x1b[35m${s}\x1b[0m`;

function printHeader(): void {
  console.log();
  console.log(cyan("  ╔═══════════════════════════════════════════════╗"));
  console.log(cyan("  ║") + bold("  ██╗  ██╗██╗     ██╗███████╗                  ") + cyan("║"));
  console.log(cyan("  ║") + bold("  ╚██╗██╔╝██║     ██║██╔════╝                  ") + cyan("║"));
  console.log(cyan("  ║") + bold("   ╚███╔╝ ██║     ██║███████╗                  ") + cyan("║"));
  console.log(cyan("  ║") + bold("   ██╔██╗ ██║     ██║╚════██║                  ") + cyan("║"));
  console.log(cyan("  ║") + bold("  ██╔╝ ██╗███████╗██║███████║                  ") + cyan("║"));
  console.log(cyan("  ║") + bold("  ╚═╝  ╚═╝╚══════╝╚═╝╚══════╝                  ") + cyan("║"));
  console.log(cyan("  ║                                               ║"));
  console.log(cyan("  ║") + `  ${magenta("xplain-like-im-5")} — ${dim("Claude speaks human")}       ` + cyan("║"));
  console.log(cyan("  ╚═══════════════════════════════════════════════╝"));
  console.log();
}

function printPackPreview(packName: string): void {
  const previews: Record<string, { emoji: string; sample: string }> = {
    eli5: {
      emoji: "🧒",
      sample: '"Your website is open! Everyone can see it now,\n       like opening the doors of your shop! 🏪"',
    },
    grandma: {
      emoji: "👵",
      sample: '"It\'s up and running now, dear! Anyone can visit it,\n       just like when grandma\'s shop is open for customers"',
    },
    business: {
      emoji: "💼",
      sample: '"The update is live. Users can access the new version\n       now. No downtime reported."',
    },
    "gen-z": {
      emoji: "⚡",
      sample: '"it\'s live 🚀 everyone can see it now"',
    },
    teacher: {
      emoji: "📚",
      sample: '"The website is now published — think of it like\n       printing a book and putting it in bookstores"',
    },
  };
  const p = previews[packName];
  if (p) {
    console.log(dim("  ┌─────────────────────────────────────────────┐"));
    console.log(dim("  │") + ` ${p.emoji} How it explains ${yellow("'deploy'")}:               ` + dim("│"));
    console.log(dim("  │") + `                                             ` + dim("│"));
    console.log(`     ${green(p.sample)}`);
    console.log(dim("  └─────────────────────────────────────────────┘"));
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
    console.error(`\n  ❌ Unknown pack: "${packName}". Available: ${PACK_NAMES.join(", ")}\n`);
    process.exit(1);
  }
  ensureAgentsDir();
  const dest = path.join(AGENTS_DIR, `${AGENT_PREFIX}${packName}.md`);
  fs.writeFileSync(dest, PACKS[packName], "utf-8");
  console.log(`\n  ✅ ${green(`Installed "${packName}"`)}\n`);
  printPackPreview(packName);
  console.log();
  console.log(`  ${bold("Start chatting:")}`);
  console.log(`  ${cyan(`$ claude --agent xli5-${packName}`)}`);
  console.log();
}

function installAll(): void {
  printHeader();
  ensureAgentsDir();
  const descriptions: Record<string, string> = {
    eli5: "🧒  Explains like you're 5 — simple words, fun analogies",
    grandma: "👵  Patient grandma — warm, step-by-step, never rushes",
    business: "💼  Executive briefing — impact, timeline, outcomes",
    "gen-z": "⚡  Gen-Z vibes — short, casual, no fluff",
    teacher: "📚  Teacher mode — structured, with examples and checks",
  };

  console.log(dim("  ───────────────────────────────────────────────"));
  for (const name of PACK_NAMES) {
    const dest = path.join(AGENTS_DIR, `${AGENT_PREFIX}${name}.md`);
    fs.writeFileSync(dest, PACKS[name], "utf-8");
    console.log(`  ${green("✅")} ${descriptions[name] || name}`);
  }
  console.log(dim("  ───────────────────────────────────────────────"));

  console.log();
  console.log(`  🎉 ${bold(`All ${PACK_NAMES.length} packs installed!`)}`);
  console.log();
  console.log(`  ${bold("Start chatting with any persona:")}`);
  console.log();
  for (const name of PACK_NAMES) {
    console.log(`  ${cyan(`$ claude --agent xli5-${name}`)}`);
  }
  console.log();
}

function remove(packName: string): void {
  const dest = path.join(AGENTS_DIR, `${AGENT_PREFIX}${packName}.md`);
  if (!fs.existsSync(dest)) {
    console.error(`\n  ❌ Pack "${packName}" is not installed.\n`);
    process.exit(1);
  }
  fs.unlinkSync(dest);
  console.log(`\n  🗑️  ${yellow(`Removed "${packName}"`)}\n`);
}

function reset(): void {
  const installed = getInstalledPacks();
  if (installed.length === 0) {
    console.log("\n  Nothing to remove — no packs installed.\n");
    return;
  }
  for (const name of installed) {
    fs.unlinkSync(path.join(AGENTS_DIR, `${AGENT_PREFIX}${name}.md`));
  }
  console.log(`\n  🗑️  ${yellow(`Removed ${installed.length} pack(s):`)} ${installed.join(", ")}\n`);
}

function list(): void {
  printHeader();
  const installed = getInstalledPacks();
  const descriptions: Record<string, string> = {
    eli5: "🧒  Explains like you're 5",
    grandma: "👵  Patient grandma style",
    business: "💼  Executive briefing",
    "gen-z": "⚡  Gen-Z vibes",
    teacher: "📚  Teacher mode",
  };

  console.log(dim("  ───────────────────────────────────────────────"));
  for (const name of PACK_NAMES) {
    const status = installed.includes(name) ? green("✅") : dim("○ ");
    console.log(`  ${status} ${descriptions[name] || name}  ${dim(`(xli5-${name})`)}`);
  }
  console.log(dim("  ───────────────────────────────────────────────"));
  console.log();
  console.log(`  ${dim("Install:")}     ${cyan("npx xplain-like-im-5 install <pack>")}`);
  console.log(`  ${dim("Install all:")} ${cyan("npx xplain-like-im-5 install --all")}`);
  console.log(`  ${dim("Start chat:")}  ${cyan("claude --agent xli5-<pack>")}`);
  console.log();
}

function help(): void {
  printHeader();
  console.log(`  ${bold("Usage:")}`);
  console.log();
  console.log(`    ${cyan("xplain-like-im-5 install <pack>")}    Install a persona`);
  console.log(`    ${cyan("xplain-like-im-5 install --all")}     Install all personas`);
  console.log(`    ${cyan("xplain-like-im-5 remove <pack>")}     Remove a persona`);
  console.log(`    ${cyan("xplain-like-im-5 reset")}             Remove all personas`);
  console.log(`    ${cyan("xplain-like-im-5 list")}              Show available personas`);
  console.log();
  console.log(`  ${bold("Packs:")} ${PACK_NAMES.join(", ")}`);
  console.log();
  console.log(`  ${bold("After installing:")}`);
  console.log(`    ${cyan("claude --agent xli5-<pack>")}`);
  console.log();
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
      console.error("\n  Usage: xplain-like-im-5 install <pack|--all>\n");
      process.exit(1);
    }
    break;
  case "remove":
    if (args[1]) {
      remove(args[1]);
    } else {
      console.error("\n  Usage: xplain-like-im-5 remove <pack>\n");
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
