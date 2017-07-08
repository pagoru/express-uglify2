# Express Uglify JS 2 #

## Notice ##
~~With the release of Node 0.8.0 in the 0.3.0 release of express-uglify support has been dropped for Node 0.4.x and below. If you are still using Node 0.4.x please continue to use 0.2.x and below of express-uglify.~~
This packages supports ECMA 2016 with the last uglify-js version. :D

## About ##
This package is designed to provide a middleware solution for on the fly compression of JavaScript files. Code for embedding stays identical so switching between development and production states is as simple as changing the config for express.

### What it does ###
The Express Uglify middleware intercepts JS file calls and runs them through the [UglifyJS](https://github.com/pagoru/UglifyJS2) package to compress and cache the files. If the file has been previously cached it just access that file on disk in a .cache directory and serves that file. All cached files are stored as xxxxx.ugly.js where xxxxx is the starting point. i.e. jquery-1.6.2.js -> jquery-1.6.2.ugly.js

## To Do ##
~~- Use [ConnectJS](http://www.senchalabs.org/connect/) caching API to provide proper headers~~
~~- Comprehensive unit tests~~

## Usage:

    var expressUglify = require('express-uglify');
    app.use(expressUglify.middleware({ 
      src: __dirname + '/public'
    }));

### MIT LICENSE


