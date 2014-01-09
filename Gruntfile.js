// Generated on 2013-10-28 using generator-angular-ui-router 0.5.2
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: 'dist'
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
          open: true,
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
      }
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
      bower:{
        files:[{
          src:['<%= yeoman.dist %>/bower_components','<%= yeoman.dist %>/views' ]
        }]
      }

    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        //reporterOutput: '<%= yeoman.app %>/jshint_log.txt',
        '-W106':false, //camelCase
        '-W033': false, // semicolon
      },
      all: [
       // 'Gruntfile.js',
        '<%= yeoman.app %>/scripts/**/*.js'
      ]
    },
    coffee: {
      options: {
        sourceMap: true,
        sourceRoot: ''
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/scripts',
          src: '{,*/}*.coffee',
          dest: '.tmp/scripts',
          ext: '.js'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: 'test/spec',
          src: '{,*/}*.coffee',
          dest: '.tmp/spec',
          ext: '.js'
        }]
      }
    },
    // not used since Uglify task does concat,
    // but still available if needed
    /*concat: {
      dist: {}
    },*/
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
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
      options:{
        dirs:['<%= yeoman.dist %>'],
        assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist %>/images'],
        patterns: {
          html: [
            [/images\/([^"']+[png|gif|jpg|jpeg])/gm, 
            'Replacing reference to image.png'
            ],
            [ /<script.+src=['"]([^"']+)["']/gm,
              'Update the HTML to reference our concat/min/revved script files'
            ],
            [ /<link[^\>]+href=['"]([^"']+)["']/gm,
            'Update the HTML with the new css filenames'
            ],
            [ /<img[^\>]+src=['"]([^"']+)["']/gm,
            'Update the HTML with the new img filenames'
            ],
            [ /data-main\s*=['"]([^"']+)['"]/gm,
            'Update the HTML with data-main tags',
            function (m) { return m.match(/\.js$/) ? m : m + '.js'; },
            function (m) { return m.replace('.js', ''); }
            ],
            [ /data-(?!main).[^=]+=['"]([^'"]+)['"]/gm,
            'Update the HTML with data-* tags'
            ],
            [ /url\(\s*['"]([^"']+)["']\s*\)/gm,
            'Update the HTML with background imgs, case there is some inline style'
            ],
            [ /<a[^\>]+href=['"]([^"']+)["']/gm,
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
          src: '{,*/}*.{png,jpg,jpeg}',
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
          removeComments:false,
          removeCommentsFromCDATA:false,
          removeCDATASectionsFromCDATA:false,
          collapseWhitespace:false,
          collapseBooleanAttributes:false,
          removeAttributeQuotes:false,
          removeRedundantAttributes:false,
          useShortDoctype:false,
          removeEmptyAttributes:false,
          removeOptionalTags:false,
          removeEmptyElements:false,
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['views/**/*.html'],
          dest: '<%= yeoman.dist %>'
        },]
      },
      index:{
        options: {
          // removeCommentsFromCDATA: true,
          // // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          // collapseBooleanAttributes: true,
          // removeAttributeQuotes: true,
          // removeRedundantAttributes: true,
          // useShortDoctype: true,
          // removeEmptyAttributes: true,
          // removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['index.html'],
          dest: '<%= yeoman.dist %>'
        },]
      }
    },
    // Put files not handled in other tasks here
    copy: {
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
            //'scripts/externals/shortcut.js',
            'images/{,*/}*.{gif,webp}',
            'styles/fonts/*',
            'template/**/*',
            '*.html',
            'views/**/*.html'
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
        src: ['styles/**/*.css', 'bower_components/**/*.css']
      }
    },
    concurrent: {
      server: [
        'coffee:dist',
        'copy:styles'
      ],
      test: [
        'coffee',
        'copy:styles'
      ],
      dist: [
        //'coffee',
        'copy:styles',
        'imagemin',
        'svgmin',
        //'htmlmin:dist'
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
      keepAlive: true, // If false, the grunt process stops when the test fails.
      noColor: false, // If true, protractor will not use colors in its output.
      args: {
        // Arguments passed to the command
      }
    },
    dev: {
      options: {
        configFile: "referenceConf.js", // Target-specific config file
        args: {} // Target-specific arguments
      }
    },
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
          src: 'scripts.js',
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
                prefix: '/',            // (Optional) Prefix path to the ID. Default is empty string.
                selector: 'body',       // (Optional) CSS selector of the element to use to insert the templates. Default is `body`.
                method: 'prepend'       // (Optional) DOM insert method. Default is `prepend`.
            },
            files: {
                '<%= yeoman.dist %>/index.html': ['<%= yeoman.dist %>/views/**/*.html']
            }
        }
    },
    compress: {
      main: {
        options: {
          mode: 'gzip'
        },
        files: [
          {
            expand: true, 
            cwd: '<%= yeoman.dist %>',
            src: ['scripts/**/*.js','bower_components/**/*.js', 'styles/**/*.css', '**/*.html'], 
            dest: '<%= yeoman.dist %>', 
            //ext: '.gz.js'
          },
        ]
      }
    },
   htmlclean: {
      // options: {
      //   //protect: /<\!--%fooTemplate\b.*?%-->/g,
      //   //edit: function(html) { return html.replace(/\begg(s?)\b/ig, 'omelet$1'); }
      // },
      dist: {
        expand: true,
        cwd: '<%= yeoman.dist %>',
        src: '**/*.html',
        dest: '<%= yeoman.dist %>'
      },
    },


  aws: grunt.file.readJSON('app/grunt-aws.json'),
  aws_s3: {
  options: {
    accessKeyId: '<%= aws.key %>', // Use the variables
    secretAccessKey: '<%= aws.secret %>', // You can also use env variables
    //region: 'eu-west-1',
    uploadConcurrency: 5 ,// 5 simultaneous uploads
    //downloadConcurrency: 5 // 5 simultaneous downloads
  },
  staging: {
    options: {
      bucket: '<%= aws.bucket_staging %>',
      //differential: true // Only uploads the files that have changed
    },
    files: [
     // {dest: '/', cwd: 'backup/staging/', action: 'download'},
       {dest: '/', action: 'delete'},
      // {expand: true, dot:true, cwd: 'dist/', src: ['.htaccess'], dest: './'},
      //{expand: true, cwd: 'dist/staging/styles/', src: ['**'], dest: 'app/styles/'},
     
    ]
  },
  prod: {
      options: {
          bucket: '<%= aws.bucket_production %>',
          //differential: true // Only uploads the files that have changed
      },
      files: [
          // {dest: '/', cwd: 'backup/staging/', action: 'download'},
          {dest: '/', action: 'delete'},
          // {expand: true, dot:true, cwd: 'dist/', src: ['.htaccess'], dest: './'},
          //{expand: true, cwd: 'dist/staging/styles/', src: ['**'], dest: 'app/styles/'},

      ]
  },
  // production: {
  //   options: {
  //     bucket: 'my-wonderful-production-bucket',
  //     params: {
  //       ContentEncoding: 'gzip' // applies to all the files!
  //     }
  //     mime: {
  //       'dist/assets/production/LICENCE': 'text/plain'
  //     }
  //   },
  //   files: [
  //     {expand: true, cwd: 'dist/production/', src: ['**'], dest: 'app/'},
  //     {expand: true, cwd: 'assets/prod/', src: ['**'], dest: 'assets/', params: {CacheControl: '2000'},
  //     // CacheControl only applied to the assets folder
  //     // LICENCE inside that folder will have ContentType equal to 'text/plain'
  //   ]
  // },
  // clean_production: {
  //   options: {
  //     bucket: 'my-wonderful-production-bucket'
  //     debug: true // Doesn't actually delete but shows log
  //   },
  //   files: [
  //     {dest: 'app/', action: 'delete'},
  //   ]
  // }
},
   s3: {
    options: {
      key: '<%= aws.key %>',
      secret: '<%= aws.secret %>',
      access: 'public-read',
      headers: {
        // Two Year cache policy (1000 * 60 * 60 * 24 * 730)
        "Cache-Control": "max-age=630720000, public",
        "Expires": new Date(Date.now() + 63072000000).toUTCString(),
        "ETag": ''
      }
    },
     staging: {
      options:{
          bucket: '<%= aws.bucket_staging %>'
      },
      upload: [
       {
          rel: 'dist', 
          src: '<%= yeoman.dist %>/**/*.*',
          dest: '/',
          options: { gzip: true }
       }
      ]
    },
   prod: {
       options:{
           bucket: '<%= aws.bucket_production %>'
       },
       upload: [
           {
               rel: 'dist',
               src: '<%= yeoman.dist %>/**/*.*',
               dest: '/',
               options: { gzip: true }
           },
       ],
   }

  },

 ngconstant: {
  options: {
    space: '  '
  },
  // targets
  dev: [{
    dest: '<%= yeoman.app %>/scripts/config.js',
    wrap: '"use strict";\n\n <%= __ngModule %>',
    name: 'config',
    constants: {
      scalear_api:{
        host: 'http://localhost:3000', 
        redirection_url: 'http://localhost:9000/#/'
      },
      
    }
  }],
  staging: [{
    dest: '<%= yeoman.app %>/scripts/config.js',
    wrap: '"use strict";\n\n <%= __ngModule %>',
    name: 'config',
    constants: {
      scalear_api:{
        host: 'http://scalear-staging.herokuapp.com',//'http://angular-learning.herokuapp.com',
        redirection_url: 'http://scalear-staging.s3-website-eu-west-1.amazonaws.com/#/'
      } 
    }
  }],
 prod: [{
     dest: '<%= yeoman.app %>/scripts/config.js',
     wrap: '"use strict";\n\n <%= __ngModule %>',
     name: 'config',
     constants: {
         scalear_api:{
             host: 'http://scalear.herokuapp.com',//'http://angular-learning.herokuapp.com',
             redirection_url: 'http://scalear.s3-website-eu-west-1.amazonaws.com/#/'
         }
     }
 }]
}


  });

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'ngconstant:dev',
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
     'concat', //done in uglify
    'copy:dist',
    //'cdnify',
     'ngmin',
    'cssmin', //done in usemin
     'uglify',     
     'rev:dist',
     'usemin',
     'htmlclean',
     'inline_angular_templates',
     //'compress',
     'clean:bower'
  ]);

  grunt.registerTask('staging',['ngconstant:staging','build','aws_s3:staging', 's3:staging'])
  //grunt.registerTask('production',['ngconstant:prod','build','aws_s3:prod', 's3:prod'])

  grunt.registerTask('default', [
    'jshint',
    'test',
    'build'
  ]);
};