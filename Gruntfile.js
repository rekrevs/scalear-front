// Generated on 2013-10-28 using generator-angular-ui-router 0.5.2
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: 'dist',
      coverageE2E: 'coverageE2E'
    },
    watch: {
      coffee: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.coffee'],
        tasks: ['coffee:dist']
      },
      coffeeTest: {
        files: ['test/spec/{,*/}*.coffee'],
        tasks: ['coffee:test']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['copy:styles', 'autoprefixer']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    autoprefixer: {
      options: ['last 1 version'],
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        livereload: 35729
      },
      livereload: {
        options: {
          open: false,
          base: [
            '.tmp',
            '<%= yeoman.app %>'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= yeoman.dist %>'
        }
      },
      coverageE2E: {
        options: {
          open: false,
          base: [
            '<%= yeoman.coverageE2E %>/app'
          ]
        }
      },
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp',
      bower: {
        files: [{
          src: ['<%= yeoman.dist %>/bower_components', '<%= yeoman.dist %>/views']
        }]
      },
      coverageE2E: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.coverageE2E %>/*',
          ]
        }]
      }
    },
    jshint: {
      options: {
        ignores: [
          '<%= yeoman.app %>/scripts/externals/*',
        ],
        globals: {
          'angular': true,
          'inject': true,
          'sinon': true,
          'expect': true,
          'console': true,
        },
        strict: false,
        curly: true,
        eqeqeq: true,
        forin: false,
        funcscope: true,
        indent: 2,
        latedef: false,
        noarg: true,
        quotmark: true,
        shadow: true,
        undef: true,
        browser: true,
        sub: true,
        loopfunc: true
      },
      target: ['<%= yeoman.app %>/scripts/**/*.js']
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },
    useminPrepare: {
      html: '<%= yeoman.app %>/**/*.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/**/*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= yeoman.dist %>'],
        assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist %>/images'],
        patterns: {
          html: [
            [/images\/([^"']+[png|gif|jpg|jpeg])/gm,
              'Replacing reference to image.png'
            ],
            [/<script.+src=['"]([^"']+)["']/gm,
              'Update the HTML to reference our concat/min/revved script files'
            ],
            [/<link[^\>]+href=['"]([^"']+)["']/gm,
              'Update the HTML with the new css filenames'
            ],
            [/<img[^\>]+src=['"]([^"']+)["']/gm,
              'Update the HTML with the new img filenames'
            ],
            [/data-main\s*=['"]([^"']+)['"]/gm,
              'Update the HTML with data-main tags',
              function(m) {
                return m.match(/\.js$/) ? m : m + '.js';
              },
              function(m) {
                return m.replace('.js', '');
              }
            ],
            [/data-(?!main).[^=]+=['"]([^'"]+)['"]/gm,
              'Update the HTML with data-* tags'
            ],
            [/url\(\s*['"]([^"']+)["']\s*\)/gm,
              'Update the HTML with background imgs, case there is some inline style'
            ],
            [/<a[^\>]+href=['"]([^"']+)["']/gm,
              'Update the HTML with anchors images'
            ],
            [/<input[^\>]+src=['"]([^"']+)["']/gm,
              'Update the HTML with reference in input'
            ]
          ]
        }
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    cssmin: {
      // By default, your `index.html` <!-- Usemin Block --> will take care of
      // minification. This option is pre-configured if you do not wish to use
      // Usemin blocks.
      // dist: {
      //   files: {
      //     '<%= yeoman.dist %>/styles/main.css': [
      //       '.tmp/styles/{,*/}*.css',
      //       '<%= yeoman.app %>/styles/{,*/}*.css'
      //     ]
      //   }
      // }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: false,
          removeCommentsFromCDATA: false,
          removeCDATASectionsFromCDATA: false,
          collapseWhitespace: false,
          collapseBooleanAttributes: false,
          removeAttributeQuotes: false,
          removeRedundantAttributes: false,
          useShortDoctype: false,
          removeEmptyAttributes: false,
          removeOptionalTags: false,
          removeEmptyElements: false,
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['views/**/*.html'],
          dest: '<%= yeoman.dist %>'
        }, ]
      },
      index: {
        options: {
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['index.html'],
          dest: '<%= yeoman.dist %>'
        }, ]
      }
    },
    copy: {// Put files not handled in other tasks here
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'bower_components/**/*',
            'images/{,*/}*.{gif,webp}',
            'styles/externals/**/*',
            'template/**/*',
            '*.html',
            'views/**/*.html',
            'external_documents/**/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: [
            'generated/*'
          ]
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>',
        dest: '.tmp/styles/',
        src: ['styles/**/*', 'bower_components/**/*.css']
      },
      coverageE2E: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.coverageE2E %>/app',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'bower_components/**/*',
            'images/**/*',
            'fonts/**/*',
            'views/**/*',
            'template/**/*',
            'styles/**/*',
            '*.html',
            'locals/*'
          ]
        }]
      },
    },
    instrument: {
      files: '<%= yeoman.app %>/scripts/**/*.js',
      options: {
        lazy: true,
        basePath: '<%= yeoman.coverageE2E %>/'
      }
    },
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin',
      ]
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },
    protractor: {
      options: {
        configFile: "node_modules/protractor/referenceConf.js", // Default config file
        keepAlive: false, // If false, the grunt process stops when the test fails.
        noColor: false, // If true, protractor will not use colors in its output.
        debug: false,
        args: {}
      },
      dev: {
        options: {
          configFile: "referenceConf-dev.js", // Target-specific config file
          args: {} // Target-specific arguments
        }
      },
      staging: {
        options: {
          configFile: "referenceConf-staging.js", // Target-specific config file
          args: {} // Target-specific arguments
        }
      },
    },
    protractor_coverage: {
      options: {
        configFile: "node_modules/protractor/referenceConf.js", // Default config file
        keepAlive: true, // If false, the grunt process stops when the test fails.
        noColor: false, // If true, protractor will not use colors in its output.
        coverageDir: '<%= yeoman.coverageE2E %>',
        args: {}
      },
      coverageE2E: {
        options: {
          configFile: "referenceConf-dev.js", // Target-specific config file
          args: {} // Target-specific arguments
        }
      },
    },
    makeReport: {
      src: '<%= yeoman.coverageE2E %>/*.json',
      options: {
        type: 'html',
        dir: '<%= yeoman.coverageE2E %>/reports',
        print: 'detail'
      }
    },
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts/',
          src: '*.js',
          dest: '.tmp/concat/scripts/'
        }]
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= yeoman.dist %>/scripts/scripts.js': [
            '<%= yeoman.dist %>/scripts/scripts.js'
          ],
          '<%= yeoman.dist %>/scripts/externals.js': [
            '<%= yeoman.dist %>/scripts/externals.js'
          ]
        }
      }
    },
    inline_angular_templates: {
      dist: {
        options: {
          base: 'dist/', // (Optional) ID of the <script> tag will be relative to this folder. Default is project dir.
          prefix: '/', // (Optional) Prefix path to the ID. Default is empty string.
          selector: 'body', // (Optional) CSS selector of the element to use to insert the templates. Default is `body`.
          method: 'prepend' // (Optional) DOM insert method. Default is `prepend`.
        },
        files: {
          '<%= yeoman.dist %>/index.html': ['<%= yeoman.dist %>/views/**/*.html']
        }
      }
    },
    compress: {
      main: {
        options: {
          mode: 'gzip',
          level: 2
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['scripts/**/*.js'],
          dest: '<%= yeoman.dist %>/',
          extDot: 'last',
          ext: '.js.gz'
        },
        {
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['styles/**/*.css'],
          dest: '<%= yeoman.dist %>/',
          extDot: 'last',
          ext: '.css.gz'
        }]
      }
    },
    htmlclean: {
      dist: {
        expand: true,
        cwd: '<%= yeoman.dist %>',
        src: '**/*.html',
        dest: '<%= yeoman.dist %>'
      },
    },
    ngconstant: {
      options: {
        dest: '<%= yeoman.app %>/scripts/config.js',
        wrap: "'use strict';\n{%= __ngModule %}\n",
        name: 'config',
        constants: {
          scalear_api: {
            beta: false,
            debug: true,
            ga_token: "",
            host: '',
            version: '4.4.3 (' + new Date().toUTCString() + ')',
            instruction_manual: 'external_documents/Manual - Using Scalable Learning v.3.22.pdf',
            flipped_manual: 'external_documents/Manual - Flipped Teaching v.1.0.pdf',
            teacher_welcome_video: "https://www.youtube.com/watch?v=tqE7wRQCgmU",
            teacher_new_course_video: "https://www.youtube.com/watch?v=rDWIUYybFPs",
            teacher_review_course_video: "https://www.youtube.com/watch?v=DhJgqWBm0XY",
            student_welcom_video: "https://www.youtube.com/watch?v=bLiZfyBuFkc",
            teacher_forum_link: "https://groups.google.com/forum/#!forum/scalablelearning-teachers-forum"
          }
        }
      },
      dev: {
        constants: {
          scalear_api: {
            host: 'http://0.0.0.0:3000'
          },
        }
      },
      prod: {
        constants: {
          scalear_api: {
            debug: false,
            ga_token: "UA-66097980-1"
          }
        }
      },
      staging: {
        constants: {
          scalear_api: {
            beta: true
          }
        }
      },
      netlify_staging: {
        constants: {
          scalear_api: {
            beta: true,
            host: 'https://scalear-staging2.herokuapp.com',
          }
        }
      },
      staging_server: {
        constants: {
          scalear_api: {
            host: 'https://scalear-staging2.herokuapp.com',
          },
        }
      },
      coverageE2E: {
        dest: '<%= yeoman.coverageE2E %>/app/scripts/config.js',
        constants: {
          scalear_api: {
            host: 'http://0.0.0.0:3000',
          },
        }
      }
    },
    i18nextract: {
      default_options: {
        src: ['<%= yeoman.app %>/scripts/**/*.js', '<%= yeoman.app %>/**/*.html'],
        lang: ['en_US'],
        dest: 'tmp',
        namespace: true
      }
    }
  });

  grunt.registerTask('server', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      target == 'staging' ? 'ngconstant:staging_server' : 'ngconstant:dev',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat:generated', //done in usemin
    'copy:dist',
    'ngmin',
    'cssmin:generated', //done in usemin
    'uglify:generated', //done in usemin
    'rev:dist',
    'usemin',
    'htmlclean',
    'inline_angular_templates',
    'compress',
    'clean:bower'
  ]);

  grunt.registerTask('staging_aws', ['ngconstant:staging', 'build', 'aws_s3:staging', 's3:staging'])
  grunt.registerTask('staging', ['ngconstant:staging', 'build'])
  grunt.registerTask('netlify_staging', ['ngconstant:netlify_staging', 'build'])
  grunt.registerTask('production', ['ngconstant:prod', 'build'])
  grunt.registerTask('coverage', [
    'clean:coverageE2E',
    'copy:coverageE2E',
    'ngconstant:coverageE2E',
    'instrument',
    'connect:coverageE2E',
    'protractor_coverage:coverageE2E',
    'makeReport'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'test',
    'build'
  ]);
};
