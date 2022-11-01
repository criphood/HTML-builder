const { stdin, stdout } = process,
      fs = require('fs'),
      path = require('path');

const writeableStream = fs.createWriteStream(path.resolve(__dirname, 'some.txt'), 'utf-8');

stdout.write('Введите любой текст\n');
stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    quit();
  }
  writeableStream.write(data);
});
process.on('SIGINT', quit);

function quit() {
  stdout.write('Удачи!');
  process.exit();
}
