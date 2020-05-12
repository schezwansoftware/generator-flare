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
]
const writeServerFiles = function (appName, appPort, dbType)  {
 writeBaseFiles.call(this, appName, appPort, dbType);
}


function writeBaseFiles(appName, appPort, dbType) {
  this.fs.copyTpl(
    this.templatePath(serverBasePath + '/package.json'),
    this.destinationPath(serverBasePath + '/package.json'),
    {appName, appPort, dbType}
  );
  for (const file of commonConfigFiles) {
    this.fs.copyTpl(
      this.templatePath(serverBasePath + '/' + file),
      this.destinationPath(serverBasePath + '/' + file),
      {appName, appPort, dbType}
    );
  }
  switch (dbType) {
    case 'mongodb':
      writeMongoFiles.call(this, appName, appPort, dbType);
      break;
    case 'mysql':
      writeSqlFiles.call(this, appName, appPort, dbType);
      break;
    case 'cassandra':
      writeCassandraFiles.call(this, appName, appPort, dbType);
      break;
  }
}

function writeMongoFiles(appName, appPort, dbType) {
  const userBasePath = serverBasePath + '/src/user';
  this.fs.copyTpl(
    this.templatePath(userBasePath),
    this.destinationPath(userBasePath),
    {appName, appPort, dbType}
  );
}

function writeSqlFiles(appName, appPort, dbType) {
  const userBasePath = serverBasePath + '/src/user';
  const authorityBasePath = serverBasePath + '/authority';
  this.fs.copyTpl(
    this.templatePath(userBasePath),
    this.destinationPath(userBasePath),
    {appName, appPort, dbType}
  );
  this.fs.copyTpl(
    this.templatePath(authorityBasePath),
    this.destinationPath(userBasePath + '/authority'),
    {appName, appPort, dbType}
  );

  this.fs.copyTpl(
    this.templatePath(serverBasePath + '/database'),
    this.destinationPath(serverBasePath + '/src/database'),
    {appName, appPort, dbType}
  );
  this.fs.copyTpl(
    this.templatePath(serverBasePath + '/entity.constants.ts'),
    this.destinationPath(serverBasePath + '/src/entity/entity.constants.ts'),
    {appName, appPort, dbType}
  );
}

function writeCassandraFiles(appName, appPort, dbType) {

}
module.exports = {writeServerFiles}
