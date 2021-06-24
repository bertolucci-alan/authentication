const nodemailer = require("nodemailer");
const path = require("path");

//módulo para trabalhar com tamplates de email, preencher variáveis em aquivos html:
const hbs = require("nodemailer-express-handlebars");

const { host, port, user, pass } = require("../config/mailerConfig.json");

const transport = nodemailer.createTransport({
  host,
  port,
  auth: {
    user,
    pass,
  },
});

transport.use(
  "compali",
  hbs({
    viewEngine: "handlebars",
    viewPath: path.resolve("./src/resources/mail/"), //diretório
    extName: ".html",
  })
);

module.exports = transport;
