import { Command } from 'commander';
import { addCommand } from './commands/add';
import { initCommand } from './commands/init';
import { listCommand } from './commands/list';

const program = new Command();

program.name('castkit').description('CastKit scaffold CLI');

program.command('init').description('Initialize CastKit in the current app').action(initCommand);

program
  .command('add')
  .description('Add a CastKit component, page, or adapter template')
  .argument('<component>', 'Template name')
  .action(addCommand);

program.command('list').description('List available templates').action(listCommand);

program.parseAsync().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

