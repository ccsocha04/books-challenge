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
  processRegister: async (req, res) => {
    let errors = validationResult(req);
    let emailUser = await db.User.findAll({
      where: {
        email: req.body.email
      }
    });  
    if (!errors.isEmpty()) {
      res.render('register', { 
        errors: errors.array(),
        oldData: req.body
      });
    } else if (emailUser.length > 0) {
      res.render('register', {
        errors: [{ msg: 'Email already exists' }],
        oldData: req.body
      });
    } else {
      db.User.create({
        Name: req.body.name,
        Email: req.body.email,
        Country: req.body.country,
        Pass: bcryptjs.hashSync(req.body.password, 10),
        CategoryId: req.body.category
      })
        .then(() => {
          db.Book.findAll({
            include: [{ association: 'authors' }]
          })
            .then((books) => {
              res.render('home', { 
                books,
                msg: 'User registered successfully'
              });
            })
            .catch((error) => console.log(error));
        }).catch((error) => console.log(error));        
    }
  },
  login: (req, res) => {
    // Implement login process
    res.render('login');
  },
  processLogin: (req, res) => {
    // Implement login process
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('login', {
        errors: errors.array(),
        oldData: req.body
      });
    } else {
      db.User.findOne({
        where: {
          email: req.body.email
        }
      })
        .then((user) => {
          if (user) {
            if (bcryptjs.compareSync(req.body.password, user.Pass)) {
              req.session.user = user;
              db.Book.findAll({
                include: [{ association: 'authors' }]
              })
                .then((books) => {
                  res.render('home', { 
                    books,
                    msgLogin: 'User logged in'
                  });
                })
                .catch((error) => console.log(error));
            } else {
              res.render('login', {
                errors: [{ msg: 'Invalid password' }],
                oldData: req.body
              });
            }
          } else {
            res.render('login', {
              errors: [{ msg: 'Unregistered email' }],
              oldData: req.body
            });
          }
        }).catch((error) => console.log(error));
    }
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
          db.Book.findAll({
            include: [{ association: 'authors' }]
          })
            .then((books) => {
              res.render('home', { 
                books,
                msg: 'Book updated successfully'
              });
            })
            .catch((error) => console.log(error));
        }).catch((error) => console.log(error)); 
    }
  }
};

module.exports = mainController;
