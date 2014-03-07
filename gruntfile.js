/*
 * gruntfile.js
 */

module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');
    var target = [
        'plugins/spine.js',
        'scripts/skeletondata.js',
        'scripts/element.js',
    ];
    var banner = '\
/*\n\
 * tmlib.spine.js <%= version %>\n\
 * http://github.com/phi-jp/tmlib.spine.js\n\
 * MIT Licensed\n\
 * \n\
 * Copyright (C) 2010 phi, http://tmlife.net\n\
 */\n\
';

    grunt.initConfig({
        version: pkg.version,
        buildDir: ".",

        concat: {
            tmlib: {
                src: target,
                dest: '<%= buildDir %>/tmlib.spine.js',
                options: {
                    banner: banner
                }
            },
        },
        uglify: {
            tmlib: {
                options: {
                },
                files: {
                    '<%= buildDir %>/tmlib.spine.min.js': [ '<%= buildDir %>/tmlib.spine.js' ]
                },
            },
        },
    });

    for (var key in pkg.devDependencies) {
        if (/grunt-/.test(key)) {
            grunt.loadNpmTasks(key);
        }
    }

    grunt.registerTask('default', ['concat', 'uglify']);
};

