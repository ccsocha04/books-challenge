const express = require('express');
const mainController = require('../controllers/main');

const validator = require('../middlewares/validatorMiddleware');
const guestMiddleware = require('../middlewares/guestMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', mainController.home);

router.get('/books/detail/:id', mainController.bookDetail);
router.get('/books/search', mainController.bookSearch);
router.post('/books/search', mainController.bookSearchResult);

router.get('/authors', mainController.authors);
router.get('/authors/:id/books', mainController.authorBooks);

router.get('/users/register', guestMiddleware, mainController.register);
router.post('/users/register', validator.register, mainController.processRegister);

router.get('/users/login', guestMiddleware, mainController.login);
router.post('/users/login', validator.login, mainController.processLogin);
router.get('/users/logout', mainController.logout);

router.get('/books/edit/:id', authMiddleware, mainController.edit);
router.put('/books/edit/:id', authMiddleware, validator.book, mainController.processEdit);
router.delete('/books/:id', authMiddleware, mainController.deleteBook);

module.exports = router;
