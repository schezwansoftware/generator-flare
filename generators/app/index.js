'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the neat ${chalk.red('generator-flare')} generator!`)
    );

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
