const fs = require('fs');

let logMiddleware = (req, res, next) => {
    fs.appendFileSync('log.txt', `${req.method} ${req.url} ${new Date()} \n`);
    
    next();
}

module.exports = logMiddleware;