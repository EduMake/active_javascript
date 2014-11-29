module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
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

  // Default task(s).
  grunt.registerTask('default', ['dir2json']);

};
