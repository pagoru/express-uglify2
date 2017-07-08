/**
 * Middleware
 *
 * MIT License copyright (c) 2012 Nick Crohn
 *
 */

var winston = require('winston');

module.exports = function(options) {

  var uglify = require("uglify-es"),
      fsys = require("../lib/filesystem.js"),
      url = require("url"),
      src, maxAge = options.maxAge || 86400000; // default to 1 day

  if(options.hasOwnProperty("src")) {
    src = options.src;
  } else {
    throw new Error("ExpressUglify middleware requires a 'src' directory");
  }

  return function(req, res, next) {
    var path = url.parse(req.url).pathname;
    if(path.match(/\.js$/) && !path.match(/min/)) {
      fsys.getFile(src+path,
        function(data, isCached) {

          if(data === null) {
            console.log('"GET ' + path + '" 404');
            res.end("file not found", 404);
          } else {
            if(!isCached) {
              var ast;
              try {
		ast = uglify.parse(data);
		ast.figure_out_scope();
		var compressor = uglify.Compressor();
		ast = ast.transform(compressor);
		ast.figure_out_scope();
		ast.compute_char_frequency();	
		ast.mangle_names();
              } catch (x) {
                console.error(path + ' ' + x);
              }

              if(ast) {
                // Cache the file so we don't have to do it again.
                fsys.writeFile(src+path, ast.print_to_string(),
                  function() {
                    console.log('Cached uglified: '+path);
                  });
                console.log('"GET ' + path + '" 200 - Minified');
                res.setHeader('Content-Type', 'text/javascript');
                res.status(200).send(ast.print_to_string());
              } else {
                console.error('"GET ' + path + '" 200 - Failed to Minify');
                res.setHeader('Content-Type', 'text/javascript');
                res.status(200).send(data);
              }

            } else {
              console.log('"GET ' + path + '" 200 - Cached');
              res.setHeader('Expires', new Date(Date.now() + maxAge).toUTCString());
              res.setHeader('Cache-Control', 'public, max-age=' + (maxAge / 1000));
              res.setHeader('Content-Type', 'text/javascript');
              res.status(200).send(data);
            }
          }

        });
    } else {
      next();
    }

  };

};
