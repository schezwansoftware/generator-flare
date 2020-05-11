const serverBasePath = 'server';
const writeServerFiles = function (appName, appPort, dbType)  {
 writeBaseFiles.call(this, appName, appPort, dbType);
}


function writeBaseFiles(appName, appPort, dbType) {
  this.fs.copyTpl(
    this.templatePath(serverBasePath + '/package.json.ejs'),
    this.destinationPath(serverBasePath + '/package.json'),
    {appName, appPort, dbType}
  );
}

function writeMongoFiles(appName, appPort, dbType) {

}

function writeSqlFiles(appName, appPort, dbType) {

}

function writeCassandraFiles(appName, appPort, dbType) {

}
module.exports = {writeServerFiles}
