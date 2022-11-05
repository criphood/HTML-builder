const fs = require('fs'),
  path = require('path');

const src = path.resolve(__dirname),
  dist = path.resolve(__dirname) + '/project-dist';

let arr = [], template;

makeDir(dist);


fs.readFile(src + '/template.html', 'utf-8', (err, data) => {
  if (err) throw err;
  template = data;
  fs.promises.readdir(dist)
    .then(
      files => {
        files.forEach(file => {
          if (file === 'index.html') {
            fs.unlink(
              dist + '/index.html',
              err => { if (err) throw err; }
            );
          }
        });
      }
    )
    .then(
      fs.promises.readdir(src + '/components')
        .then(
          files => {
            files.forEach((file, i) => {
              const tag = `{{${file.split('.')[0]}}}`;
              const filePath = src + '/components/' + file;
              const stream = fs.createReadStream(filePath, 'utf-8');
              arr.push(tag);

              stream.on('data', data => {
                for (const item of arr) {
                  if (item === tag) {
                    template = template.replace(item, data);
                  }
                }
                if (i === files.length - 1) {
                  fs.promises.appendFile(dist + '/index.html', template);
                }
              });
            });
          }
        )
    )
    .then(
      fs.promises.readdir(dist)
        .then(
          files => {
            files.forEach(file => {
              if (file === 'style.css') {
                fs.unlink(
                  dist + '/style.css',
                  err => { if (err) throw err; }
                );
              }
            });
          }
        )
        .then(
          fs.promises.readdir(src + '/styles')
            .then(
              files => {
                files.forEach(file => {
                  const filePath = src + '/styles/' + file;
                  fs.stat(filePath, (err, stats) => {
                    if (stats.isFile() && file.split('.')[1] === 'css') {
                      const stream = fs.createReadStream(filePath, 'utf-8');

                      stream.on('data', data => {
                        fs.promises.appendFile(dist + '/style.css', data);
                      });
                    };
                  });
                });
              }
            )
        )
    )
    .then(
      makeDir(dist + '/assets')
    )
    .then(
      makeDir(dist + '/assets' + '/fonts')
    )
    .then(
      makeDir(dist + '/assets' + '/img')
    )
    .then(
      makeDir(dist + '/assets' + '/svg')
    )
    .then(
      unlink(dist + '/assets/fonts/')
    )
    .then(
      unlink(dist + '/assets/img/')
    )
    .then(
      unlink(dist + '/assets/svg/')
    )
    .then(
      copyFile('/fonts')
    )
    .then(
      copyFile('/img')
    )
    .then(
      copyFile('/svg')
    )
})

function unlink(directory) {
  fs.promises.readdir(directory)
    .then(
      files => {
        files.forEach(file => {
          fs.unlink(
            directory + file,
            err => { if (err) throw err; });
        });
      }
    )
}

function copyFile(asset) {
  fs.promises.readdir(src + '/assets/' + asset)
    .then(
      files => {
        files.forEach(file => {
          fs.copyFile(
            src + '/assets/' + `${asset}/` + file,
            dist + '/assets/' + `${asset}/` + file,
            err => { if (err) throw err; });
        });
      }
    )
}

function makeDir(directory) {
  fs.mkdir(directory, { recursive: true }, (err) => {
    if (err) throw err;
  });
}








