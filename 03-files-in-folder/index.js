const { stdout } = process,
  fs = require('fs'),
  path = require('path');

const direct = path.resolve(__dirname, 'secret-folder');

fs.readdir(direct, (err, files) => {
  files.forEach(file => {
    const filePath = direct + '/' + file;

    fs.stat(filePath, (err, stats) => {
      if (stats.isFile()) {
        const fileInfo = file.split('.');
        const size = (stats['size'] / 1024).toFixed(3) + 'kb';
        fileInfo.push(size);
        stdout.write(`${ fileInfo.join(' - ') }\n`);
      }
    });
  });
});

