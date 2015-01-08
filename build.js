'use strict'

var Metalsmith = require('metalsmith');
var sass = require('metalsmith-sass');
var watch = require('metalsmith-watch');
var templates = require('metalsmith-templates');
var permalinks = require('metalsmith-permalinks');
var ignore = require('metalsmith-ignore');
var metadata = require('metalsmith-metadata');
var autoprefixer = require('metalsmith-autoprefixer');
var serve = require('serve-static');
var connect = require('connect');

var dev = false

process.argv.forEach(function(val, index, array) {
  if (val === 'dev') dev = true
})

var metalsmith = Metalsmith(__dirname)
  .use(sass())
  .use(autoprefixer())
  .use(metadata({
    designers: 'data/designers.json',
    resources: 'data/resources.json'
  }))
  .use(ignore([
    'templates/**/*',
    'data/*',
    'sass/**/*'
  ]))
  .use(templates({
    engine: 'hogan',
    directory: './src/templates',
    partials: {
      head: 'partials/head',
      header: 'partials/header', 
      footer: 'partials/footer', 
      designers: 'partials/designers',
      resources: 'partials/resources'
    }
  }))
  .use(permalinks({
    pattern: ':title',
    relative: false
  }))

if (dev) {
  metalsmith
    .use(watch())
}

metalsmith
  .build(function(err){
    if (err) throw err
  })

if (dev) {
  var app = connect()
  app.use(serve(__dirname + '/build'));
  app.listen(8000, function() {
    console.log('Server running on port 8000')
  });
}
