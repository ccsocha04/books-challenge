
let notFoundMiddleware = (req, res, next) => {
    res.status(404).render('notFound');
}

module.exports = notFoundMiddleware;