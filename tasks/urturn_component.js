/*
 * grunt-urturn-component
 * https://github.com/urturn/grunt-urturn-component
 *
 * Copyright (c) 2013 Olivier Amblet
 * Licensed under the MIT license.
 */

'use strict';

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
    json.dependencies = base.dependencies;
    json.main = options.main;
    json.assets = options.assets;
    grunt.file.write('component.urturn.json', JSON.stringify(json, null, 2));
    grunt.log.writeln("component.urturn.json written");
  });

};
