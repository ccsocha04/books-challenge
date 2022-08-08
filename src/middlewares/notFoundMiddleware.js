
let notFoundMiddleware = (req, res, next) => {
    res.status(404).render('notFound');
    
    next();
}

module.exports = logMiddleware;