const { body } = require('express-validator');

const validator = {
    book: [
        body('title').notEmpty().withMessage('Title is required'),
        body('cover').notEmpty().withMessage('Cover is required'),
        body('description').notEmpty().withMessage('Description is required')
    ],
    register: [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').notEmpty().withMessage('Email is required').bail()
            .isEmail().withMessage('Invalid Email'),
        body('country').notEmpty().withMessage('Country is required'),
        body('password').notEmpty().withMessage('Password is required'),
        body('category').notEmpty().withMessage('Category is required')
    ],
    login: [
        body('email').notEmpty().withMessage('Email is required').bail()
            .isEmail().withMessage('Invalid Email'),
        body('password').notEmpty().withMessage('Password is required')
    ]
}

module.exports = validator;