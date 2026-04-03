#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { resolve, join } from "node:path";

const VERSION = "0.1.0";
const PURPLE = "\x1b[35m";
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";

function log(msg: string) {
  console.log(`${PURPLE}▸${RESET} ${msg}`);
}

function banner() {
  console.log(`
${PURPLE}${BOLD}  ██████╗  ██████╗ ██████╗ ███████╗
  ██╔══██╗██╔═══██╗██╔══██╗██╔════╝
  ██║  ██║██║   ██║██████╔╝███████╗
  ██║  ██║██║   ██║██╔══██╗╚════██║
  ██████╔╝╚██████╔╝██║  ██║███████║
  ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝${RESET}
  ${DIM}v${VERSION} — Open-source AGI framework${RESET}
`);
}

const DEFAULT_SOUL = `# SOUL.md — My Agent

You are a helpful AI assistant.

## Identity

- Friendly and direct
- Helpful without being verbose
- Honest about uncertainty

## Communication

- Clear, concise responses
- Use structure when it helps (lists, headers)
- Lead with the answer, then explain

## Boundaries

- Never fabricate data
- Ask for clarification when needed
- Respect user privacy
`;

const commands: Record<string, (args: string[]) => void> = {
  init(args) {
    const name = args[0] || "my-agent";
    const dir = resolve(process.cwd(), name);

    if (existsSync(dir)) {
      console.error(`Error: directory "${name}" already exists.`);
      process.exit(1);
    }

    banner();
    log(`Creating agent: ${BOLD}${name}${RESET}`);

    mkdirSync(dir, { recursive: true });
    mkdirSync(join(dir, "personas"), { recursive: true });

    writeFileSync(
      join(dir, "personas", `${name}.soul.md`),
      DEFAULT_SOUL.replace("My Agent", name)
    );

    writeFileSync(
      join(dir, "dors.config.json"),
      JSON.stringify(
        {
          name,
          version: "0.1.0",
          persona: `personas/${name}.soul.md`,
          llm: {
            provider: "ollama",
            model: "qwen3.5:4b",
            fallback: { provider: "anthropic", model: "claude-sonnet-4-20250514" },
          },
          storage: { driver: "sqlite", path: "./data/agent.db" },
          safety: { level: "standard", threeLaws: true },
          plugins: [],
        },
        null,
        2
      )
    );

    writeFileSync(
      join(dir, ".gitignore"),
      "node_modules/\ndata/\n.env\n.env.local\n"
    );

    log(`Created ${BOLD}personas/${name}.soul.md${RESET}`);
    log(`Created ${BOLD}dors.config.json${RESET}`);
    log("");
    log(`Next steps:`);
    log(`  cd ${name}`);
    log(`  npx dors run`);
    log("");
  },

  run(_args) {
    banner();
    const configPath = resolve(process.cwd(), "dors.config.json");

    if (!existsSync(configPath)) {
      console.error(
        "Error: no dors.config.json found. Run `npx dors init <name>` first."
      );
      process.exit(1);
    }

    const config = JSON.parse(readFileSync(configPath, "utf-8"));
    log(`Agent: ${BOLD}${config.name}${RESET}`);
    log(`LLM: ${config.llm.provider}/${config.llm.model}`);
    log(`Safety: Three Laws ${config.safety.threeLaws ? "enabled" : "disabled"}`);
    log(`Storage: ${config.storage.driver} → ${config.storage.path}`);
    log("");
    log(`${DIM}Agent runtime not yet implemented. Coming in v0.2.0.${RESET}`);
  },

  config(_args) {
    const configPath = resolve(process.cwd(), "dors.config.json");

    if (!existsSync(configPath)) {
      console.error("Error: no dors.config.json found.");
      process.exit(1);
    }

    const config = JSON.parse(readFileSync(configPath, "utf-8"));
    console.log(JSON.stringify(config, null, 2));
  },

  version() {
    console.log(`dors v${VERSION}`);
  },

  help() {
    banner();
    console.log(`${BOLD}Usage:${RESET} dors <command> [options]

${BOLD}Commands:${RESET}
  init <name>    Create a new DORS agent
  run            Start the agent runtime
  config         Show current configuration
  version        Show version
  help           Show this help message

${BOLD}Examples:${RESET}
  npx dors init my-agent
  npx dors run
  npx dors config

${DIM}Docs: https://dors.multivac.studio${RESET}
`);
  },
};

const [cmd = "help", ...args] = process.argv.slice(2);
const handler = commands[cmd] || commands.help;
handler(args);
