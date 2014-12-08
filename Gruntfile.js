module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    watch: {
        scripts: {
          files: ['exercises/**/**'],
          //exclude: '**/*~',
          tasks: ['dir2json'],
          options: {
            spawn: false
          }
        }
      },
      dir2json: {
        options: {
            exclude: '**/*~'
        },
        dist: {
             root: 'exercises/',
             dest: 'dist/exercises.json'
        }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-dir2json');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // Default task(s).
  grunt.registerTask('default', ['dir2json']);

};
