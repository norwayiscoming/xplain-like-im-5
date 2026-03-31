import { defineConfig } from "tsup";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

export default defineConfig({
  entry: ["src/cli.ts"],
  format: ["esm"],
  target: "es2022",
  platform: "node",
  clean: true,
  banner: {
    js: "#!/usr/bin/env node",
  },
  define: (() => {
    const packsDir = join("src", "packs");
    const packs: Record<string, string> = {};
    for (const file of readdirSync(packsDir)) {
      if (file.endsWith(".md")) {
        const name = file.replace(".md", "");
        packs[name] = readFileSync(join(packsDir, file), "utf-8");
      }
    }
    return {
      PACKS_JSON: JSON.stringify(JSON.stringify(packs)),
    };
  })(),
});
