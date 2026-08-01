#!/usr/bin/env node
// Links this repo's skills into an agent runtime's skills directory.
// Symlinks by default, so `git pull` updates every runtime at once.
//
//   node install.mjs                 # installs to every detected runtime
//   node install.mjs --target claude # one runtime
//   node install.mjs --dir ~/foo     # explicit directory
//   node install.mjs --copy          # copy instead of symlink
//   node install.mjs --dry-run       # show what would happen
//   node install.mjs --list          # show known runtimes and their paths

import { existsSync, mkdirSync, readdirSync, rmSync, cpSync, symlinkSync, lstatSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = dirname(fileURLToPath(import.meta.url));
const SKILLS = join(REPO, "skills");

// Runtime skill directories. These move as tools evolve — edit freely,
// or bypass the map entirely with --dir.
const TARGETS = {
  claude: "~/.claude/skills",
  codex: "~/.codex/skills",
  gemini: "~/.gemini/skills",
  opencode: "~/.config/opencode/skill",
  copilot: "~/.config/copilot/skills",
};

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? null : args[i + 1] ?? true;
};
const has = (name) => args.includes(`--${name}`);
const expand = (p) => (p.startsWith("~") ? join(homedir(), p.slice(1)) : resolve(p));

// existsSync follows symlinks, so a broken link reads as absent. Catch those too.
const isLink = (p) => {
  try {
    return lstatSync(p).isSymbolicLink();
  } catch {
    return false;
  }
};

if (has("list")) {
  console.log("Known runtimes:\n");
  for (const [name, path] of Object.entries(TARGETS)) {
    const found = existsSync(dirname(expand(path)));
    console.log(`  ${name.padEnd(10)} ${path}${found ? "" : "   (parent not found)"}`);
  }
  console.log("\nAnything else: --dir <path>");
  process.exit(0);
}

// Every skill folder across pipeline/, craft/, meta/.
const skills = readdirSync(SKILLS, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .flatMap((group) =>
    readdirSync(join(SKILLS, group.name), { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((skill) => ({ name: skill.name, from: join(SKILLS, group.name, skill.name) })),
  );

if (skills.length === 0) {
  console.error("No skills found under ./skills — is this the repo root?");
  process.exit(1);
}

// Resolve which directories to install into.
const dirs = [];
const explicitDir = flag("dir");
const target = flag("target");

if (explicitDir && explicitDir !== true) {
  dirs.push({ name: "custom", path: expand(explicitDir) });
} else if (target && target !== true) {
  if (!TARGETS[target]) {
    console.error(`Unknown runtime "${target}". Known: ${Object.keys(TARGETS).join(", ")}`);
    process.exit(1);
  }
  dirs.push({ name: target, path: expand(TARGETS[target]) });
} else {
  // Auto-detect: install where the runtime's config directory already exists.
  for (const [name, path] of Object.entries(TARGETS)) {
    const full = expand(path);
    if (existsSync(dirname(full))) dirs.push({ name, path: full });
  }
  if (dirs.length === 0) {
    console.error("No runtimes detected. Use --target <name> or --dir <path>. See --list.");
    process.exit(1);
  }
}

const dryRun = has("dry-run");
const copy = has("copy");

for (const { name, path } of dirs) {
  console.log(`\n${name} → ${path}`);
  if (!dryRun) mkdirSync(path, { recursive: true });

  for (const skill of skills) {
    const dest = join(path, skill.name);
    const occupied = existsSync(dest) || isLink(dest);
    const action = occupied ? "replace" : "install";

    if (!dryRun) {
      // Only ever removes a path about to be replaced by the same-named skill.
      if (occupied) rmSync(dest, { recursive: true, force: true });
      if (copy) cpSync(skill.from, dest, { recursive: true });
      else symlinkSync(skill.from, dest, "dir");
    }

    console.log(`  ${action.padEnd(8)} ${skill.name}`);
  }
}

console.log(
  `\n${dryRun ? "Would install" : "Installed"} ${skills.length} skills to ${dirs.length} runtime(s)` +
    (copy ? " (copied)" : " (symlinked — git pull updates them all)"),
);
