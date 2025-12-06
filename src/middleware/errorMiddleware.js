// This function catches requests for routes that don't exist
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Passes the error to the next function (errorHandler)
};

// This is our main error handler
export const errorHandler = (err, req, res, next) => {
  // Sometimes an error might come with a 200 (OK) status code,
  // we default it to 500 (Server Error) if that happens.
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  
  res.json({
    message: err.message,
    // We only show the error 'stack' (the detailed error log)
    // if we are in 'development' mode.
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};