const injectorModuleRegexp = '// Flare writing content --- flare will use it to inject modules';
const injectorModulePathRegexp = '// Flare writing content --- flare will use it to inject module paths';
const injectorHTMLPathRegexp = '<!--           Flare writing content -&#45;&#45; flare will use it to inject modules-->';
const pluralize = require('pluralize');
const _ = require('lodash');
const fileSystem = require('fs');



const createTemplateConfig = (appContext) => {
  const entityClassName = _.upperFirst(appContext.entityName);
  const baseName = _.kebabCase(appContext.entityName);
  const entityAPIUrl = _.kebabCase(pluralize(appContext.entityName));
  return {
    baseName,
    entityName: appContext.entityName,
    entityClassName: entityClassName,
    entityBaseFileName: baseName,
    generatedFields: appContext.generatedFields,
    pluralizedEntityName: pluralize(entityClassName),
    dbType: appContext.dbType,
    entityAPIUrl: entityAPIUrl
  };
};

const writeMongoModelFiles = (appContext, config, entitydir, baseName) => {
  const entityInterface = `${baseName}.interface.ts`;
  const entityModel = `${baseName}.model.ts`;

  appContext.fs.copyTpl(
    appContext.templatePath("_model.ts.ejs"),
    appContext.destinationPath(entitydir + "/" + entityModel),
    config
  );

  if (appContext.dbType === 'mongodb') {
    appContext.fs.copyTpl(
      appContext.templatePath("_interface.ts.ejs"),
      appContext.destinationPath(entitydir + "/" + entityInterface),
      config
    );
  }
};

const writeMongoRepoFiles = (appContext, config, entitydir, baseName) => {
  const entityRepository = `${baseName}.repository.ts`;
  appContext.fs.copyTpl(
    appContext.templatePath("_repository.ts.ejs"),
    appContext.destinationPath(entitydir + "/" + entityRepository),
    config
  );
};

const writeMongoServiceFiles = (appContext, config, entitydir, baseName) => {
  const entityService = `${baseName}.service.ts`;
  const entityMapper = `${baseName}.mapper.ts`;

  appContext.fs.copyTpl(
    appContext.templatePath("_mapper.ts.ejs"),
    appContext.destinationPath(entitydir + "/" + entityMapper),
    config
  );

  appContext.fs.copyTpl(
    appContext.templatePath("_service.ts.ejs"),
    appContext.destinationPath(entitydir + "/" + entityService),
    config
  );
};

const writeMongoDTOFiles = (appContext, config, entitydir, baseName) => {
  const entityDTO = `${baseName}.DTO.ts`;
  appContext.fs.copyTpl(
    appContext.templatePath("_DTO.ts.ejs"),
    appContext.destinationPath(entitydir + "/" + entityDTO),
    config
  );
};

const writeMongoControllerFiles = (appContext, config, entitydir, baseName) => {
  const entityController = `${baseName}.controller.ts`;
  appContext.fs.copyTpl(
    appContext.templatePath("_controller.ts.ejs"),
    appContext.destinationPath(entitydir + "/" + entityController),
    config
  );
};

const writeMongoModuleFiles = (appContext, config, entitydir, baseName) => {
  const entityModule = `${baseName}.module.ts`;
  appContext.fs.copyTpl(
    appContext.templatePath("_module.ts.ejs"),
    appContext.destinationPath(entitydir + "/" + entityModule),
    config
  );
};

const injectEntityInModule = (appContext, entityBaseModulePath, baseName) => {
  const entityClassName = _.upperFirst(appContext.entityName);
  const entityModuleName = `${entityClassName}Module`;
  if (fileSystem.existsSync(entityBaseModulePath)) {
    appContext.fs.copy(entityBaseModulePath, entityBaseModulePath, {
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
      }.bind(appContext)
    });
  }
};

const copyEntityConfig = (appContext) => {
  const fieldData = appContext.generatedFields;
  const data = {fieldData};
  fileSystem.writeFileSync(appContext.entityConfigBasePath, JSON.stringify(data));
};

const writeMongoDbFiles = (appContext) => {

  const entityBasePath = appContext.destinationPath() + "/server/src/entity";
  const baseName = _.kebabCase(appContext.entityName);
  const entitydir = entityBasePath + "/" + baseName;

  const config = createTemplateConfig(appContext);

  if (!fileSystem.existsSync(entitydir)) {
    fileSystem.mkdirSync(entitydir);
  }

  writeMongoModelFiles(appContext, config, entitydir, baseName);

  writeMongoRepoFiles(appContext, config, entitydir, baseName);

  writeMongoServiceFiles(appContext, config, entitydir, baseName);

  writeMongoControllerFiles(appContext, config, entitydir, baseName);

  writeMongoDTOFiles(appContext, config, entitydir, baseName);

  writeMongoModuleFiles(appContext, config, entitydir, baseName);

  const entityBaseModulePath = entityBasePath + "/entity.module.ts";

  injectEntityInModule(appContext, entityBaseModulePath, baseName);

  copyEntityConfig(appContext);

  const appType = appContext.config.get("appType");
  if (appType === 'fullstack') {
    appContext._writeClientFiles(config);
  }``
};

const _writeServerFiles = (appContext) => {
  if (appContext.dbType === 'mysql') {

  } else if (appContext.dbType === 'mongodb') {
    writeMongoDbFiles(appContext);
  }
};

module.exports = {_writeServerFiles};
