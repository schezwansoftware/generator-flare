'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdirp = require('mkdirp');
const path = require('path');
const packagejs = require(__dirname + '/../../package.json');
const questions = 5;
const serverBasePath = 'server';
const clientBasePath = 'client';
const dockerBasePath = 'docker';
const fileSystem = require('fs');
let baseAppPath = '';
let fields = [];

module.exports = class extends Generator {
  // note: arguments and options should be defined in the constructor.
  constructor(args, opts) {
    super(args, opts);

    // This makes `appname` a required argument.
    this.argument("entityName", { type: String, required: true });
    this.appName = this.config.get('appName');
    if (!this.appName) {
      throw new Error("Folder is Not recognized as a valid Flare Project.")
    }
    // And you can then access it later; e.g.
    this.entityName = this.options.entityName;
  };
  initializing() {
      this.log(' \n' +
        chalk.green('      ██████ ') + chalk.red(' ██      ') + chalk.yellow(' ████████ ') + chalk.blue(' █████████  ') + chalk.magenta(' ███████\n') +
        chalk.green('      ██') + chalk.red('      ██      ') + chalk.yellow(' ██    ██ ') + chalk.blue(' ██      ██ ') + chalk.magenta(' ██      \n') +
        chalk.green('      ██████ ') + chalk.red(' ██      ') + chalk.yellow(' ████████ ') + chalk.blue(' █████████  ') + chalk.magenta(' ███████    \n') +
        chalk.green('      ██') + chalk.red('      ██      ') + chalk.yellow(' ██    ██ ') + chalk.blue(' ██     ██  ') + chalk.magenta(' ██        \n') +
        chalk.green('      ██') + chalk.red('      ████████') + chalk.yellow(' ██    ██ ') + chalk.blue(' ██      ██ ') + chalk.magenta(' ███████       \n') + ''
      );
      this.log(chalk.white('Welcome to the Flare Generator ') + chalk.yellow('v' + packagejs.version + '\n'));
  }
  prompting() {
    // Have Yeoman greet the user.
    this.generatedFields = [];
    const fieldsPrompts = [
      {
        type: 'confirm',
        name: 'fieldAdd',
        message: 'Do you want to add a field to your entity?',
        default:  true,
      },
      {
        when: function (response) {
          return response.fieldAdd === true;
        },
        type: 'input',
        name: 'fieldName',
        validate: function (input) {
          if (!(/^([a-zA-Z0-9_]*)$/.test(input))) {
            return 'Your field name cannot contain special characters';
          } else if (input === '') {
            return 'Your field name cannot be empty';
          } else if (input.charAt(0) === input.charAt(0).toUpperCase()) {
            return 'Your field name cannot start with a upper case letter';
          } else if (input === 'id') {
            return 'Your field name cannot be id';
          }  else if (input.length > 30) {
            return 'The field name cannot be of more than 30 characters';
          }
          return true;
        },
        message: 'What is the name of your field?'
      },
      {
        when: function (response) {
          return response.fieldAdd === true;
        },
        type: 'list',
        name: 'fieldType',
        message: 'What is the type of your field?',
        choices: [
          {
            value: 'String',
            name: 'String'
          },
          {
            value: 'Number',
            name: 'Number'
          },
          {
            value: 'ObjectId',
            name: 'ObjectId'
          },
          {
            value: 'Date',
            name: 'DateTime'
          },
          {
            value: 'Boolean',
            name: 'Boolean'
          },
        ],
        default: 0
      },
    ];

    const promise = (relevantPrompts) => {
      return this.prompt(relevantPrompts).then(props => {
        // To access props later use this.props.someAnswer;
        if (props.fieldAdd) {
          const { fieldName, fieldType } = props;
          const field = {fieldName, fieldType};
          this.generatedFields.push(field);
        }
        return props.fieldAdd ? promise(fieldsPrompts) : this.prompt([]);
      });
    };
    return promise([...fieldsPrompts]);

  }

  writing() {
    const entityBasePath = this.destinationPath() + "/server/src/entity";
    const entityClassName = this._capitalizeFirstLetter(this.entityName);
    const baseName = this._convertToDashCase(this.entityName);
    const entityController = `${baseName}.controller.ts`;
    const entityService = `${baseName}.service.ts`;
    const entityInterface = `${baseName}.interface.ts`;
    const entityModule = `${baseName}.controller.ts`;
    const entityModel = `${baseName}.model.ts`;
    const entityRepository = `${baseName}.repository.ts`;
    const entitydir = entityBasePath + "/" + baseName;
    if (!fileSystem.existsSync(entitydir)) {
      fileSystem.mkdirSync(entitydir);
    }
    this.fs.copyTpl(
      this.templatePath("_model.ts.ejs"),
      this.destinationPath(entitydir + "/" + entityModel),
      { entityClassName: entityClassName, generatedFields: this.generatedFields }
    );
    this.fs.copyTpl(
      this.templatePath("_interface.ts.ejs"),
      this.destinationPath(entitydir + "/" + entityInterface),
      { entityClassName: entityClassName, generatedFields: this.generatedFields }
    );
  }

  install() {
    // var elementDir = process.cwd() + '/' + baseAppPath + '/' + serverBasePath;
    // process.chdir(elementDir);
    // this.installDependencies({
    //   npm: false,
    //   bower: false,
    //   yarn: true
    // });
  }

  _capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  _convertToDashCase(string) {
    return string.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
  }

};
