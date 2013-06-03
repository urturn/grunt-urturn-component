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

  grunt.registerTask('urturn_component_install', "Install urturn component.", function() {
    var bower = require('bower');
    var path = require('path');
    var options = this.options({
      dest: "lib"
    });

    var deps = {};
    function Component (data){
      this.name = data.name;
      this.version = data.version || "0.0.0";
      if(data.main){
        (typeof data.main === 'string' ? this.main = [data.main] : this.main = data.main);
      } else {
        data.main = [];
      }
      this.basedir = data.basedir || path.join(bower.config.directory, this.name);
      this.assets = data.assets || [];
      this.files = function(){
        return this.main.concat(this.assets);
      };

      this.dependencies = {};

      if (data.dependencies) {
        for (var dep in data.dependencies) {
          var depPath = path.join(bower.config.directory, dep);
          var compPath = path.join(depPath, 'component.urturn.json');
          var bowerPath = path.join(depPath, 'bower.json');
          var legacyBowerPath = path.join(depPath, 'component.json');
          if( grunt.file.exists(compPath)) {
            this.dependencies[dep] = Component.fromOptions(grunt.file.readJSON(compPath));
          } else if(grunt.file.exists(bowerPath)){
            this.dependencies[dep] = Component.fromBower(dep, grunt.file.readJSON(bowerPath));
          } else if (grunt.file.exists(legacyBowerPath)){
            this.dependencies[dep] = Component.fromBower(dep, grunt.file.readJSON(legacyBowerPath));
          } else {
            grunt.log.error(depPath, "No json descriptor found for " + dep);
          }
        }
      }
    }
    Component.fromOptions = function(info){
      if(!Component.dict[info.name]){
        Component.dict[info.name] = new Component(info);
        Component.list.push(Component.dict[info.name]);
      }
      return Component.dict[info.name];
    };
    Component.fromBower = function(name, info){
      if(!Component.dict[name]){
        Component.dict[name] = new Component({
          name: info.name,
          version: info.version,
          dependencies: info.dependencies || {},
          main: info.main
        });
        Component.list.push(Component.dict[info.name]);
      }
      return Component.dict[name];
    };
    Component.list = [];
    Component.dict = {};


    var info = grunt.file.readJSON('component.urturn.json');
    info.basedir = '.';
    Component.fromOptions(info);
    Component.list.forEach(function(comp){
      comp.files().forEach(function(f){
        grunt.file.copy( path.join(comp.basedir, f), path.join(options.dest, comp.name, f));
      });
    });
    console.log('info', info);
  });

};
