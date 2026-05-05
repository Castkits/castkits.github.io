import path from 'node:path';
import chalk from 'chalk';
import { detect } from 'detect-package-manager';
import fs from 'fs-extra';
import Handlebars from 'handlebars';
import inquirer from 'inquirer';

async function renderTemplate(templatePath: string, outputPath: string, data: Record<string, unknown>) {
  const template = await fs.readFile(templatePath, 'utf8');
  const compiled = Handlebars.compile(template);
  await fs.outputFile(outputPath, compiled(data));
}

/**
 * Bootstraps a host app with the minimum CastKit integration files.
 */
export async function initCommand() {
  const cwd = process.cwd();
  const packageManager = await detect({ cwd }).catch(() => 'pnpm');
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'framework',
      message: 'Hangi framework kullanıyorsun?',
      choices: ['Next.js', 'Vite', 'CRA'],
      default: 'Next.js',
    },
    {
      type: 'list',
      name: 'adapter',
      message: 'Hangi adapter?',
      choices: ['Wagmi', 'Ethers.js'],
      default: 'Wagmi',
    },
    {
      type: 'list',
      name: 'hasTailwind',
      message: 'Tailwind kurulu mu?',
      choices: ['Evet', 'Hayır - ben kurayım'],
      default: 'Evet',
    },
  ]);

  const templatesDir = path.resolve(__dirname, '../templates');
  const providerOutput = path.join(cwd, 'src/providers/Web3Provider.tsx');
  const envOutput = path.join(cwd, '.env.example');

  await renderTemplate(path.join(templatesDir, 'providers/Web3Provider.tsx.hbs'), providerOutput, {
    adapter: answers.adapter,
    isWagmi: answers.adapter === 'Wagmi',
  });

  await fs.outputFile(
    envOutput,
    ['NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=', 'NEXT_PUBLIC_RPC_URL='].join('\n'),
  );

  const tailwindConfigPath = path.join(cwd, 'tailwind.config.ts');
  if (answers.hasTailwind === 'Hayır - ben kurayım' && !(await fs.pathExists(tailwindConfigPath))) {
    await fs.outputFile(
      tailwindConfigPath,
      `import type { Config } from 'tailwindcss'\nimport { castkitTailwindPreset } from '@castkit/ui'\n\nexport default {\n  presets: [castkitTailwindPreset],\n  content: ['./src/**/*.{ts,tsx}'],\n} satisfies Config\n`,
    );
  }

  console.log(chalk.green(`✓ @castkit/ui hazır (${packageManager})`));
  console.log(chalk.green(`✓ ${providerOutput} oluşturuldu`));
  console.log(chalk.green(`✓ ${envOutput} oluşturuldu`));
  console.log(chalk.cyan('Hazır! Sonraki adım: npx castkit add MintPanel'));
}
