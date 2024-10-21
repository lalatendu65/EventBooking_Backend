export function verifyBooking(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized !" });
  }

  if (!req.user.role === "user") {
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
