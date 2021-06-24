const jwt = require("jsonwebtoken");
const authConfig = require("../../config/authConfig.json");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const parts = authHeader.split(" "); //separando as duas partes do token

  if (!parts.length === 2)
    return res.status(401).json({ error: "Token error" });

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme))
    //reject verificando se o scheme começa com Bearer
    return res.status(401).json({ error: "Token malformated" });

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Token invalid" });

    req.userId = decoded.id;

    return next();
  });
};
