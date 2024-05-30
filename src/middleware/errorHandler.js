const errorHandler = (err, req, res, next) => {
    const errStatus = err.status || 500
    const errMessage = err.message || "An error occurred"
    res.status(errStatus).json({ message: errMessage });
};

module.exports = errorHandler 