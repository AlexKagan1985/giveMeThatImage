export function errorHandler(err, _req, res, _next) {
  res.status(500).send("something bad happened: " + err.message);
}
