const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../../config/authConfig.json");
const User = require("../models/User");
const crypto = require("crypto");
const mailer = require("../../modules/mailer");
const path = require("path");
const hb = require("handlebars");
const fs = require("fs");
const { findByPk } = require("../models/User");

module.exports = {
  async autenticate(req, res) {
    const { email, password, password_has } = req.body;

    const user = await User.findOne({ email });

    if (email !== user.email)
      return res.status(401).json({ error: "Email invalid" });

    if (!(await user.checkPassword(password)))
      return res.status(401).json({ error: "Invalid password" });

    return res.json({ user, token: user.tokenGenerate({ id: user.id }) });
  },

  async update(req, res) {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });

      if (email !== user.email)
        return res.status(400).json({ error: "User not found" });

      const token = crypto.randomBytes(20).toString("hex"); //token com 20 caracteres convertido em hex

      const now = new Date();

      now.setHours(now.getHours() + 1);

      const userupdate = await User.findByPk(user.id);
      user.update({
        password_reset_token: token,
        password_reset_expires: now,
      });

      //console.log(token, now);

      const file = fs.readFileSync(
        path.resolve(
          __dirname,
          "..",
          "..",
          "resources",
          "mail",
          "auth",
          "forgot.hbs"
        ),
        "utf-8"
      );

      const template = hb.compile(file, {
        strict: true,
      })({ token });

      //enviando email:
      mailer.sendMail(
        {
          to: email,
          from: "beterrababir23@gmail.com",
          subject: "Vê se foi o token aí", // Subject line
          text: "olá, token: {token}", // plain text body
          html: template, // html body
          context: { token },
        },
        (err) => {
          if (err)
            return res
              .status(400)
              .json({ error: "Erro na atualização de senha" + err });

          //console.log({ token });
          return res.json({ sucess: "Email sended" });
        }
      );
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: "Error on forgot password " + err });
    }
  },

  async store(req, res) {
    const { email, token, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (email !== user.email)
        return res.status(400).json({ error: "User not found!" });

      const usertoken = await User.findByPk(user.id);

      if (token !== usertoken.password_reset_token)
        return res.status(400).json({ error: "Token invalid" });

      const now = new Date();

      if (now > usertoken.password_reset_expires)
        return res.status(400).json({ error: "Token expired" });

      user.password = password;

      await user.save();

      return res.json({ sucess: "password defined" });
    } catch (err) {
      return res.status(400).json({ error: "deu erro" + err });
    }
  },
};
