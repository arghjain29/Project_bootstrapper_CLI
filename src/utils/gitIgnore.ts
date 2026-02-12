import fs from "fs-extra";
import path from "path";

export async function createGitIgnore(targetPath: string) {
  const content = `
# dependencies
node_modules/

# production build
dist/
build/

# environment
.env
.env.local

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
`;

  const filePath = path.join(targetPath, ".gitignore");
  await fs.writeFile(filePath, content.trimStart());
}
