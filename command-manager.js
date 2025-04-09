const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// ตั้งค่าไฟล์ที่จะเก็บคำสั่ง
const filePath = path.join(__dirname, 'commands.json');

// ฟังก์ชันที่ใช้เก็บคำสั่งใหม่
const saveCommand = async (command, description, tag) => {
  let commands = [];

  // อ่านไฟล์ JSON ที่มีคำสั่งเก่า
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    commands = JSON.parse(data);
  }

  // เพิ่มคำสั่งใหม่
  commands.push({
    command,
    description,
    tag
  });

  // บันทึกลงในไฟล์ JSON
  fs.writeFileSync(filePath, JSON.stringify(commands, null, 2), 'utf-8');
  
  // ใช้ chalk เพื่อเปลี่ยนสีข้อความ
  console.log(chalk.green('Command saved successfully!'));
};

// ฟังก์ชันแสดงคำสั่งทั้งหมด
const listCommands = () => {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const commands = JSON.parse(data);
    console.log(chalk.blue('Your saved commands:')); // ใช้สีฟ้า
    commands.forEach((cmd, index) => {
      console.log(chalk.yellow(`${index + 1}. Command: ${cmd.command}`)); // ใช้สีเหลือง
      console.log(chalk.cyan(`   Description: ${cmd.description}`)); // ใช้สีฟ้าอ่อน
      console.log(chalk.magenta(`   Tag: ${cmd.tag}`)); // ใช้สีม่วง
      console.log('---');
    });
  } else {
    console.log(chalk.red('No commands saved yet.')); // ใช้สีแดง
  }
};

// ฟังก์ชันหลัก (parse argument จาก command line)
const main = () => {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(chalk.white('Usage:'));
    console.log(chalk.white('  add <command> <description> <tag> - Add a new command'));
    console.log(chalk.white('  list - List all commands'));
    return;
  }

  if (args[0] === 'add' && args.length === 4) {
    const [command, description, tag] = args.slice(1);
    saveCommand(command, description, tag);
  } else if (args[0] === 'list') {
    listCommands();
  } else {
    console.log(chalk.red('Invalid command. Use "add" to add a command or "list" to list commands.'));
  }
};

// เรียกใช้ฟังก์ชันหลัก
main();
