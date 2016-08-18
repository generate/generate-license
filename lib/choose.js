'use strict';

var extend = require('extend-shallow');

module.exports = function(app, options, cb) {
  var opts = extend({}, options);
  var inquirer = require('inquirer');
  inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

  var question = {
    name: 'tasks',
    type: 'autocomplete',
    message: opts.message,
    source: listTasks(opts)
  };

  return inquirer.prompt([question])
    .then(function(answers) {
      return answers && answers.tasks;
    });
};

function listTasks(options) {
  return function(answers, str) {
    return new Promise(function(resolve) {
      resolve(options.choices.filter(filter(str, options)));
    });
  };
}

function filter(str, options) {
  return function(choice, choices) {
    if (typeof options.filter === 'function') {
      return options.filter(str, choice, choices);
    }
    return new RegExp(str, 'i').test(choice.name[0]);
  };
}
