import fs from "fs-extra";
import path from "path";

export async function generateExpressJSProject(
  targetPath: string,
  projectName: string
) {
  const templatePath = path.resolve(
    __dirname,
    "../../templates/express-js"
  );

  await fs.copy(templatePath, targetPath);

  const pkgPath = path.join(targetPath, "package.json");
  const pkgContent = await fs.readFile(pkgPath, "utf-8");

  const updatedPkg = pkgContent.replace(
    "{{projectName}}",
    projectName
  );

  await fs.writeFile(pkgPath, updatedPkg, "utf-8");
}
