var _ = require('underscore');

module.exports = function(grunt) {

	var basename = 'prosthesjs';

	var backboneSources = [ 'node_modules/backbone/backbone.js' ];

	var marionetteSources = [ 'node_modules/backbone.marionette/lib/backbone.marionette.js' ];

	var underscoreSources = [
		'node_modules/underscore/underscore.js',
		'node_modules/underscore.string/lib/underscore.string.js'
	];

	var sources = [
		'src/namespaces.js',
		'src/globals.js',
		'src/aliases.js',
		'src/class.js',
		'src/core/*.js',
		'src/model/*.js',
		'src/view/*Mixin.js',
		'src/view/*.js',
		'src/ui/Widget.js',
		'src/ui/*.js'
	];

	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		clean : [ 'build/*.*' ],
		jshint : {
			sources : sources
		},
		copy : {
			libraries : {
				files : [{
					src : _.union(underscoreSources, backboneSources,
						marionetteSources),
					dest : 'lib/',
					flatten : true,
					expand : true
				}]
			}
		},
		concat : {
			dist : {
				src : sources,
				dest : 'build/' + basename + '.js'
			},
			all : {
				src : _.union([
					'lib/underscore.js',
					'lib/underscore.*.js',
					'lib/backbone.js',
//					'lib/backbone.super.js',
					'lib/backbone.marionette.js'
				], sources),
				dest : 'build/' + basename + '.all.js'
			}
		},
		uglify : {
			dist : {
				options : {
					sourceMap : 'build/' + basename + '.js.map',
					sourceMappingURL : 'http://raw.github.com/...'
				},
				src : 'build/' + basename + '.js',
				dest : 'build/' + basename + '.min.js'
			},
			all : {
				options : {
					sourceMap : 'build/' + basename + '.all.js.map',
					sourceMappingURL : 'http://raw.github.com/...'
				},
				src : 'build/' + basename + '.all.js',
				dest : 'build/' + basename + '.all.min.js'
				
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat')
	grunt.loadNpmTasks('grunt-contrib-copy');;
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	//grunt.registerTask('test', ['jshint', 'jasmine']);
	grunt.registerTask('default', ['clean', 'jshint', 'copy', 'concat', 'uglify']);

};
