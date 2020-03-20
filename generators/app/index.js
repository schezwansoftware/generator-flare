'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const packagejs = require(__dirname + '/../../package.json');
const questions = 5;


module.exports = class extends Generator {
  initializing() {
      this.log(' \n' +
        chalk.green(' ██████ ') + chalk.red(' ██      ') + chalk.yellow(' ████████ ') + chalk.blue(' █████████  ') + chalk.magenta(' ███████\n') +
        chalk.green(' ██') + chalk.red('      ██      ') + chalk.yellow(' ██    ██ ') + chalk.blue(' ██      ██ ') + chalk.magenta(' ██      \n') +
        chalk.green(' ██████ ') + chalk.red(' ██      ') + chalk.yellow(' ████████ ') + chalk.blue(' █████████  ') + chalk.magenta(' ███████    \n') +
        chalk.green(' ██') + chalk.red('      ██      ') + chalk.yellow(' ██    ██ ') + chalk.blue(' ██     ██  ') + chalk.magenta(' ██        \n') +
        chalk.green(' ██') + chalk.red('      ████████') + chalk.yellow(' ██    ██ ') + chalk.blue(' ██      ██ ') + chalk.magenta(' ███████       \n') + ''
      );
      this.log(chalk.white('Welcome to the Flare Generator ') + chalk.yellow('v' + packagejs.version + '\n'));
  }
  prompting() {
    // Have Yeoman greet the user.

    const prompts = [
      {
        type: 'input',
        name: 'appName',
        message: '(1/' + questions + ') What is your Project Name?',
        default: this.appname,
        validate: function (input) {
          if (/^([a-zA-Z0-9_]*)$/.test(input)) return true;
          return 'Your application name cannot contain special characters or a blank space, using the default name instead';
        }
      },
      {
        type: 'list',
        name: 'appType',
        message: '(2/' + questions + ') What kind of app are you looking to generate?',
        default: 'service',
        choices: [
          { name: 'MicroService (NestJS)', value: 'service' },
          { name: 'Fullstack (NESTJS + Angular)', value: 'fullstack' }
        ],
      },
      {
        type: 'list',
        name: 'authenticationType',
        message: '(3/' + questions + ') Which *type* of authentication would you like to use?',
        choices: [
          {
            value: 'oauth2',
            name: 'OAuth2 Authentication (stateless, with an OAuth2 server implementation)'
          },
          {
            value: 'jwt',
            name: 'JWT Token-based authentication (stateless, with a token)'
          }
        ],
        default: 'jwt'
      },
      {
        when(answers) {
          return answers.authenticationType === 'jwt';
        },
        type: 'list',
        name: 'databaseType',
        message: '(4/' + questions + ')  Which *type* of database would you like to use?',
        choices: [
          {
            value: 'sql',
            name: 'SQL (H2, MySQL, PostgreSQL, Oracle)'
          },
          {
            value: 'mongodb',
            name: 'MongoDB'
          },
          {
            value: 'cassandra',
            name: 'Cassandra'
          }
        ],
        default: 0
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
      console.log(`App name is ${this.props.appName} and service type is ${this.props.appType}`);
    });
  }

  writing() {
    this.fs.copy(
      this.templatePath('dummyfile.txt'),
      this.destinationPath('dummyfile.txt')
    );
  }

  install() {
    this.installDependencies();
  }
};
