import path from 'node:path';
import chalk from 'chalk';
import fs from 'fs-extra';
import Handlebars from 'handlebars';

const registry = {
  MintPanel: {
    template: 'components/MintPanel.tsx.hbs',
    output: 'src/components/MintPanel.tsx',
    description: 'Mint panel component scaffold',
  },
  'mint-page': {
    template: 'pages/mint.tsx.hbs',
    output: 'src/pages/mint.tsx',
    description: 'Ready-to-use mint page',
  },
  'custom-adapter': {
    template: 'adapters/CustomAdapter.ts.hbs',
    output: 'src/adapters/MyAdapter.ts',
    description: 'Custom adapter boilerplate',
  },
  'staking-page': {
    template: 'pages/staking.tsx.hbs',
    output: 'src/pages/staking.tsx',
    description: 'Simple staking page',
  },
} as const;

/**
 * Adds a component or page template to the current host app.
 */
export async function addCommand(component: keyof typeof registry) {
  const entry = registry[component];

  if (!entry) {
    throw new Error(`Unknown CastKit scaffold: ${component}`);
  }

  const cwd = process.cwd();
  const templatePath = path.resolve(__dirname, `../templates/${entry.template}`);
  const outputPath = path.join(cwd, entry.output);

  if (await fs.pathExists(outputPath)) {
    throw new Error(`Target already exists: ${outputPath}`);
  }

  const template = await fs.readFile(templatePath, 'utf8');
  const compiled = Handlebars.compile(template);
  await fs.outputFile(outputPath, compiled({}));

  console.log(chalk.green(`✓ ${entry.description}`));
  console.log(chalk.cyan(`→ ${outputPath}`));
}

export const addRegistry = registry;

