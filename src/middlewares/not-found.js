const notFoundmiddleware = (req, res, next) => {
  res.status(404).json({
    message: `requested url: ${req.medthod} ${req.url} was not found on this server`,
  });
};

module.exports = notFoundmiddleware;
