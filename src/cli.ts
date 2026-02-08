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
  .action((projectName: string) => {
    createCommand(projectName);
  });

program.parse(process.argv);
