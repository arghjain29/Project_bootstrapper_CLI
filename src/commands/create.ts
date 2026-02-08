import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import { runCommand } from "../utils/runCommand";
import TemplatesConfig from "../templatesConfig";

export async function createCommand(projectName: string) {
  console.log(chalk.blue.bold("\nProject Bootstrapper\n"));

  const isCurrentDir = projectName === ".";

  const targetPath = isCurrentDir
    ? process.cwd()
    : path.resolve(process.cwd(), projectName);

  const resolvedProjectName = isCurrentDir
    ? path.basename(process.cwd())
    : projectName;

  // ❌ DO NOT use process.exit
  if (!isCurrentDir && fs.existsSync(targetPath)) {
    console.error(
      chalk.red(`\nError: directory "${projectName}" already exists.`),
    );
    return;
  }

  if (isCurrentDir) {
    const files = await fs.readdir(targetPath);
    if (files.length > 0) {
      console.error(chalk.red("\nError: current directory is not empty."));
      return;
    }
  }

  const { projectType } = await inquirer.prompt([
    {
      type: "list",
      name: "projectType",
      message: chalk.bold("Select project type"),
      choices: Object.values(TemplatesConfig).map((template) => ({
        name: template.name,
        value: template.value,
      })),
    },
  ]);

  const createSpinner = ora("Creating project...").start();

  try {
    if (!isCurrentDir) {
      await fs.mkdir(targetPath);
    }

    const template = TemplatesConfig[projectType];
    if (!template) {
      throw new Error("Invalid project type selected");
    }

    await template.generator(targetPath, resolvedProjectName);

    createSpinner.succeed("Project created successfully");
  } catch (error) {
    createSpinner.fail("Project creation failed");
    console.error(chalk.red((error as Error).message));
    return;
  }

  // ---- INSTALL PHASE (separate spinner) ----

  console.log(chalk.yellow("\nInstalling dependencies (npm install)..."));
  console.log(chalk.gray("This may take a few minutes.\n"));

  try {
    await runCommand("npm", ["install"], targetPath);
    console.log(chalk.green("\nDependencies installed successfully"));
  } catch (error) {
    console.error(chalk.red("\nDependency installation failed"));
    console.error(chalk.red((error as Error).message));
    return;
  }

  console.log(chalk.green("\nNext steps:"));

  if (!isCurrentDir) {
    console.log(chalk.gray(`  cd ${resolvedProjectName}`));
  }

  TemplatesConfig[projectType].nextSteps.forEach((step) => {
    console.log(chalk.gray(`  ${step.command}`));
  });

  console.log(chalk.blue.bold("\nHappy Coding!\n"));
}
