'use strict'

var  Metalsmith = require('metalsmith'),
  sass = require('metalsmith-sass'),
  watch = require('metalsmith-watch'),
  templates = require('metalsmith-templates'),
  permalinks = require('metalsmith-permalinks'),
  ignore = require('metalsmith-ignore'),
  metadata = require('metalsmith-metadata'),
  serve = require('serve-static'),
  connect = require('connect');

var dev = false

process.argv.forEach(function(val, index, array) {
  if (val === 'dev') dev = true
})

var metalsmith = Metalsmith(__dirname)
  .use(sass({
    outputStyle: 'expanded'
  }))
  .use(metadata({
    designers: 'data/designers.json',
    resources: 'data/resources.json'
  }))
  .use(ignore([
    'templates/**/*',
    'data/*',
    'lib/**/*',
    'lib/**/.bower.json',
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
