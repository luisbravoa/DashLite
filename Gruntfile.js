module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            my_target: {
                files: {
                    'dist/DashLite.min.js': ['dist/DashLite.js']
                }
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'dist/DashLite.min.css': ['dist/DashLite.css']
                }
            }
        },
        mocha: {
            test: {

                // Test files
                src: ['tests/index.html'],
                options: {
                    reporter: 'Spec',
                    timeout: 10000
                }
            }
        },
        jshint: {
            all: [
                'src/*.js'
            ]
        },
        concat: {
            js: {
                src: ['src/wrap.start.js', 'src/utils.js',  'src/Base.js', 'src/item/Item.js', 'src/column/Column.js', 'src/Main.js', 'src/wrap.end.js'],
                dest: 'dist/DashLite.js',
            },
            css: {
                src: ['src/main.css', 'src/column/column.css', 'src/item/item.css'],
                dest: 'dist/DashLite.css',
            }
            
        }

    });
    //    grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);



};