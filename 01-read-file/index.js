const fs = require('fs'),
      path = require('path');

const stream = fs.createReadStream(path.resolve(__dirname, 'text.txt'), 'utf-8');
stream.on('data', data => console.log(data));
