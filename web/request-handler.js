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
      // is it in sites.txt
      archive.isUrlInList(urlPath.slice(1), function(found) {
        // if yes
        if (found) {
          httpHelper.sendRedirect(response, '/loading.html');
        } else {
          httpHelper.send404(response);
        }
        // if yes -> loading
        // if no -> 404
      });
    });
  },
  'POST': function(request, response) {
    httpHelper.handlePost(request, function(data) {
      var url = data.url + '\n';
      // in sites.text
      archive.isUrlInList(url, function(found) {
        // if yes
        if (found) {
          // is it archived?
          archive.isUrlArchived(url, function(exists) {
            if (exists) {
              //if yes
              //display page
              httpHelper.sendRedirect(response, '/' + url);
            } else {
              // if no
              // display loading
              httpHelper.sendRedirect(response, '/loading.html');
            }
          });
        } else {
          // if no
          // append to sites.txt  
          archive.addUrlToList(url, function() {
            //console.log(url);
            // display loading
            httpHelper.sendRedirect(response, '/loading.html');
          });
        }
      });
    });
  }
};

// exports.handleRequest = function (req, res) {
//   var pathname = url.parse(req.url).pathname;
//   if(pathname === "/"){
//     pathname = pathname + "index.html";
//   }
//   //handles basic site resources
//   if(pathname === "/index.html" || pathname === "/styles.css"){
//     if(req.method === "GET"){
//       pathname = path.join(__dirname, "./public", pathname);
//       console.log(pathname);
//       httpHelper.serveAssets(res, pathname);
//     }
//   }
//   else{
//     pathname = path.join(__dirname, "../archives/sites", pathname)
//     console.log(pathname);
//     if(req.method === "GET"){
//       httpHelper.serveAssets(res, pathname);
//     }
//   }

// };

