const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const filePath = path.join(__dirname, 'commands.json');
const prompt = inquirer.createPromptModule();

const saveCommand = async (commands) => {
  fs.writeFileSync(filePath, JSON.stringify(commands, null, 2), 'utf-8');
  console.log(chalk.green('Command(s) saved successfully!'));
};

const promptUser = async () => {
  const answers = await prompt([
    {
      type: 'input',
      name: 'command',
      message: chalk.yellow('Enter the command:')
    },
    {
      type: 'input',
      name: 'description',
      message: chalk.yellow('Enter a description:')
    },
    {
      type: 'input',
      name: 'tag',
      message: chalk.yellow('Enter a tag (optional):')
    }
  ]);

  let commands = [];
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    commands = JSON.parse(data);
  }

  commands.push({
    command: answers.command,
    description: answers.description,
    tag: answers.tag
  });

  await saveCommand(commands);
};

const listCommands = () => {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const commands = JSON.parse(data);
    console.log(chalk.blue('Your saved commands:'));
    commands.forEach((cmd, index) => {
      console.log(chalk.yellow(`${index + 1}. Command: ${cmd.command}`));
      console.log(chalk.cyan(`   Description: ${cmd.description}`));
      console.log(chalk.magenta(`   Tag: ${cmd.tag || 'No tag'}`));
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
    const filteredCommands = commands.filter(cmd => cmd.tag && cmd.tag.toLowerCase() === tag.toLowerCase());

    if (filteredCommands.length > 0) {
      console.log(`Commands with tag "${tag}":`);
      filteredCommands.forEach((cmd, index) => {
        console.log(chalk.yellow(`${index + 1}. Command: ${cmd.command}`));
        console.log(chalk.cyan(`   Description: ${cmd.description}`));
        console.log(chalk.magenta(`   Tag: ${cmd.tag}`));
        console.log('---');
      });
    } else {
      console.log(`No commands found with tag "${tag}".`);
    }
  } else {
    console.log(chalk.red('No commands saved yet.'));
  }
};

const editCommand = async () => {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    let commands = JSON.parse(data);

    // ให้ผู้ใช้เลือกคำสั่งที่ต้องการแก้ไข
    const { index } = await prompt([
      {
        type: 'list',
        name: 'index',
        message: chalk.yellow('Select the command to edit:'),
        choices: commands.map((cmd, idx) => ({
          name: `${cmd.command} - ${cmd.description} (${cmd.tag || 'No tag'})`,
          value: idx
        }))
      }
    ]);

    const { command, description, tag } = await prompt([
      {
        type: 'input',
        name: 'command',
        message: chalk.yellow('Enter the new command:'),
        default: commands[index].command
      },
      {
        type: 'input',
        name: 'description',
        message: chalk.yellow('Enter the new description:'),
        default: commands[index].description
      },
      {
        type: 'input',
        name: 'tag',
        message: chalk.yellow('Enter the new tag (optional):'),
        default: commands[index].tag
      }
    ]);

    // แก้ไขคำสั่งที่เลือก
    commands[index] = { command, description, tag };

    // บันทึกคำสั่งที่แก้ไข
    await saveCommand(commands);
  } else {
    console.log(chalk.red('No commands saved yet.'));
  }
};

const main = async () => {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(chalk.white('Usage:'));
    console.log(chalk.white('  add - Add a new command'));
    console.log(chalk.white('  list - List all commands'));
    console.log(chalk.white('  search <tag> - Search commands by tag'));
    console.log(chalk.white('  edit - Edit an existing command'));
    console.log(chalk.white('  version'));
    return;
  }

  if (args[0] === 'add') {
    try {
      await promptUser();
    } catch (error) {
      console.error(chalk.red('closed script'));
    }
  } else if (args[0] === 'list') {
    try {
      listCommands();
    } catch (error) {
      console.error(chalk.red('closed script'));
    }
  } else if (args[0] === 'search' && args.length === 2) {
    const tag = args[1];
    searchByTag(tag);
  } else if (args[0] === 'edit') {
    try {
      await editCommand();
    } catch (error) {
      console.error(chalk.red('closed script'));
    }
  } else if (args[0] === 'version') {
    console.log('version 0.0.1');
  } else {
    console.log(chalk.red('Invalid command. Use "add" to add a command or "list" to list commands.'));
  }
};

main();
