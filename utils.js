

var Promise = require('bluebird');
var fs = require('fs');
var os = require('os');
var path = require('path');
var mkdirp = require('mkdirp');

var preDownloadedDir = path.join(__dirname, './predownload');

function Exports(){};

Exports.prototype.readFile = function (username, fileName) {
  var predownloadPromise = new Promise(function(resolve, reject) {
    var predownloadFileName = path.join(preDownloadedDir, username, fileName);
    fs.readFile(predownloadFileName, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
  var cachedPromise = new Promise(function(resolve, reject) {
    var cacheDir = path.join(os.tmpdir(), programTempDir, username);
    var cachedFileName = path.join(cacheDir, fileName);
    fs.readFile(cachedFileName, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
  return Promise.any([predownloadPromise, cachedPromise]);
}

Exports.prototype.logDataToTemp = function (data, username, fileName) {
  var tempPath = path.join(os.tmpdir(), programTempDir, username);
  var filePath = path.join(tempPath, fileName);
  try {
    mkdirp.sync(tempPath);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
  } catch (error) {
    console.log('could not write data');
    console.log(error);
  }
}

Exports.prototype.makeErrorMessage = function (err) {
  if (err.statusCode === 401) {
    // can't send error status because it breaks promise, so JSON instead
    return {
      error: true,
      status: err.statusCode,
      statusText: 'User\'s data is private'
    };
  } else if (err.statusCode === 429) {
    // can't send error status because it breaks promise, so JSON instead
    return {
      error: true,
      status: err.statusCode,
      statusText: 'Rate limited'
    };
  }
  // unknown error
  return {
    error: true,
    status: err.statusCode,
    statusText: 'Other error'
  };
}

module.exports = new Exports();
