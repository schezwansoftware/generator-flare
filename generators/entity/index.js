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
const entityConfigBase = '.flare';
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
    const entityNameCapitalized = this._capitalizeFirstLetter(this.entityName);
    const entityConfigBasePath = this.destinationPath() + "/" + entityConfigBase;
    if (!fileSystem.existsSync(entityConfigBasePath)) {
      fileSystem.mkdirSync(entityConfigBasePath);
    }
    this.entityConfigBasePath = entityConfigBasePath + '/' + entityNameCapitalized + '.json';
    this.useConfigurationFile = fileSystem.existsSync(this.entityConfigBasePath);

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

      if (!this.useConfigurationFile) {
        this.generatedFields = [];
      } else {
        this._loadJson();
      }
  }
   async prompting() {
    if (this.useConfigurationFile) {
      await this._askForUpdatePrompt();
    } else {
      return  await this._askForFieldsPrompt();
    }

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
    this._cpEntityConfig();
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

  _cpEntityConfig() {
    const fieldData = this.generatedFields;
    const data = { fieldData };
    fileSystem.writeFileSync(this.entityConfigBasePath, JSON.stringify(data));
  }

  _loadJson() {
    this.fieldNameChoices = [];
    try {
      this.fileData = this.fs.readJSON(this.entityConfigBasePath);
      this.generatedFields = this.fileData.fieldData;
      for (const field of this.generatedFields) {
        this.log(chalk.red(`${field.fieldName}: ${field.fieldType}`));
        this.fieldNameChoices.push(field.fieldName);
      }
    } catch (err) {
      this.error(chalk.red('\nThe entity configuration file could not be read!\n'));
    }
  }

  async _askForFieldsPrompt() {
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

    const props = await this.prompt(fieldsPrompts);
    if (props.fieldAdd) {
      const { fieldName, fieldType } = props;
      const field = {fieldName, fieldType};
      this.generatedFields.push(field);
      await this._askForFieldsPrompt();
    }
  }

  async _askForUpdatePrompt() {
    this.log(chalk.blue(`Found ${this.entityConfigBasePath}. Loading previously generated fields.`))
    const prompts = [
      {
        type: 'list',
        name: 'updateEntity',
        message: 'Do you want to update the entity? This will replace the existing files for this entity, all your custom code will be overwritten',
        choices: [
          {
            value: 'regenerate',
            name: 'Yes, re generate the entity'
          },
          {
            value: 'add',
            name: 'Yes, add more fields and relationships'
          },
          {
            value: 'remove',
            name: 'Yes, remove fields and relationships'
          },
          {
            value: 'none',
            name: 'No, exit'
          }
        ],
        default: 0
      }
    ];
    const props = await this.prompt(prompts);
    return await this._resolveUpdateProps(props);
  }

  async _resolveUpdateProps(props) {
    switch (props.updateEntity) {
      case "none":
        return this.env.error(chalk.yellow('Gracefully aborting entity update..'));
      case "remove":
        return await this._askRemovePrompts();
      case "add":
        return this._askForFieldsPrompt();
      case "regenerate":
        return ;
    }
  }

  async _askRemovePrompts() {
    var prompts = [
      {
        type: 'checkbox',
        name: 'fieldsToRemove',
        message: 'Please choose the fields you want to remove',
        choices: this.fieldNameChoices
      },
      {
        when: function (response) {
          return response.fieldsToRemove.length !== 0;
        },
        type: 'confirm',
        name: 'confirmRemove',
        message: 'Are you sure to remove these fields?',
        default: true
      }
    ];
    const props = await this.prompt(prompts);
    if (props.confirmRemove) {
      for (const field of props.fieldsToRemove) {
        const filtered = this.generatedFields.filter(x => x.fieldName === field);
        if (filtered && filtered.length > 0) {
          this.generatedFields.splice(this.generatedFields.indexOf(filtered[0]), 1);
        }
      }
      this.log(chalk.yellow('Removed fields Successfully..'))
    }
  }

};
