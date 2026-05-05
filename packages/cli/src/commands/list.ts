import chalk from 'chalk';
import { addRegistry } from './add';

/**
 * Prints the scaffold catalog for addable components and pages.
 */
export function listCommand() {
  console.log(chalk.bold('CastKit registry'));

  for (const [name, entry] of Object.entries(addRegistry)) {
    console.log(`${chalk.cyan(name)}  ${entry.description}`);
  }
}

