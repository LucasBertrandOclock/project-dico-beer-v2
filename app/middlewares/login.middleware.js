function isLoggedIn(req, res, next) {
  console.log("isLoggedIn execution");
  if (req.userId && req.userRole) {
    console.log("isLoggedIn succes");
    next();
  } else {
    console.log("isLoggedIn ErrorConnection");
    res.status(401).json({ message: "Vous devez vous connecter" });
  }
}

function isAdmin(req, res, next) {
  console.log("isAdmin execution");
  if (req.userId && req.userRole === "admin") {
    next();
  } else {
    res
      .status(401)
      .json({ message: "Vous devez être admin pour acceder à cette fontion" });
  }
}

export { isLoggedIn, isAdmin };
