var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var httpHelper = require('./http-helpers.js');
// require more modules/folders here!

exports.handleRequest = function(request, response) {
  var action = actions[request.method];
  if (action) {
    action(request, response);
  } else {
    httpHelper.sendResponse(response, 'Not Found', 404);
  }
};

var actions = {
  'GET': function(request, response) {
    var parts = url.parse(request.url);
    var urlPath = parts.pathname === '/' ? '/index.html' : parts.pathname;
    httpHelper.serveAssets(response, urlPath, function() {
      archive.isUrlInList(urlPath.slice(1), function(found) {
        if (found) {
          httpHelper.sendRedirect(response, '/loading.html');
        } else {
          httpHelper.send404(response);
        }
      });
    });
  },
  'POST': function(request, response) {
    httpHelper.handlePost(request, function(data) {
      var url = data.url + '\n';
      archive.isUrlInList(url, function(found) {
        if (found) {
          archive.isUrlArchived(url, function(exists) {
            if (exists) {
              httpHelper.sendRedirect(response, '/' + url);
            } else {
              httpHelper.sendRedirect(response, '/loading.html');
            }
          });
        } else {
          archive.addUrlToList(url, function() {
            httpHelper.sendRedirect(response, '/loading.html');
          });
        }
      });
    });
  }
};


