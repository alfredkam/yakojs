'use strict';

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*', './package.json').forEach(grunt.loadNpmTasks);

    var Config = {
    	app: '.',
    	dist: './dist',
    	banner: '/* Distribution Build, Copyright 2014 Alfred Kam & Other Contributers */' 
    };

    grunt.initConfig({
        config: Config,
        uglify: {
        	minify : {
                files : [
                    {
                        expand : true,
                        cwd : '<%= config.app %>',
                        src : ['**/*.js', '!**/*.min.js','!node_modules/*/**','!Gruntfile.js'],
                        dest : '<%= config.dist %>',
                    }
                ]
            },
            options :  {
                mangle : true,
                banner : '<%= config.banner %>'
            }
        }
    });

    grunt.registerTask('build',[
    	'uglify:minify'
    ]);
};