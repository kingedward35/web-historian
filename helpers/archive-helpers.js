var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require("http");

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, function(err, data) {
    data = data.toString().split('\n');
    if (callback) {
      callback(data);
    }
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(data) {
    var exists = _.has(data, function(site, i) {
      return data.match(url);
    });
    callback(exists);
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url, function(data) {
    callback(data);
    //console.log('The url: ' + url + ' was appeneded!');
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(exports.paths.archivedSites, function(err, files) {
    var exists = _.contains(files, url);
    callback(exists);
  });
};

exports.downloadUrls = function(url) {
  //var file = 
  fs.createWriteStream(exports.paths.archivedSites + '/' + url[0]);
  fs.createWriteStream(exports.paths.archivedSites + '/' + url[]);
  // var request = http.get('http://' + url, function(response) {
  //     response.pipe(file);
  //     file.on('finish', function() {
  //       file.close(callback); // close() is async, call cb after close completes.
  //     });
  //   });
   //});//.on('error', function(err) {
  //   console.log(err); // Handle errors
  //   fs.unlink(exports.paths.archivedSites); // Delete the file async. (But we don't check the result)
  //   if (callback) {
  //     callback(err.message);
  //   }
  // });
};
