const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../database/models');

const mainController = {
  home: (req, res) => {
    db.Book.findAll({
      include: [{ association: 'authors' }]
    })
      .then((books) => {
        res.render('home', { books });
      })
      .catch((error) => console.log(error));
  },
  bookDetail: (req, res) => {
    // Implement look for details in the database
    db.Book.findByPk(req.params.id, {
      include: [{ association: 'authors' }]
    })
      .then((book) => {
        res.render('bookDetail', { book });
      })
      .catch((error) => console.log(error));
  },
  bookSearch: (req, res) => {
    res.render('search', { books: [] });
  },
  bookSearchResult: (req, res) => {
    // Implement search by title
    let searchTitle = req.body.title;
    db.Book.findAll({
      include: [{ association: 'authors' }],
      where: {
        title: {
          [db.Sequelize.Op.like]: `%${searchTitle}%`
        }
      }
    })
      .then((books) => {
        res.render('search', { books });
      })
      .catch((error) => console.log(error));
  },
  deleteBook: (req, res) => {
    // Implement delete book
    res.send('delete book');
    // res.render('home');
  },
  authors: (req, res) => {
    db.Author.findAll()
      .then((authors) => {
        res.render('authors', { authors });
      })
      .catch((error) => console.log(error));
  },
  authorBooks: (req, res) => {
    // Implement books by author
    db.Author.findByPk(req.params.id, {
      include: [{ association: 'books' }]
    })
      .then((author) => {
        res.render('authorBooks', { author });
      })
      .catch((error) => console.log(error));
  },
  register: (req, res) => {
    res.render('register');
  },
  processRegister: (req, res) => {
    db.User.create({
      Name: req.body.name,
      Email: req.body.email,
      Country: req.body.country,
      Pass: bcryptjs.hashSync(req.body.password, 10),
      CategoryId: req.body.category
    })
      .then(() => {
        res.redirect('/');
      })
      .catch((error) => console.log(error));
  },
  login: (req, res) => {
    // Implement login process

    res.render('login');
  },
  processLogin: (req, res) => {
    // Implement login process
    res.send('Session started id: ' + req.session.id);
    // res.render('home');
  },
  edit: (req, res) => {
    // Implement edit book
    db.Book.findByPk(req.params.id)
      .then((book) => {
        res.render('editBook', { book });
      }).catch((error) => console.log(error));
  },
  processEdit: async (req, res) => {
    // Implement edit book
    let errors = validationResult(req);
    let book = await db.Book.findByPk(req.params.id);
    if (!errors.isEmpty()) {
      res.render('editBook', { 
        book,
        errors: errors.array(),
        oldData: req.body
      });
    } else {
      db.Book.update({
        title: req.body.title,
        cover: req.body.cover,
        description: req.body.description
      }, {
        where: {
          id: req.params.id
        }
      })
        .then(() => {
          res.redirect('/');
        })
        .catch((error) => console.log(error)); 
    }
  }
};

module.exports = mainController;
