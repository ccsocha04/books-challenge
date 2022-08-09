const db = require('../database/models');

let userLoggedMiddleware = (req, res, next) => {
    
    res.locals.isLogged = false;
    res.locals.isAdmin = false;
    
    if (req.session.userLogged) {
        
        res.locals.isLogged = true;
        res.locals.userLogged = req.session.userLogged;

        if (res.locals.userLogged.CategoryId == 1) {
            res.locals.isAdmin = true;
        }
    }
    
    next();
}


module.exports = userLoggedMiddleware;