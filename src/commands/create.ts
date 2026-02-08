import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
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

  if (!isCurrentDir && fs.existsSync(targetPath)) {
    console.log(
      chalk.red(`\nError: directory "${projectName}" already exists.`),
    );
    process.exit(1);
  }

  if (isCurrentDir) {
    const files = await fs.readdir(targetPath);
    if (files.length > 0) {
      console.log(chalk.red("\nError: current directory is not empty."));
      process.exit(1);
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

  const spinner = ora("Creating project...").start();

  if (!isCurrentDir) {
    await fs.mkdir(targetPath);
  }

  const template = TemplatesConfig[projectType];
  if (!template) {
    spinner.fail("Invalid project type selected");
    process.exit(1);
  }

  await template.generator(targetPath, resolvedProjectName);
  spinner.succeed("\nProject created successfully");

  console.log(chalk.green("Next steps:"));
  if (!isCurrentDir) {
    console.log(chalk.gray(`  cd ${resolvedProjectName}`));
  }

  const nextSteps = template.nextSteps;
  nextSteps.forEach((step) => {
    console.log(chalk.gray(`  ${step.command}`));
  });
}
