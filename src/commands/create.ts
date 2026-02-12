import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import { runCommand } from "../utils/runCommand";
import { createGitIgnore } from "../utils/gitIgnore";
import TemplatesConfig from "../templatesConfig";

export async function createCommand(
  projectName: string,
  options: { install: boolean; git: boolean; force: boolean },
) {
  console.log(chalk.blue.bold("\nProject Bootstrapper\n"));

  const isCurrentDir = projectName === ".";

  const targetPath = isCurrentDir
    ? process.cwd()
    : path.resolve(process.cwd(), projectName);

  const resolvedProjectName = isCurrentDir
    ? path.basename(process.cwd())
    : projectName;

  // Force logic
  if (!isCurrentDir) {
    if (fs.existsSync(targetPath)) {
      if (!options.force) {
        console.error(
          chalk.red(
            `\nError: directory "${projectName}" already exists. Use --force to overwrite.`,
          ),
        );
        return;
      }

      console.log(
        chalk.yellow(
          `\nOverwriting existing directory "${projectName}" (--force)`,
        ),
      );

      await fs.remove(targetPath);
    }
  } else {
    const files = await fs.readdir(targetPath);

    if (files.length > 0) {
      if (!options.force) {
        console.error(
          chalk.red(
            "\nError: current directory is not empty. Use --force to overwrite.",
          ),
        );
        return;
      }

      console.log(
        chalk.yellow("\nOverwriting current directory contents (--force)"),
      );

      // remove all contents but keep directory
      for (const file of files) {
        await fs.remove(path.join(targetPath, file));
      }
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

  // ---------------- INSTALL PHASE ----------------

  if (options.install) {
    console.log(chalk.yellow("\nInstalling dependencies (npm install)..."));
    console.log(chalk.gray("This may take a few minutes.\n"));

    try {
      await runCommand("npm", ["install"], targetPath);
      console.log(chalk.green("\n✅ Dependencies installed successfully"));
    } catch (error) {
      console.error(chalk.red("\nDependency installation failed"));
      console.error(chalk.red((error as Error).message));
      return;
    }
  } else {
    console.log(
      chalk.yellow("\nSkipping dependency installation (--no-install)"),
    );
  }

  // ---------------- GIT PHASE (AFTER INSTALL) ----------------

  if (options.git) {
    console.log(chalk.yellow("\nInitializing Git repository...\n"));

    try {
      // Always create gitignore before init
      await createGitIgnore(targetPath);

      await runCommand("git", ["init"], targetPath);
      await runCommand("git", ["add", "."], targetPath);
      await runCommand("git", 'git commit -m "Initial commit"', targetPath);

      console.log(chalk.green("✅ Git repository initialized"));
    } catch (error) {
      console.log(
        chalk.gray(
          "Git initialization skipped (git not installed or commit failed)",
        ),
      );
    }
  } else {
    console.log(chalk.yellow("\nSkipping Git initialization (--no-git)"));
  }

  // ---------------- NEXT STEPS ----------------

  console.log(chalk.green("\nNext steps:"));

  if (!isCurrentDir) {
    console.log(chalk.gray(`  cd ./${resolvedProjectName}`));
  }

  TemplatesConfig[projectType].nextSteps.forEach((step) => {
    if (step.command === "npm install" && options.install) return;
    console.log(chalk.gray(`  ${step.command}`));
  });

  console.log(chalk.blue.bold("\n🎉 Happy Coding!\n"));
}
