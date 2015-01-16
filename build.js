'use strict'

var Metalsmith = require('metalsmith');
var sass = require('metalsmith-sass');
var watch = require('metalsmith-watch');
var templates = require('metalsmith-templates');
var permalinks = require('metalsmith-permalinks');
var ignore = require('metalsmith-ignore');
var metadata = require('metalsmith-metadata');
var autoprefixer = require('metalsmith-autoprefixer');
var serve = require('metalsmith-serve');

var metalsmith = Metalsmith(__dirname)
  .use(sass())
  .use(autoprefixer())
  .use(metadata({
    designers: 'data/designers.json',
    opportunities: 'data/opportunities.json',
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
    }
  }))
  .use(permalinks({
    pattern: ':title',
    relative: false
  }))
  .use(watch())
  .use(serve())
  .build(function(err){
    if (err) throw err
  })
