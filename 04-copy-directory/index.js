const fs = require('fs'),
      promises = fs.promises,
      path = require('path');

const src = path.resolve(__dirname, 'files'),
      dist = path.resolve(__dirname) + '/files-copy';

fs.mkdir(dist, {recursive: true}, (err) => {
  if (err) throw err;
});

promises
  .readdir(dist)
  .then(
    files => {
      files.forEach(file => {
        fs.unlink(
          dist + '/' + file,
          err => { if (err) throw err; });
      });
  })
  .then(
    promises.readdir(src)
    .then(
      files => {
        files.forEach(file => {
          fs.copyFile(
            src + '/' + file,
            dist + '/' + file,
            err => { if (err) throw err }
          );
        })
      }
    )
  )
