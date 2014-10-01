'use strict'

var markdown = require('metalsmith-markdown'),
  sass = require('metalsmith-sass'),
  watch = require('metalsmith-watch'),
  templates = require('metalsmith-templates'),
  serve = require('serve-static'),
  connect = require('connect'),
  ignore = require('metalsmith-ignore'),
  Metalsmith = require('metalsmith');

var dev = false

process.argv.forEach(function(val, index, array) {
  if (val === 'dev') dev = true
})

var metalsmith = Metalsmith(__dirname)
  .use(sass())
  .use(markdown())
  .use(ignore([
    'templates/**/*',
    'lib/**/*',
    'lib/**/.bower.json',
    'sass/**/*'
  ]))
  .use(templates({
    engine: 'handlebars',
    directory: './src/templates',
    partials: {
      head: 'partials/head'      
    }
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
