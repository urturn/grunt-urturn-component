/*
 * grunt-urturn-component
 * https://github.com/urturn/grunt-urturn-component
 *
 * Copyright (c) 2013 Olivier Amblet
 * Licensed under the MIT license.
 */

'use strict';

var Component = require('../component.js');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerTask('urturn_component', 'Manage urturn component.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var bower = require('bower');
    var options = this.options();
    var base = grunt.file.readJSON(bower.config.json);
    var json = {};

    json.name = base.name;
    json.version = base.version;
    json.dependencies = options.dependencies || base.dependencies;
    json.includes = options.includes || [];
    json.main = options.main;
    json.assets = options.assets;
    grunt.file.write('component.urturn.json', JSON.stringify(json, null, 2));
    grunt.log.writeln("component.urturn.json written");
  });

  grunt.registerTask('urturn_component_install', "Install urturn component.", function() {
    var bower = require('bower');
    var path = require('path');
    var options = this.options({
      dest: "lib"
    });

    var info = grunt.file.readJSON('component.urturn.json');
    info.basedir = '.';
    var component = Component.fromOptions(info);

    Component.list.forEach(function(comp){
      var files;
      if(comp.includedIn){
        console.log(comp.name, 'already included');
        comp.assets.forEach(function(f){
          grunt.file.copy( path.join(comp.basedir, f), path.join(options.dest, comp.name, f));
        });
      } else {
        console.log(comp.name, 'not included');
        comp.files().forEach(function(f){
          grunt.file.copy( path.join(comp.basedir, f), path.join(options.dest, comp.name, f));
        });
      }
    });
    console.log('info', info);
  });

};
