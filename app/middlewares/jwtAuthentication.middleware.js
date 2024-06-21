import "dotenv/config";
import jwt from "jsonwebtoken";

const jwtAuthenticationMiddleware = (req, res, next) => {
  console.log('jwtAuthenticationMiddleware execution')
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("Authorization header manquant");
    return res.status(401).json({ error: "Authorization header manquant" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.log("Token manquant");
    return res.status(401).json({ error: "Token manquant" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    console.log("Token vérifié avec succès:", decodedToken);

    req.userId = decodedToken.userId;
    req.userRole = decodedToken.role

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.log("Token expiré");
      return res.status(403).json({ error: "Token expiré" });
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.log("Token invalide");
      return res.status(401).json({ error: "Token invalide" });
    } else {
      console.log("Erreur interne du serveur", error);
      return res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }
};

export default jwtAuthenticationMiddleware;
