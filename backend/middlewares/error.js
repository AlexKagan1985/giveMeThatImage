export function errorHandler(err, _req, res, _next) {
  console.log(err);
  res.status(500).send("something bad happened: " + err.message);
}
