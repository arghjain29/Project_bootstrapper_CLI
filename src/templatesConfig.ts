import { generateReactJSProject } from "./generators/react-js";
import { generateNodeJSProject } from "./generators/node-js";
import { generateExpressJSProject } from "./generators/express-js";
import { generateExpressPostgreSQLJSProject } from "./generators/express+postgresql-js";
import { generateExpressMongoDbJSProject } from "./generators/express+mongodb-js";

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
    name: "Node Server (JavaScript)",
    generator: generateNodeJSProject,
    nextSteps: [{ command: "npm install" }, { command: "npm start" }],
  },
  "express-js": {
    value: "express-js",
    name: "Express Server (JavaScript)",
    generator: generateExpressJSProject,
    nextSteps: [{ command: "npm install" }, { command: "npm start" }],
  },
  "express+postgresql-js": {
    value: "express+postgresql-js",
    name: "Express + PostgreSQL (JavaScript)",
    generator: generateExpressPostgreSQLJSProject,
    nextSteps: [{ command: "npm install" }, { command : "cp .env.example .env"}, { command: "npm start" }],
  },
  "express+mongodb-js": {
    value: "express+mongodb-js",
    name: "Express + MongoDB (JavaScript)",
    generator: generateExpressMongoDbJSProject,
    nextSteps: [{ command: "npm install" }, { command : "cp .env.example .env"}, { command: "npm start" }],
  },
};

export default TemplatesConfig;
