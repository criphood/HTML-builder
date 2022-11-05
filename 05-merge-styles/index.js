const fs = require('fs'),
  promises = fs.promises,
  path = require('path');

const src = path.resolve(__dirname, 'styles'),
  dist = path.resolve(__dirname) + '/project-dist';

promises
  .readdir(dist)
  .then(
    files => {
      files.forEach(file => {
        if (file === 'bundle.css') {
          fs.unlink(
            dist + '/bundle.css',
            err => { if (err) throw err; }
          );
        }
      });
    })
  .then(
      promises.readdir(src)
              .then(
                files => {
                  files.forEach(file => {
                    const filePath = src + '/' + file;

                    fs.stat(filePath, (err, stats) => {
                      if (stats.isFile() && file.split('.')[1] === 'css') {
                        const stream = fs.createReadStream(filePath, 'utf-8');

                        stream.on('data', data => {
                          promises.appendFile(dist + '/bundle.css', data);
                        });
                      };
                    });
                  });
                }
              )
  )