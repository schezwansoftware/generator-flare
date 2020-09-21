'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdirp = require('mkdirp');
const _ = require('lodash');
const pluralize = require('pluralize');
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
const injectorModuleRegexp = '// Flare writing content --- flare will use it to inject modules';
const injectorModulePathRegexp = '// Flare writing content --- flare will use it to inject module paths';

module.exports = class extends Generator {
  // note: arguments and options should be defined in the constructor.
  constructor(args, opts) {
    super(args, opts);

    // This makes `appname` a required argument.
    this.argument("entityName", {type: String, required: true});
    this.appName = this.config.get('appName');
    this.dbType = this.config.get('dbType');
    if (!this.appName) {
      throw new Error("Folder is Not recognized as a valid Flare Project.")
    }
    // And you can then access it later; e.g.
    this.entityName = this.options.entityName;
    const entityNameCapitalized = _.upperFirst(this.entityName);
    const entityConfigBasePath = this.destinationPath() + "/" + entityConfigBase;
    if (!fileSystem.existsSync(entityConfigBasePath)) {
      fileSystem.mkdirSync(entityConfigBasePath);
    }
    this.entityConfigBasePath = entityConfigBasePath + '/' + entityNameCapitalized + '.json';
    this.useConfigurationFile = fileSystem.existsSync(this.entityConfigBasePath);

  };


  initializing() {
    this._validateEntityName();
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

  _validateEntityName() {
    if (!(/^([a-zA-Z0-9_]*)$/.test(this.entityName))) {
      throw new Error(chalk.red('The entity name cannot contain special characters'));
    } else if (this.entityName === '') {
      throw new Error(chalk.red('The entity name cannot be empty'));
    } else if (this.entityName.indexOf('Detail', this.entityName.length - 'Detail'.length) !== -1) {
      throw new Error(chalk.red('The entity name cannot end with \'Detail\''));
    } else if (this.entityName[0].toUpperCase() === this.entityName[0]) {
      throw new Error(chalk.red('The entity name cannot start with an upercase letter'));
    } else if (pluralize.isPlural(this.entityName)) {
      throw new Error(chalk.red('The entity name cannot be a plural word'));
    }
  }

  async prompting() {
    if (this.useConfigurationFile) {
      await this._askForUpdatePrompt();
    } else {
      return await this._askForFieldsPrompt();
    }

  }

  writing() {
    const entityBasePath = this.destinationPath() + "/server/src/entity";
    const entityClassName = _.upperFirst(this.entityName);
    const baseName = _.kebabCase(this.entityName);
    const entityAPIUrl = _.kebabCase(pluralize(this.entityName));
    const entityController = `${baseName}.controller.ts`;
    const entityService = `${baseName}.service.ts`;
    const entityInterface = `${baseName}.interface.ts`;
    const entityMapper = `${baseName}.mapper.ts`;
    const entityDTO = `${baseName}.DTO.ts`;
    const entityModule = `${baseName}.module.ts`;
    const entityModuleName = `${entityClassName}Module`;
    const entityModel = `${baseName}.model.ts`;
    const entityRepository = `${baseName}.repository.ts`;
    const entitydir = entityBasePath + "/" + baseName;
    const config = {
      baseName,
      entityName: this.entityName,
      entityClassName: entityClassName,
      entityBaseFileName: baseName,
      generatedFields: this.generatedFields,
      pluralizedEntityName: pluralize(entityClassName),
      dbType: this.dbType,
      entityAPIUrl: entityAPIUrl
    };
    if (!fileSystem.existsSync(entitydir)) {
      fileSystem.mkdirSync(entitydir);
    }
    this.fs.copyTpl(
      this.templatePath("_model.ts.ejs"),
      this.destinationPath(entitydir + "/" + entityModel),
      config
    );
    this.fs.copyTpl(
      this.templatePath("_interface.ts.ejs"),
      this.destinationPath(entitydir + "/" + entityInterface),
      config
    );

    this.fs.copyTpl(
      this.templatePath("_repository.ts.ejs"),
      this.destinationPath(entitydir + "/" + entityRepository),
      config
    );

    this.fs.copyTpl(
      this.templatePath("_mapper.ts.ejs"),
      this.destinationPath(entitydir + "/" + entityMapper),
      config
    );

    this.fs.copyTpl(
      this.templatePath("_DTO.ts.ejs"),
      this.destinationPath(entitydir + "/" + entityDTO),
      config
    );

    this.fs.copyTpl(
      this.templatePath("_service.ts.ejs"),
      this.destinationPath(entitydir + "/" + entityService),
      config
    );

    this.fs.copyTpl(
      this.templatePath("_controller.ts.ejs"),
      this.destinationPath(entitydir + "/" + entityController),
      config
    );
    this.fs.copyTpl(
      this.templatePath("_module.ts.ejs"),
      this.destinationPath(entitydir + "/" + entityModule),
      config
    );
    const entityBaseModulePath = entityBasePath + "/entity.module.ts";
    if (fileSystem.existsSync(entityBaseModulePath)) {
      this.fs.copy(entityBaseModulePath, entityBaseModulePath, {
        process: function (content) {

          /* Any modification goes here. Note that contents is a Buffer object */
          if (!content.toString().includes(entityModuleName)) {
            let regEx = new RegExp(injectorModuleRegexp, 'g');
            let replaceString = entityModuleName + "," + "\n" + injectorModuleRegexp;
            let newContent = content.toString().replace(regEx, replaceString);
            regEx = new RegExp(injectorModulePathRegexp, 'g');
            replaceString = `import {${entityModuleName}} from './${baseName}/${baseName}.module';\n${injectorModulePathRegexp}`;
            newContent = newContent.replace(injectorModulePathRegexp, replaceString);
            return newContent;
          }
          return content;
        }.bind(this)
      });
    }
    this._cpEntityConfig();
    const appType = this.config.get("appType");
    if (appType === 'fullstack') {
      this._writeClientFiles(config);
    }
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

  _cpEntityConfig() {
    const fieldData = this.generatedFields;
    const data = {fieldData};
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
    let typeChoices = [
      {
        value: 'String',
        name: 'String'
      },
      {
        value: 'Number',
        name: 'Number'
      },
      {
        value: 'Date',
        name: 'DateTime'
      },
      {
        value: 'Boolean',
        name: 'Boolean'
      },
    ];
    if (this.dbType === 'mongodb') {
      typeChoices.push({
        value: 'ObjectId',
        name: 'ObjectId'
      });
    }
    const fieldsPrompts = [
      {
        type: 'confirm',
        name: 'fieldAdd',
        message: 'Do you want to add a field to your entity?',
        default: true,
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
          } else if (input.length > 30) {
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
        choices: typeChoices,
        default: 0
      },
    ];

    const props = await this.prompt(fieldsPrompts);
    if (props.fieldAdd) {
      const {fieldName, fieldType} = props;
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
        return;
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

  _writeClientFiles(config) {
    const clientBasePath = this.destinationPath() + "/client/src/app/";
    const clientEntityBasePath = this.destinationPath() + "/client/src/app/entity";
    if (!fileSystem.existsSync(clientEntityBasePath)) {
      fileSystem.mkdirSync(clientEntityBasePath);
    }
    let hasDateField = false;
    for (const field of config.generatedFields) {
      if (field.fieldType === 'Date') {
        hasDateField = true;
      }
      field.fieldTitle = _.startCase(field.fieldName);
    }
    const entityInterfaceName = `I${_.startCase(_.toLower(config.entityName))}`;
    const entityTitlePlural = `${_.startCase(pluralize(config.entityName))}`;
    const entityTitleSingular = `${_.startCase(config.entityName)}`;
    const entitySingleVariableName = `${_.toLower(config.entityName)}`;
    const entityArrayVariableName = `${pluralize(this.entityName)}`;
    config = {...config, entitySingleVariableName, entityArrayVariableName, entityInterfaceName, hasDateField, entityTitleSingular, entityTitlePlural};
    this.fs.copyTpl(
      this.templatePath("client/_model.ts.ejs"),
      this.destinationPath(clientBasePath + "/" + 'shared/model/' + config.baseName + '.model.ts'),
      config
    );
    const entityPath = clientEntityBasePath + '/' + config.baseName;
    const componentHTML = `${config.baseName}.component.html`;
    const componentTS = `${config.baseName}.component.ts`;
    const serviceTS = `${config.baseName}.service.ts`;
    if (!fileSystem.existsSync(entityPath)) {
      fileSystem.mkdirSync(entityPath);
    }
    this.fs.copyTpl(
      this.templatePath("client/_component.ts.ejs"),
      this.destinationPath(entityPath + '/' + componentTS),
      config
    );
    this.fs.copyTpl(
      this.templatePath("client/_service.ts.ejs"),
      this.destinationPath(entityPath + '/' + serviceTS),
      config
    );
    this.fs.copyTpl(
      this.templatePath("client/_component.html.ejs"),
      this.destinationPath(entityPath + '/' + componentHTML),
      config
    );
  }
};
