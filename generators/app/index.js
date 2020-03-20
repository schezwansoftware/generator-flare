'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const packagejs = require(__dirname + '/../../package.json');


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
        message: 'What is your Project Name?',
        default: this.appname
      },
      {
        type: 'list',
        name: 'appType',
        message: 'What kind of app are you looking to generate?',
        default: 'service',
        choices: [
          { name: 'MicroService (NestJS)', value: 'service' },
          { name: 'Fullstack (NESTJS + Angular)', value: 'fullstack' }
        ],
      },
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
