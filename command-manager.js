const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const filePath = path.join(__dirname, 'commands.json');

const saveCommand = async (command, description, tag) => {
  let commands = [];

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    commands = JSON.parse(data);
  }

  commands.push({
    command,
    description,
    tag
  });

  fs.writeFileSync(filePath, JSON.stringify(commands, null, 2), 'utf-8');
  console.log(chalk.green('Command saved successfully!'));
};

const listCommands = () => {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const commands = JSON.parse(data);
    console.log(chalk.blue('Your saved commands:'));
    commands.forEach((cmd, index) => {
      console.log(chalk.yellow(`${index + 1}. Command: ${cmd.command}`));
      console.log(chalk.cyan(`   Description: ${cmd.description}`));
      console.log(chalk.magenta(`   Tag: ${cmd.tag}`));
      console.log('---');
    });
  } else {
    console.log(chalk.red('No commands saved yet.'));
  }
};

const searchByTag = (tag) => {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const commands = JSON.parse(data);
    const filteredCommands = commands.filter(cmd => cmd.tag.toLowerCase() === tag.toLowerCase());

    if (filteredCommands.length > 0) {
      console.log(`Commands with tag "${tag}":`);
      filteredCommands.forEach((cmd, index) => {
        console.log(`${index + 1}. Command: ${cmd.command}`);
        console.log(`   Description: ${cmd.description}`);
        console.log(`   Tag: ${cmd.tag}`);
        console.log('---');
      });
    } else {
      console.log(`No commands found with tag "${tag}".`);
    }
  } else {
    console.log('No commands saved yet.');
  }
};

const main = () => {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(chalk.white('Usage:'));
    console.log(chalk.white('  add <command> <description> <tag> - Add a new command'));
    console.log(chalk.white('  list - List all commands'));
    console.log(chalk.white('  search <tag> - Search commands by tag'));
    console.log(chalk.white('  version'));
    return;
  }

  if (args[0] === 'add' && args.length === 4) {
    const [command, description, tag] = args.slice(1);
    saveCommand(command, description, tag);
  }
  else if (args[0] === 'list') {
    listCommands();
  }
  else if (args[0] === 'search' && args.length === 2) {
    const tag = args[1];
    searchByTag(tag);
  }
  else if (args[0] === 'version') {
    console.log('version 0.0.1');
    
  }
  else {
    console.log(chalk.red('Invalid command. Use "add" to add a command or "list" to list commands.'));
  }
};

main();
