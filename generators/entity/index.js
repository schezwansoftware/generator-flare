'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const pluralize = require('pluralize');
const packagejs = require(__dirname + '/../../package.json');
const fileSystem = require('fs');
const writing = require('./writing');
const _ = require('lodash');
const entityConfigBase = '.flare';
const injectorModuleRegexp = '// Flare writing content --- flare will use it to inject modules';
const injectorHTMLPathRegexp = '<!--           Flare writing content -&#45;&#45; flare will use it to inject modules-->';
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
    writing._writeServerFiles(this);
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
    const entityRouteName = `${_.snakeCase(config.entityName).toUpperCase()}`;
    const entityTitleSingular = `${_.startCase(config.entityName)}`;
    const entitySingleVariableName = `${_.toLower(config.entityName)}`;
    const entityArrayVariableName = `${pluralize(this.entityName)}`;
    config = {...config, entityRouteName, entitySingleVariableName, entityArrayVariableName, entityInterfaceName, hasDateField, entityTitleSingular, entityTitlePlural};
    this.fs.copyTpl(
      this.templatePath("client/_model.ts.ejs"),
      this.destinationPath(clientBasePath + "/" + 'shared/model/' + config.baseName + '.model.ts'),
      config
    );
    const entityPath = clientEntityBasePath + '/' + config.baseName;
    const componentHTML = `${config.baseName}.component.html`;
    const componentTS = `${config.baseName}.component.ts`;
    const serviceTS = `${config.baseName}.service.ts`;
    const componentUpdateTS = `${config.baseName}-update.component.ts`;
    const componentUpdateHTML = `${config.baseName}-update.component.html`;
    const componentDetailHTML = `${config.baseName}-detail.component.html`;
    const componentDetailTS = `${config.baseName}-detail.component.ts`;
    const componentDeleteTS = `${config.baseName}-delete-dialog.component.ts`;
    const componentDeleteHTML = `${config.baseName}-delete-dialog.component.html`;
    const moduleTS = `${config.baseName}.module.ts`;
    const routeTS = `${config.baseName}.route.ts`;
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
    this.fs.copyTpl(
      this.templatePath("client/_component.update.ts.ejs"),
      this.destinationPath(entityPath + '/' + componentUpdateTS),
      config
    );
    this.fs.copyTpl(
      this.templatePath("client/_component.update.html.ejs"),
      this.destinationPath(entityPath + '/' + componentUpdateHTML),
      config
    );
    this.fs.copyTpl(
      this.templatePath("client/_component.detail.ts.ejs"),
      this.destinationPath(entityPath + '/' + componentDetailTS),
      config
    );
    this.fs.copyTpl(
      this.templatePath("client/_component.detail.html.ejs"),
      this.destinationPath(entityPath + '/' + componentDetailHTML),
      config
    );
    this.fs.copyTpl(
      this.templatePath("client/_module.ts.ejs"),
      this.destinationPath(entityPath + '/' + moduleTS),
      config
    );
    this.fs.copyTpl(
      this.templatePath("client/_route.ts.ejs"),
      this.destinationPath(entityPath + '/' + routeTS),
      config
    );
    this.fs.copyTpl(
      this.templatePath("client/_component.delete-dialog.ts.ejs"),
      this.destinationPath(entityPath + '/' + componentDeleteTS),
      config
    );
    this.fs.copyTpl(
      this.templatePath("client/_component.delete-dialog.html.ejs"),
      this.destinationPath(entityPath + '/' + componentDeleteHTML),
      config
    );
    const path = `
        {
          path: '${config.baseName}',
          loadChildren: './${config.baseName}/${config.baseName}.module#${config.entityClassName}Module'
        },`;
    const liElement = `
        <li>
           <a class="dropdown-item" routerLink="${config.baseName}" routerLinkActive="active"
               (click)="collapseNavbar()">
              <fa-icon icon="asterisk" fixedWidth="true"></fa-icon>
              <span >${config.entityTitleSingular}</span>
            </a>
        </li>
    `;
    const entityBaseModulePath = clientEntityBasePath + "/entity.module.ts";
    const headerPath = clientBasePath + "/layouts/header/header.component.html";
    if (fileSystem.existsSync(entityBaseModulePath)) {
      this.fs.copy(entityBaseModulePath, entityBaseModulePath, {
        process: function (content) {

          /* Any modification goes here. Note that contents is a Buffer object */
          if (!content.toString().includes(path)) {
            let regEx = new RegExp(injectorModuleRegexp, 'g');
            let replaceString = path + "\n" + injectorModuleRegexp;
            return content.toString().replace(regEx, replaceString);
          }
          return content;
        }.bind(this)
      });
    }
    if (fileSystem.existsSync(headerPath)) {
      this.fs.copy(headerPath, headerPath, {
        process: function (content) {

          /* Any modification goes here. Note that contents is a Buffer object */
          if (!content.toString().includes(liElement)) {
            let regEx = new RegExp(injectorHTMLPathRegexp, 'g');
            let replaceString = liElement + "\n" + injectorHTMLPathRegexp;
            return content.toString().replace(regEx, replaceString);
          }          return content;
        }.bind(this)
      });
    }
  }
};
