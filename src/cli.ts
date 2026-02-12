#!/usr/bin/env node

import { Command } from "commander";
import { createCommand } from "./commands/create";

const program = new Command();

program
  .name("bootstrap")
  .description("Project Bootstrapper CLI")
  .version("1.0.0");

program
  .command("create <project-name>")
  .description("Create a new project")
  .option("--no-install", "Skip dependency installation")
  .option("--no-git", "Skip git initialization")
  .option("--force", "Overwrite existing directory")
  .action((projectName: string, options: { install: boolean; git: boolean; force: boolean }) => {
    createCommand(projectName, options);
  });

program.parse(process.argv);

process.on("SIGINT", () => {
  console.log("\nAborted by user.");
  process.exit(0);
});
