export function verifyAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized !" });
  }
  if (!req.user.role === "admin") {
    return res.status(403).json({ message: "only admin can access the api" });
  }
  next();
}

export function verifyUpdate(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized !" });
  }
  if (!req.user.role === "admin") {
    return res.status(403).json({ message: "only admin can access the api" });
  }
  if (!req.params.id) {
    return res.status(400).json({ message: "id is required" });
  }
  if (req.body.length === 0) {
    return res.status(400).json({ message: "body is required" });
  }
  next();
}

export function verifyCreate(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized !" });
  }
  if (!req.user.role === "admin") {
    return res.status(403).json({ message: "only admin can access the api" });
  }
  if (req.body.length === 0) {
    return res.status(400).json({ message: "body is required" });
  }
  next();
}

export function verifyGet(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized !" });
  }
  if (!req.user.role === "admin") {
    return res.status(403).json({ message: "only admin can access the api" });
  }
  if (!req.params.id) {
    return res.status(400).json({ message: "id is required" });
  }
  next();
}
