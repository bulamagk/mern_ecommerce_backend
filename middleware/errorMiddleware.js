// Not found error middleware
const notFound = (req, res, next) => {
  const error = new Error(`Not found | ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error middleware
const errorHandler = (error, req, res, next) => {
  let statusCode = res.statusCode == 200 ? 500 : res.statusCode;
  let message = error.message;

  // Check for Mongoose Object ID error
  if (error.name === "CastError" && error.kind === "ObjectId") {
    message = "Resource not found";
    statusCode = 404;
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV == "production" ? null : error.stack,
  });
};

module.exports = { notFound, errorHandler };
