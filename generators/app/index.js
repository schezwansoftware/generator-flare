"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const mkdirp = require("mkdirp");
const path = require("path");
const packagejs = require(__dirname + "/../../package.json");
const questions = 5;
const serverBasePath = "server";
const clientBasePath = "client";
const dockerBasePath = "docker";

module.exports = class extends Generator {
  initializing() {
    this.log(
      String(
        " \n" +
          chalk.green("      ██████ ") +
          chalk.red(" ██      ") +
          chalk.yellow(" ████████ ") +
          chalk.blue(" █████████  ") +
          chalk.magenta(" ███████\n") +
          chalk.green("      ██") +
          chalk.red("      ██      ") +
          chalk.yellow(" ██    ██ ") +
          chalk.blue(" ██      ██ ") +
          chalk.magenta(" ██      \n") +
          chalk.green("      ██████ ") +
          chalk.red(" ██      ") +
          chalk.yellow(" ████████ ") +
          chalk.blue(" █████████  ") +
          chalk.magenta(" ███████    \n") +
          chalk.green("      ██") +
          chalk.red("      ██      ") +
          chalk.yellow(" ██    ██ ") +
          chalk.blue(" ██     ██  ") +
          chalk.magenta(" ██        \n") +
          chalk.green("      ██") +
          chalk.red("      ████████") +
          chalk.yellow(" ██    ██ ") +
          chalk.blue(" ██      ██ ") +
          chalk.magenta(" ███████       \n")
      )
    );
    this.log(
      chalk.white("Welcome to the Flare Generator ") +
        chalk.yellow("v" + packagejs.version + "\n")
    );
  }

  prompting() {
    // Have Yeoman greet the user.

    const prompts = [
      {
        type: "input",
        name: "appName",
        message: "(1/" + questions + ") What is your Project Name?",
        default: this.appname,
        validate: function(input) {
          if (/^([a-zA-Z0-9_]*)$/.test(input)) return true;
          return "Your application name cannot contain special characters or a blank space, using the default name instead";
        }
      },
      {
        type: "list",
        name: "appType",
        message:
          "(2/" + questions + ") What kind of app are you looking to generate?",
        default: "service",
        choices: [
          { name: "MicroService (NestJS)", value: "service" },
          { name: "Fullstack (NESTJS + Angular)", value: "fullstack" }
        ]
      },
      {
        type: "input",
        name: "appPort",
        message: "Your service port?",
        default: "5000",
        validate: value => {
          const regex = new RegExp(/[0-9]/g);
          return regex.test(value);
        }
      },
      {
        type: "list",
        name: "authenticationType",
        message:
          "(3/" +
          questions +
          ") Which *type* of authentication would you like to use?",
        choices: [
          {
            value: "oauth2",
            name:
              "OAuth2 Authentication (stateless, with an OAuth2 server implementation)"
          },
          {
            value: "jwt",
            name: "JWT Token-based authentication (stateless, with a token)"
          }
        ],
        default: "jwt"
      },
      {
        when(answers) {
          return answers.authenticationType === "jwt";
        },
        type: "list",
        name: "databaseType",
        message:
          "(4/" +
          questions +
          ")  Which *type* of database would you like to use?",
        choices: [
          {
            value: "sql",
            name: "SQL (H2, MySQL, PostgreSQL, Oracle)"
          },
          {
            value: "mongodb",
            name: "MongoDB"
          },
          {
            value: "cassandra",
            name: "Cassandra"
          }
        ],
        default: "mongodb"
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    const {
      appName,
      appType,
      authenticationType,
      databaseType,
      appPort
    } = this.props;
    mkdirp(appName);
    this.destinationRoot(path.join(this.destinationRoot(), '/' + appName));
    const templateDockerBasePath = "docker";
    const templateServerBasePath = "server";
    this.fs.copyTpl(
      this.templatePath(templateDockerBasePath),
      this.destinationPath(dockerBasePath),
      { appName, appPort }
    );

    this.fs.copyTpl(
      this.templatePath(serverBasePath + "/.env"),
      this.destinationPath(serverBasePath + "/.env"),
      { appName, appPort }
    );

    this.fs.copyTpl(
      this.templatePath(templateServerBasePath),
      this.destinationPath(serverBasePath),
      { appName, appPort }
    );
    this.config.set("appName", appName);
  }

  install() {
    var elementDir = `${this.destinationPath()}/${serverBasePath}`;
    process.chdir(elementDir);
    this.installDependencies({
      npm: false,
      bower: false,
      yarn: true
    });
  }
};
