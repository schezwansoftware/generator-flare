const serverBasePath = 'server';
const commonConfigFiles = [
  'Dockerfile',
  'nest-cli.json',
  'README.md',
  'tsconfig.build.json',
  'tsconfig.json',
  'tslint.json',
  'src/account/',
  'src/auth/',
  'src/entity/',
  'src/shared/',
  'src/templates/',
  'src/main.ts',
  'src/app.module.ts',
  'src/app.constants.ts',
  'test/',
];
const writeServerFiles = function (appName, appPort, dbType, appType)  {
 writeBaseFiles.call(this, appName, appPort, dbType, appType);
};


function writeBaseFiles(appName, appPort, dbType, appType) {
  this.fs.copyTpl(
    this.templatePath(serverBasePath + '/package.json'),
    this.destinationPath(serverBasePath + '/package.json'),
    {appName, appPort, dbType, appType}
  );
  this.fs.copyTpl(
    this.templatePath('.gitignore'),
    this.destinationPath(serverBasePath + '.gitignore'),
    {appName, appPort, dbType, appType}
  );
  for (const file of commonConfigFiles) {
    this.fs.copyTpl(
      this.templatePath(serverBasePath + '/' + file),
      this.destinationPath(serverBasePath + '/' + file),
      {appName, appPort, dbType, appType}
    );
  }
  switch (dbType) {
    case 'mongodb':
      writeMongoFiles.call(this, appName, appPort, dbType, appType);
      break;
    case 'mysql':
      writeSqlFiles.call(this, appName, appPort, dbType, appType);
      break;
    case 'cassandra':
      writeCassandraFiles.call(this, appName, appPort, dbType, appType);
      break;
  }
}

function writeMongoFiles(appName, appPort, dbType, appType) {
  const userBasePath = serverBasePath + '/src/user';
  this.fs.copyTpl(
    this.templatePath(userBasePath),
    this.destinationPath(userBasePath),
    {appName, appPort, dbType, appType}
  );
}

function writeSqlFiles(appName, appPort, dbType, appType) {
  const userBasePath = serverBasePath + '/src/user';
  const authorityBasePath = serverBasePath + '/authority';
  this.fs.copyTpl(
    this.templatePath(userBasePath),
    this.destinationPath(userBasePath),
    {appName, appPort, dbType, appType}
  );
  this.fs.copyTpl(
    this.templatePath(authorityBasePath),
    this.destinationPath(userBasePath + '/authority'),
    {appName, appPort, dbType, appType}
  );

  this.fs.copyTpl(
    this.templatePath(serverBasePath + '/database'),
    this.destinationPath(serverBasePath + '/src/database'),
    {appName, appPort, dbType, appType}
  );
  this.fs.copyTpl(
    this.templatePath(serverBasePath + '/entity.constants.ts'),
    this.destinationPath(serverBasePath + '/src/entity/entity.constants.ts'),
    {appName, appPort, dbType, appType}
  );
}

function writeCassandraFiles(appName, appPort, dbType, appType) {

}
module.exports = {writeServerFiles}
