import { generateReactJSProject } from "./generators/react-js";
import { generateNodeJSProject } from "./generators/node-js";

type TemplateConfig = {
  value: string;
  name: string;
  generator: (targetPath: string, projectName: string) => Promise<void>;
  nextSteps: { command: string }[];
};

const TemplatesConfig: Record<string, TemplateConfig> = {
  "react-js": {
    value: "react-js",
    name: "React App (JavaScript)",
    generator: generateReactJSProject,
    nextSteps: [{ command: "npm install" }, { command: "npm run dev" }],
  },
  "node-js": {
    value: "node-js",
    name: "Node API (JavaScript)",
    generator: generateNodeJSProject,
    nextSteps: [{ command: "npm install" }, { command: "npm start" }],
  },
};

export default TemplatesConfig;
